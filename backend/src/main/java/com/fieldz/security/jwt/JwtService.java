package com.fieldz.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.alg:HS256}") private String alg;
    @Value("${jwt.access.expMinutes:10}") private long expiresMinutes; // 5-15 min recommandé
    @Value("${jwt.hs256.secret:change-me}") private String hsSecret;
    @Value("${jwt.rs256.private:keys/private.pem}") private String privPath;
    @Value("${jwt.rs256.public:keys/public.pem}") private String pubPath;

    private Key hmacKey;
    private PrivateKey rsaPriv;
    private PublicKey rsaPub;

    private synchronized void ensureKeys() {
        if ("RS256".equalsIgnoreCase(alg) && rsaPriv == null) {
            rsaPriv = KeyLoader.loadPrivateKeyPem(privPath);
            rsaPub  = KeyLoader.loadPublicKeyPem(pubPath);
        } else if (!"RS256".equalsIgnoreCase(alg) && hmacKey == null) {
            hmacKey = Keys.hmacShaKeyFor(hsSecret.getBytes(StandardCharsets.UTF_8));
        }
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (Exception e) { return false; }
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(UserDetails user, Map<String,Object> extraClaims) {
        return generateToken(user.getUsername(), extraClaims);
    }

    public String generateToken(String subject, Map<String,Object> extraClaims) {
        ensureKeys();
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expiresMinutes * 60);
        JwtBuilder b = Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .addClaims(extraClaims == null ? Map.of() : extraClaims);

        if ("RS256".equalsIgnoreCase(alg)) {
            return b.signWith(rsaPriv, SignatureAlgorithm.RS256).compact();
        } else {
            return b.signWith(hmacKey, SignatureAlgorithm.HS256).compact();
        }
    }

    private Claims extractAllClaims(String token) {
        ensureKeys();
        JwtParserBuilder pb = Jwts.parserBuilder();
        if ("RS256".equalsIgnoreCase(alg)) pb.setSigningKey(rsaPub);
        else pb.setSigningKey(hmacKey);
        return pb.build().parseClaimsJws(token).getBody();
    }
}
