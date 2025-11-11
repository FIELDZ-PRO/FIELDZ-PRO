package com.fieldz.service;

import com.fieldz.model.RefreshToken;
import com.fieldz.repository.RefreshTokenRepository;
import com.fieldz.util.HashUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final SecureRandom rnd = new SecureRandom();

    @Value("${jwt.refresh.expDays:15}")
    private int refreshExpDays;

    public record Issued(String raw, RefreshToken entity) {}

    /** Crée un opaque token URL-safe (facile à mettre en cookie) */
    public String newOpaque() {
        byte[] b = new byte[64]; // 64 bytes -> ~86 chars url-safe
        rnd.nextBytes(b);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(b);
    }

    private String shortHash(String raw) {
        return HashUtils.sha256Base64(raw).substring(0, 8);
    }

    /** Émission d’un refresh token (sauvegardé en DB sous forme hashée) */
    @Transactional
    public Issued issue(Long userId, String userAgent, String ip) {
        String raw  = newOpaque();
        String hash = HashUtils.sha256Base64(raw);

        RefreshToken rt = new RefreshToken();
        rt.setUserId(userId);
        rt.setTokenHash(hash); // en DB: SHA-256 -> Base64 standard (44 chars)
        rt.setUserAgent(userAgent);
        rt.setIp(ip);
        rt.setExpiresAt(Instant.now().plus(refreshExpDays, ChronoUnit.DAYS));

        repo.save(rt);

        log.info("[RT ISSUE] userId={} raw#={} hash={} exp={}", userId, shortHash(raw), hash, rt.getExpiresAt());
        repo.findByTokenHash(hash).ifPresentOrElse(
                saved -> log.info("[RT ISSUE] persisted id={} revoked={}", saved.getId(), saved.isRevoked()),
                () -> log.warn("[RT ISSUE] NOT FOUND after save (transaction/DB mismatch)")
        );

        return new Issued(raw, rt);
    }

    /** Valide un refresh brut reçu (cookie) -> retourne l’entité si OK */
    public Optional<RefreshToken> validateRaw(String raw) {
        if (raw == null || raw.isBlank()) return Optional.empty();
        String hash = HashUtils.sha256Base64(raw);
        log.info("[RT VALIDATE] raw#={} hash={}", shortHash(raw), hash);
        return repo.findByTokenHash(hash)
                .filter(rt -> !rt.isRevoked() && rt.getExpiresAt().isAfter(Instant.now()));
    }

    /** Rotation : révoque l’ancien, émet un nouveau et retourne le nouveau raw */
    @Transactional
    public String rotate(RefreshToken oldRt, String userAgent, String ip) {
        oldRt.setRevoked(true);
        repo.save(oldRt);

        String raw  = newOpaque();
        String hash = HashUtils.sha256Base64(raw);

        RefreshToken rt = new RefreshToken();
        rt.setUserId(oldRt.getUserId());
        rt.setTokenHash(hash);
        rt.setUserAgent(userAgent);
        rt.setIp(ip);
        rt.setExpiresAt(Instant.now().plus(refreshExpDays, ChronoUnit.DAYS));
        repo.save(rt);

        log.info("[RT ROTATE] oldId={} revoked=true -> newHash={} exp={}", oldRt.getId(), hash, rt.getExpiresAt());
        return raw;
    }

    @Transactional
    public void revoke(RefreshToken rt) {
        rt.setRevoked(true);
        repo.save(rt);
        log.info("[RT REVOKE] id={} hash={} revoked=true", rt.getId(), rt.getTokenHash());
    }

    @Transactional
    public void revokeAllForUser(Long userId) {
        repo.deleteByUserId(userId);
        log.info("[RT REVOKE ALL] userId={}", userId);
    }

    @Transactional
    public void cleanupExpired() {
        long deleted = repo.deleteByExpiresAtBefore(Instant.now());
        log.info("[RT CLEANUP] deletedExpired={}", deleted);
    }
}
