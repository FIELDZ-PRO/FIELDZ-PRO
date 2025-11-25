package com.fieldz.auth;

import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;
import com.fieldz.security.abuse.LoginRateLimiter;
import com.fieldz.security.jwt.JwtService;
import com.fieldz.service.PasswordResetService;
import com.fieldz.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final RefreshTokenService refreshTokenService;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtService jwtService;
    private final LoginRateLimiter rateLimiter;

    @Value("${security.cookies.domain:}")
    private String cookieDomain;          // laisser vide en DEV
    @Value("${security.cookies.secure:false}")
    private boolean cookieSecure;         // true en PROD (HTTPS)
    @Value("${jwt.access.expMinutes:10}")
    private long accessExpMinutes;

    private static final String RT_COOKIE = "refresh_token";
    private static final String AUTH_PATH = "/api/auth";

    /* =========================
       Helpers cookies (ResponseCookie)
       ========================= */

    private ResponseCookie buildRtCookie(String raw) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(RT_COOKIE, raw)
                .httpOnly(true)
                .secure(cookieSecure)
                .path(AUTH_PATH)               // unique path pour éviter les collisions
                .sameSite("Lax")               // si front sur autre origin: "None" + secure(true)
                .maxAge(Duration.ofDays(15));
        if (cookieDomain != null && !cookieDomain.isBlank()) b.domain(cookieDomain);
        ResponseCookie c = b.build();
        logCookieDiag(c, "SET-RT");
        return c;
    }

    private ResponseCookie clearRtCookieAt(String path) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(RT_COOKIE, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path(path)
                .sameSite("Lax")
                .maxAge(0);
        if (cookieDomain != null && !cookieDomain.isBlank()) b.domain(cookieDomain);
        ResponseCookie c = b.build();
        logCookieDiag(c, "CLEAR-RT@" + path);
        return c;
    }

    private void logCookieDiag(ResponseCookie c, String label) {
        log.info("[{}] name={} path={} domain={} httpOnly={} secure={} maxAge={} sameSite={}",
                label, c.getName(), c.getPath(), c.getDomain(), c.isHttpOnly(), c.isSecure(),
                c.getMaxAge(), c.getSameSite());
    }


    /* =========================
       Endpoints
       ========================= */

    // -------- Register --------
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // -------- Login : pose le cookie refresh + reset rate-limit --------
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request,
                                                        HttpServletRequest httpReq) {
        String ip = httpReq.getRemoteAddr();
        String ua = httpReq.getHeader("User-Agent");

        if (rateLimiter.isLocked(request.getEmail(), ip)) {
            return ResponseEntity.status(423).build(); // Locked
        }

        try {
            AuthenticationResponse authResp = authService.authenticate(request);
            rateLimiter.onSuccess(request.getEmail(), ip);

            Utilisateur u = utilisateurRepository.findByEmail(request.getEmail()).orElseThrow();

            var issued = refreshTokenService.issue(u.getId(), ua, ip);
            ResponseCookie set = buildRtCookie(issued.raw());

            // Assainir d'anciens cookies mal-pathés (problème que tu as rencontré)
            ResponseCookie clr1 = clearRtCookieAt("/api/auth/refresh");
            ResponseCookie clr2 = clearRtCookieAt("/api/auth/login");

            log.info("[LOGIN OK] userId={} ip={} ua={} refreshHashSaved", u.getId(), ip, ua);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, set.toString())
                    .header(HttpHeaders.SET_COOKIE, clr1.toString())
                    .header(HttpHeaders.SET_COOKIE, clr2.toString())
                    .body(authResp);

        } catch (Exception e) {
            rateLimiter.onFailure(request.getEmail(), ip);
            log.warn("[LOGIN FAIL] email={} ip={} reason={}", request.getEmail(), ip, e.getMessage());
            throw e;
        }
    }

    // -------- Refresh : rotation + nouveau access --------
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(
            @CookieValue(value = RT_COOKIE, required = false) String raw,
            HttpServletRequest httpReq) {

        log.info("[REFRESH] cookieRaw={}", raw);

        var valid = refreshTokenService.validateRaw(raw);
        if (valid.isEmpty()) {
            log.warn("[REFRESH 401] cookie invalide/revoqué/expiré");
            // Efface le cookie au chemin principal pour éviter un état sale côté client
            ResponseCookie clear = clearRtCookieAt(AUTH_PATH);
            return ResponseEntity.status(401)
                    .header(HttpHeaders.SET_COOKIE, clear.toString())
                    .build();
        }

        var rt = valid.get();
        String ua = httpReq.getHeader("User-Agent");
        String ip = httpReq.getRemoteAddr();

        // rotation du refresh
        String newRaw = refreshTokenService.rotate(rt, ua, ip);
        ResponseCookie set = buildRtCookie(newRaw);
        // nettoie aussi un éventuel ancien cookie à /api/auth/refresh
        ResponseCookie clr = clearRtCookieAt("/api/auth/refresh");

        Utilisateur u = utilisateurRepository.findById(rt.getUserId()).orElseThrow();
        String role = u.getTypeRole().name();
        String access = jwtService.generateToken(u.getEmail(), Map.of("role", role));

        AuthenticationResponse resp = AuthenticationResponse.builder()
                .token(access)
                // .expiresIn(accessExpMinutes * 60)
                // .role(role)
                .build();

        log.info("[REFRESH OK] userId={} newAccessIssued", u.getId());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, set.toString())
                .header(HttpHeaders.SET_COOKIE, clr.toString())
                .body(resp);
    }

    // -------- Logout : révocation + clear cookie --------
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = RT_COOKIE, required = false) String raw) {
        refreshTokenService.validateRaw(raw).ifPresent(refreshTokenService::revoke);

        ResponseCookie clearMain = clearRtCookieAt(AUTH_PATH);
        ResponseCookie clearAlt1 = clearRtCookieAt("/api/auth/refresh");
        ResponseCookie clearAlt2 = clearRtCookieAt("/api/auth/login");

        log.info("[LOGOUT] cookie cleared");
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearMain.toString())
                .header(HttpHeaders.SET_COOKIE, clearAlt1.toString())
                .header(HttpHeaders.SET_COOKIE, clearAlt2.toString())
                .build();
    }

    // -------- Mot de passe : flux existants --------
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) {
        passwordResetService.generateResetToken(email);
        return ResponseEntity.ok("Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token,
                                                @RequestParam("newPassword") String newPassword) {
        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }
}
