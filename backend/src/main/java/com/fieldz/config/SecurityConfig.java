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

    // -------- CHAIN API --------
    @Bean
    @Order(1)
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/**")
                // Utilise le bean CORS (CorsFilter) défini dans CorsConfig
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                // Headers de sécurité (API)
                .headers(h -> h
                        .xssProtection(HeadersConfigurer.XXssConfig::disable)  // obsolète, on désactive explicitement
                        .frameOptions(f -> f.deny())
                        .addHeaderWriter(new StaticHeadersWriter("Referrer-Policy", "same-origin"))
                        .addHeaderWriter(new StaticHeadersWriter("X-Content-Type-Options", "nosniff"))
                )

                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

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

                .authorizeHttpRequests(auth -> auth
                        // Preflight CORS sur l’API
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()

                        // Endpoints publics API
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html",
                                "/api/contact"
                        ).permitAll()

                        // Consultation publique
                        .requestMatchers("/api/club/search/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/club/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/creneaux/club/*").permitAll()

                        // Rôles API
                        .requestMatchers("/api/joueur/**").hasRole("JOUEUR")
                        .requestMatchers("/api/club/**").hasRole("CLUB")

                        .anyRequest().authenticated()
                )

                // Auth/JWT
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Pas de formLogin/basic/logout sur l'API
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable);

        return http.build();
    }

    // -------- CHAIN WEB --------
    @Bean
    @Order(2)
    SecurityFilterChain web(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                // Headers de sécurité (WEB)
                .headers(h -> h
                        .xssProtection(HeadersConfigurer.XXssConfig::disable)
                        .frameOptions(f -> f.sameOrigin()) // autorise /h2-console en dev
                        .addHeaderWriter(new StaticHeadersWriter("Referrer-Policy", "same-origin"))
                        .addHeaderWriter(new StaticHeadersWriter("X-Content-Type-Options", "nosniff"))
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/oauth2/**", "/login/**",
                                "/h2-console/**",            // H2 console (désactive en prod)
                                "/error", "/favicon.ico",    // utilitaires
                                "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html"
                        ).permitAll()

                        // L’app React/HTML statique éventuelle
                        .requestMatchers("/", "/index.html", "/assets/**").permitAll()

                        // OPTIONS global si nécessaire pour certaines routes web
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .anyRequest().permitAll()
                )

                // OAuth2 Google
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("http://localhost:5173/oauth-success", true)
                        .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService))
                        .successHandler(oauth2SuccessHandler)
                );

        return http.build();
    }

    // -------- AUTH MANAGER --------
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
