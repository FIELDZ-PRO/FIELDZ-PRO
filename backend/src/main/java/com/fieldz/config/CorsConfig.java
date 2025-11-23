package com.fieldz.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration CORS centralisee pour FIELDZ.
 * Supporte les profils dev et prod via les variables d'environnement.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:https://fieldz-pro.vercel.app}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE,PATCH,OPTIONS}")
    private String allowedMethods;

    @Value("${cors.allowed-headers:Authorization,Content-Type,Cache-Control,Pragma,Expires,Accept,Accept-Language,X-Requested-With,If-None-Match,If-Modified-Since,X-CSRF-Token}")
    private String allowedHeaders;

    /**
     * Bean CorsFilter pour le filtrage CORS global.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();

        // Origines autorisees (depuis les variables d'environnement)
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        cfg.setAllowedOriginPatterns(origins);
        cfg.setAllowCredentials(true);

        cfg.setAllowedMethods(Arrays.stream(allowedMethods.split(","))
                .map(String::trim)
                .toList());

        cfg.setAllowedHeaders(Arrays.stream(allowedHeaders.split(","))
                .map(String::trim)
                .toList());

        cfg.setExposedHeaders(List.of(
                "Location",
                "Content-Disposition",
                "ETag",
                "Set-Cookie",
                "X-Total-Count",
                "X-Total-Pages"
        ));

        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return new CorsFilter(source);
    }
}
