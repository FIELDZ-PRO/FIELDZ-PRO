package com.fieldz.security.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fieldz.model.Utilisateur;
import com.fieldz.security.jwt.JwtService;
import com.fieldz.service.RefreshTokenService;
import com.fieldz.service.RefreshTokenService.Issued;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * OAuth2 success handler :
 *  - génère un access token (JWT)
 *  - génère un refresh token (opaque) et le pose en cookie HttpOnly (SameSite configurable)
 *  - redirige le navigateur vers le front (/oauth-success)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final ObjectMapper objectMapper;

    // ---------- Config par propriétés / .env ----------
    @Value("${jwt.refresh.cookieName:REFRESH_TOKEN}")
    private String refreshCookieName;

    // Dev : SameSite=Lax, Secure=false, Domain vide
    // Prod (front ≠ back) : SameSite=None, Secure=true, Domain=.tondomaine.com
    @Value("${app.cookie.same-site:Lax}")
    private String cookieSameSite;
    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;
    @Value("${app.cookie.domain:}")
    private String cookieDomain;
    @Value("${app.cookie.path:/api/auth}") // ⬅️ important: pour que le cookie s'envoie aussi à /logout
    private String cookiePath;

    @Value("${jwt.refresh.expDays:15}")
    private int refreshExpDays;

    // Redirection front après succès OAuth2
    @Value("${app.oauth2.redirect-success:http://localhost:5173/oauth-success}")
    private String frontendRedirect;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // Récupère l'utilisateur applicatif depuis ton CustomOAuth2User
        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        Utilisateur utilisateur = customUser.getUtilisateur();

        // 1) Générer l'access token (signature compatible avec ton JwtService)
        //    → inclut uid + role pour éviter un lookup ultérieur côté front
        String accessToken = jwtService.generateToken(
                utilisateur.getEmail(),
                Map.of(
                        "uid", utilisateur.getId(),
                        "role", utilisateur.getTypeRole().name()
                )
        );

        // 2) Générer le refresh token (raw) via ton service
        Issued issued = refreshTokenService.issue(
                utilisateur.getId(),
                request.getHeader("User-Agent"),
                getIp(request)
        );

        // 3) Poser le cookie HttpOnly + SameSite (+ Secure/Domain si besoin)
        int maxAgeSeconds = 60 * 60 * 24 * refreshExpDays;
        addRefreshSetCookieHeader(response, issued.raw(), maxAgeSeconds);

        log.info("✅ OAuth2SuccessHandler: login OK pour {}", utilisateur.getEmail());

        // 4) Anti-cache
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("text/html; charset=UTF-8");

        // 5) Rediriger le front avec access token en fragment (temporaire)
        String tokenJson = objectMapper.writeValueAsString(accessToken);
        String tokenUri = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

        String html = """
                <!doctype html>
                <html lang="fr">
                  <head>
                    <meta charset="utf-8">
                    <meta http-equiv="Cache-Control" content="no-store" />
                    <title>Connexion…</title>
                  </head>
                  <body>
                    <script>
                      (function () {
                        var token = %s;
                        try {
                          sessionStorage.setItem('fieldz_access', token);
                          // ⚠️ temporaire : à supprimer quand le front utilisera
                          // exclusivement le /auth/refresh + cookie HttpOnly
                          localStorage.setItem('fieldz_access', token);
                        } catch (e) {
                          console.error('Storage error', e);
                        }
                        window.location.replace('%s#token=%s');
                      })();
                    </script>
                  </body>
                </html>
                """.formatted(tokenJson, frontendRedirect, tokenUri);

        response.getWriter().write(html);
    }

    // ----------------------------------------------------------
    // Utils : Set-Cookie explicite (SameSite supporté) + IP
    // ----------------------------------------------------------
    private void addRefreshSetCookieHeader(HttpServletResponse res, String value, int maxAgeSeconds) {
        StringBuilder sb = new StringBuilder();
        sb.append(refreshCookieName).append("=").append(value == null ? "" : value)
                .append("; Path=").append(cookiePath)
                .append("; HttpOnly");
        if (cookieDomain != null && !cookieDomain.isBlank()) sb.append("; Domain=").append(cookieDomain);
        if (cookieSecure) sb.append("; Secure");
        sb.append("; Max-Age=").append(maxAgeSeconds);
        sb.append("; SameSite=").append(cookieSameSite);
        res.addHeader("Set-Cookie", sb.toString());
    }

    private String getIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return req.getRemoteAddr();
    }
}
