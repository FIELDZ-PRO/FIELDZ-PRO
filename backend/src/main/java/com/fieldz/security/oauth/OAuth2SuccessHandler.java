package com.fieldz.security.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fieldz.security.jwt.JwtService;
import com.fieldz.model.Utilisateur;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final ObjectMapper objectMapper; // fourni par Spring

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
        Utilisateur utilisateur = customUser.getUtilisateur();

        // Token d’accès (pour l’instant sans refresh/cookies — hotfix)
        String jwt = jwtService.generateToken(utilisateur);
        log.info("✅ OAuth2SuccessHandler: login OK pour {}", utilisateur.getEmail());

        // Pas de token en query string (évite fuite via referrer/historique)
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("text/html; charset=UTF-8");

        // JSON-escape pour injection-safe dans le JS
        String tokenJson = objectMapper.writeValueAsString(jwt);
        String tokenUri = URLEncoder.encode(jwt, StandardCharsets.UTF_8);

        // Compatibilité front :
        //  - on met le token en sessionStorage (idéal pour la transition)
        //  - on redirige avec un FRAGMENT #token=... (pas loggé côté serveurs)
        //  - TEMPORAIRE: on remplit aussi localStorage si le front s’y attend encore
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
                      // TODO: à retirer après migration vers cookies HttpOnly
                      localStorage.setItem('fieldz_access', token);
                    } catch (e) {
                      console.error('Storage error', e);
                    }
                    window.location.replace('http://localhost:5173/oauth-success#token=%s');
                  })();
                </script>
              </body>
            </html>
            """.formatted(tokenJson, tokenUri);

        response.getWriter().write(html);
    }
}
