package com.fieldz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();

        // 🔒 Origines strictes — pour dev & tests, ajoute ici ton IP si besoin
        cfg.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        // Autoriser l’envoi des cookies ou credentials (si besoin JWT Cookie)
        cfg.setAllowCredentials(true);

        // Méthodes HTTP autorisées
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // ✅ Headers autorisés (inclut Cache-Control + tout le nécessaire)
        cfg.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Cache-Control",
                "Pragma",
                "Expires",
                "Accept",
                "Accept-Language",
                "X-Requested-With",
                "If-None-Match",
                "If-Modified-Since",
                "X-CSRF-Token"
        ));

        // Headers que le front peut lire dans la réponse (optionnel mais utile)
        cfg.setExposedHeaders(List.of(
                "Location",
                "Content-Disposition",
                "ETag"
        ));

        // Durée du cache du préflight (en secondes)
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return new CorsFilter(source);
    }
}
