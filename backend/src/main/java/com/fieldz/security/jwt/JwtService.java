package com.fieldz.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final Key hmacKey;
    private final long expiresMinutes;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expires-min:10}") long expiresMinutes
    ) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("jwt.secret must be at least 32 chars.");
        }
        this.hmacKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiresMinutes = Math.max(1, expiresMinutes); // clamp ≥ 1
    }

    // ====== Generate tokens ======

    public String generateToken(UserDetails userDetails) {
        // Si UserDetails est ton Utilisateur, on peut mettre le rôle
        String role = null;
        if (userDetails instanceof com.fieldz.model.Utilisateur u && u.getTypeRole() != null) {
            role = u.getTypeRole().name();
        }
        return generateToken(userDetails.getUsername(),
                role == null ? Map.of() : Map.of("role", role));
    }

    public String generateToken(String subject, Map<String, Object> extraClaims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expiresMinutes * 60);

        JwtBuilder builder = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(hmacKey, SignatureAlgorithm.HS256);

        if (extraClaims != null && !extraClaims.isEmpty()) {
            builder.addClaims(extraClaims);
        }
        return builder.compact();
    }

    // Variante utilitaire
    public String generateTokenWithEmailAndRole(String email, String role) {
        return generateToken(email, Map.of("role", role));
    }

    // ====== Parse / validate ======

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(hmacKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }

    public boolean isTokenValid(String token, UserDetails expectedUser) {
        try {
            final String username = extractUsername(token);
            return username != null
                    && username.equals(expectedUser.getUsername())
                    && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        Date exp = extractClaim(token, Claims::getExpiration);
        return exp.before(new Date());
    }

    // ====== Note migration RS256 (plus tard) ======
    // Remplacer hmacKey par PrivateKey/PublicKey et:
    // .signWith(privateKey, SignatureAlgorithm.RS256)
    // parserBuilder().setSigningKey(publicKey)
}
