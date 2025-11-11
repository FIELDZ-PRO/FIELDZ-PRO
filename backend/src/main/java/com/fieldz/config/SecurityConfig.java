package com.fieldz.config;

import com.fieldz.security.jwt.JwtAuthenticationFilter;
import com.fieldz.security.oauth.CustomOAuth2UserService;
import com.fieldz.security.oauth.OAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CustomOAuth2UserService oauth2UserService;
    private final OAuth2SuccessHandler oauth2SuccessHandler;

    // =======================
    // ⚙️ CHAIN API
    // =======================
    @Bean
    @Order(1)
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                // ---------- HEADERS ----------
                .headers(h -> h
                        .xssProtection(HeadersConfigurer.XXssConfig::disable)
                        .frameOptions(f -> f.deny())
                        .addHeaderWriter(new StaticHeadersWriter("Referrer-Policy", "same-origin"))
                        .addHeaderWriter(new StaticHeadersWriter("X-Content-Type-Options", "nosniff"))
                        .addHeaderWriter(new StaticHeadersWriter("Permissions-Policy",
                                "geolocation=(), microphone=(), camera=()"))
                        .addHeaderWriter(new StaticHeadersWriter("Strict-Transport-Security",
                                "max-age=31536000; includeSubDomains"))
                        .addHeaderWriter(new StaticHeadersWriter("Content-Security-Policy",
                                "default-src 'self'; " +
                                        "img-src 'self' data: https:; " +
                                        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 http://127.0.0.1:5173; " +
                                        "style-src 'self' 'unsafe-inline' http://localhost:5173; " +
                                        "connect-src 'self' http://localhost:8080 http://192.168.100.16:8080 http://localhost:5173;"))
                )

                // ---------- EXCEPTIONS ----------
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"error\":\"Unauthorized\"}");
                        })
                        .accessDeniedHandler((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"error\":\"Forbidden\"}");
                        })
                )

                // ---------- SESSIONS ----------
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ---------- ROUTES ----------
                .authorizeHttpRequests(auth -> auth
                        // Préflight
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()

                        // Auth publique
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/refresh",
                                "/api/auth/logout",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password/**"
                        ).permitAll()

                        // Docs & utilitaires
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/api/contact"
                        ).permitAll()

                        // Accès public
                        .requestMatchers("/api/club/search/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/club/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/creneaux/club/*").permitAll()

                        // Rôles protégés
                        .requestMatchers("/api/joueur/**").hasRole("JOUEUR")
                        .requestMatchers("/api/club/**").hasRole("CLUB")

                        .anyRequest().authenticated()
                )

                // ---------- AUTH ----------
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable);

        return http.build();
    }

    // =======================
    // 🌐 CHAIN WEB
    // =======================
    @Bean
    @Order(2)
    SecurityFilterChain web(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                // ---------- HEADERS ----------
                .headers(h -> h
                        .xssProtection(HeadersConfigurer.XXssConfig::disable)
                        .frameOptions(f -> f.sameOrigin()) // autorise H2-console
                        .addHeaderWriter(new StaticHeadersWriter("Referrer-Policy", "same-origin"))
                        .addHeaderWriter(new StaticHeadersWriter("X-Content-Type-Options", "nosniff"))
                        .addHeaderWriter(new StaticHeadersWriter("Permissions-Policy",
                                "geolocation=(), microphone=(), camera=()"))
                        .addHeaderWriter(new StaticHeadersWriter("Strict-Transport-Security",
                                "max-age=31536000; includeSubDomains"))
                        .addHeaderWriter(new StaticHeadersWriter("Content-Security-Policy",
                                "default-src 'self'; " +
                                        "img-src 'self' data: https:; " +
                                        "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 http://127.0.0.1:5173; " +
                                        "style-src 'self' 'unsafe-inline' http://localhost:5173; " +
                                        "connect-src 'self' http://localhost:8080 http://192.168.100.16:8080 http://localhost:5173;"))
                )

                // ---------- ROUTES WEB ----------
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/oauth2/**",
                                "/login/**",
                                "/h2-console/**",
                                "/error", "/favicon.ico",
                                "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html"
                        ).permitAll()

                        .requestMatchers("/", "/index.html", "/assets/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().permitAll()
                )

                // ---------- OAUTH2 GOOGLE ----------
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("http://localhost:5173/oauth-success", true)
                        .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService))
                        .successHandler(oauth2SuccessHandler)
                );

        return http.build();
    }

    // =======================
    // 🌍 CORS (frontend 5173)
    // =======================
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    // =======================
    // 🔑 AUTH MANAGER
    // =======================
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
