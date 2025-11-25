package com.fieldz.security.abuse;

import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {
    private record Counter(int attempts, Instant firstAt, Instant lockedUntil) {}
    private final Map<String, Counter> byKey = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_SEC = 10 * 60; // 10 min
    private static final long LOCK_SEC = 15 * 60;   // 15 min

    private String key(String email, String ip) { return email.toLowerCase() + "|" + ip; }

    public synchronized boolean isLocked(String email, String ip) {
        var c = byKey.get(key(email, ip));
        return c != null && c.lockedUntil() != null && c.lockedUntil().isAfter(Instant.now());
    }
    public synchronized void onSuccess(String email, String ip) { byKey.remove(key(email, ip)); }
    public synchronized void onFailure(String email, String ip) {
        var k = key(email, ip);
        var now = Instant.now();
        var c = byKey.get(k);
        if (c == null || now.isAfter(c.firstAt().plusSeconds(WINDOW_SEC))) {
            byKey.put(k, new Counter(1, now, null));
            return;
        }
        int attempts = c.attempts() + 1;
        if (attempts >= MAX_ATTEMPTS) {
            byKey.put(k, new Counter(attempts, c.firstAt(), now.plusSeconds(LOCK_SEC)));
        } else {
            byKey.put(k, new Counter(attempts, c.firstAt(), null));
        }
    }
}
