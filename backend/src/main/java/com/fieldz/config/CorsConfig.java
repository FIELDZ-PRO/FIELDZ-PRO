package com.fieldz.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    // 🧩 Ces valeurs viennent de application.properties ou .env
    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE,PATCH,OPTIONS}")
    private String allowedMethods;

    @Value("${cors.allowed-headers:Authorization,Content-Type,Cache-Control,Pragma,Expires,Accept,Accept-Language,X-Requested-With,If-None-Match,If-Modified-Since,X-CSRF-Token}")
    private String allowedHeaders;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();

        // 🔓 Lis les origines depuis les variables
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .toList();
        cfg.setAllowedOrigins(origins);

        // ✅ Autorise les cookies (indispensable pour refresh_token HttpOnly)
        cfg.setAllowCredentials(true);

        // 🔧 Méthodes et headers
        cfg.setAllowedMethods(Arrays.asList(allowedMethods.split(",")));
        cfg.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));

        // ✅ Headers visibles côté front (cookie + pagination)
        cfg.setExposedHeaders(List.of(
                "Location",
                "Content-Disposition",
                "ETag",
                "Set-Cookie"
        ));

        // ⏱ Cache du préflight
        cfg.setMaxAge(3600L);

        // Appliquer sur toutes les routes
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);

        return new CorsFilter(source);
    }
}
