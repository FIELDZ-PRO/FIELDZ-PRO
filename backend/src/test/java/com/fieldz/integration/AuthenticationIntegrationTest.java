package com.fieldz.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fieldz.auth.AuthenticationRequest;
import com.fieldz.auth.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'integration pour l'authentification.
 * Teste le login, l'inscription et le refresh token.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@DisplayName("Authentication Integration Tests")
class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String TEST_PASSWORD = "TestPassword123!";
    private static int testCounter = 0;

    private String generateUniqueEmail() {
        return "test.integration" + (++testCounter) + System.currentTimeMillis() + "@fieldz.com";
    }

    @Nested
    @DisplayName("POST /api/auth/register")
    class RegisterTests {

        @Test
        @DisplayName("Inscription joueur reussie")
        void registerJoueur_Success() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .email(generateUniqueEmail())
                    .motDePasse(TEST_PASSWORD)
                    .nom("Test User")
                    .role("JOUEUR")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.token").isNotEmpty());
        }

        @Test
        @DisplayName("Inscription club reussie")
        void registerClub_Success() throws Exception {
            RegisterRequest request = RegisterRequest.builder()
                    .email(generateUniqueEmail())
                    .motDePasse(TEST_PASSWORD)
                    .nom("Test Club")
                    .role("CLUB")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists());
        }

        @Test
        @DisplayName("Inscription echoue avec email deja utilise")
        void register_FailsWithDuplicateEmail() throws Exception {
            String email = generateUniqueEmail();

            RegisterRequest request = RegisterRequest.builder()
                    .email(email)
                    .motDePasse(TEST_PASSWORD)
                    .nom("Test")
                    .role("JOUEUR")
                    .build();

            // Premier enregistrement
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            // Deuxieme enregistrement avec le meme email
            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isConflict());
        }
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class LoginTests {

        @Test
        @DisplayName("Login reussi avec credentials valides")
        void login_Success() throws Exception {
            // D'abord creer un utilisateur
            String email = generateUniqueEmail();
            RegisterRequest registerRequest = RegisterRequest.builder()
                    .email(email)
                    .motDePasse(TEST_PASSWORD)
                    .nom("Test Login")
                    .role("JOUEUR")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isOk());

            // Puis tester le login
            AuthenticationRequest loginRequest = AuthenticationRequest.builder()
                    .email(email)
                    .motDePasse(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists())
                    .andExpect(jsonPath("$.token").isNotEmpty())
                    .andExpect(cookie().exists("refresh_token"));
        }

        @Test
        @DisplayName("Login echoue avec mauvais mot de passe")
        void login_FailsWithWrongPassword() throws Exception {
            // D'abord creer un utilisateur
            String email = generateUniqueEmail();
            RegisterRequest registerRequest = RegisterRequest.builder()
                    .email(email)
                    .motDePasse(TEST_PASSWORD)
                    .nom("Test Wrong Password")
                    .role("JOUEUR")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isOk());

            // Login avec mauvais mot de passe
            AuthenticationRequest loginRequest = AuthenticationRequest.builder()
                    .email(email)
                    .motDePasse("WrongPassword123!")
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Login echoue avec utilisateur inexistant")
        void login_FailsWithNonExistentUser() throws Exception {
            AuthenticationRequest loginRequest = AuthenticationRequest.builder()
                    .email("nonexistent" + System.currentTimeMillis() + "@fieldz.com")
                    .motDePasse(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("POST /api/auth/refresh")
    class RefreshTokenTests {

        @Test
        @DisplayName("Refresh token renouvelle l'access token")
        void refresh_Success() throws Exception {
            // Creer un utilisateur et se connecter
            String email = generateUniqueEmail();
            RegisterRequest registerRequest = RegisterRequest.builder()
                    .email(email)
                    .motDePasse(TEST_PASSWORD)
                    .nom("Test Refresh")
                    .role("JOUEUR")
                    .build();

            mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(registerRequest)))
                    .andExpect(status().isOk());

            // Login pour obtenir le refresh token
            AuthenticationRequest loginRequest = AuthenticationRequest.builder()
                    .email(email)
                    .motDePasse(TEST_PASSWORD)
                    .build();

            MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isOk())
                    .andExpect(cookie().exists("refresh_token"))
                    .andReturn();

            // Extraire le cookie refresh_token
            String refreshTokenCookie = loginResult.getResponse().getCookie("refresh_token").getValue();

            // Utiliser le refresh token
            mockMvc.perform(post("/api/auth/refresh")
                            .cookie(new jakarta.servlet.http.Cookie("refresh_token", refreshTokenCookie)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").exists());
        }

        @Test
        @DisplayName("Refresh echoue sans cookie")
        void refresh_FailsWithoutCookie() throws Exception {
            mockMvc.perform(post("/api/auth/refresh"))
                    .andExpect(status().isUnauthorized());
        }
    }
}
