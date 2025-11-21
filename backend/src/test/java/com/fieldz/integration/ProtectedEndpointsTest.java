package com.fieldz.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fieldz.auth.AuthenticationRequest;
import com.fieldz.auth.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests pour les endpoints proteges.
 * Verifie que les roles sont correctement appliques.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@DisplayName("Protected Endpoints Tests")
class ProtectedEndpointsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String TEST_PASSWORD = "TestPassword123!";
    private static int testCounter = 0;

    private String generateUniqueEmail() {
        return "test.protected" + (++testCounter) + System.currentTimeMillis() + "@fieldz.com";
    }

    private String getAccessToken(String email, String role) throws Exception {
        // Creer un utilisateur
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(email)
                .motDePasse(TEST_PASSWORD)
                .nom("Test " + role)
                .role(role)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Login
        AuthenticationRequest loginRequest = AuthenticationRequest.builder()
                .email(email)
                .motDePasse(TEST_PASSWORD)
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("token").asText();
    }

    @Nested
    @DisplayName("Endpoints publics")
    class PublicEndpointsTests {

        @Test
        @DisplayName("GET /api/club/search/by-ville est accessible sans authentification")
        void clubSearch_IsPublic() throws Exception {
            mockMvc.perform(get("/api/club/search/by-ville").param("ville", "Paris"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/club/{id} est accessible sans authentification (pas de 401/403)")
        void clubById_IsPublic() throws Exception {
            // Peut retourner 404 si pas de club, mais pas 401/403
            MvcResult result = mockMvc.perform(get("/api/club/1")).andReturn();
            int status = result.getResponse().getStatus();
            // Accepte 200 (OK) ou 404 (Not Found), mais pas 401/403
            assert status == 200 || status == 404 : "Expected 200 or 404, got " + status;
        }
    }

    @Nested
    @DisplayName("Endpoints JOUEUR")
    class JoueurEndpointsTests {

        @Test
        @DisplayName("GET /api/joueur/me necessite une authentification")
        void joueurMe_RequiresAuth() throws Exception {
            mockMvc.perform(get("/api/joueur/me"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("GET /api/joueur/me fonctionne avec un token JOUEUR")
        void joueurMe_WorksWithJoueurToken() throws Exception {
            String token = getAccessToken(generateUniqueEmail(), "JOUEUR");

            mockMvc.perform(get("/api/joueur/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/joueur/me echoue avec un token CLUB")
        void joueurMe_FailsWithClubToken() throws Exception {
            String token = getAccessToken(generateUniqueEmail(), "CLUB");

            mockMvc.perform(get("/api/joueur/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Endpoints CLUB")
    class ClubEndpointsTests {

        @Test
        @DisplayName("GET /api/club/me necessite une authentification")
        void clubMe_RequiresAuth() throws Exception {
            // Sans token, Spring Security retourne 401 ou 403 selon la config
            MvcResult result = mockMvc.perform(get("/api/club/me")).andReturn();
            int status = result.getResponse().getStatus();
            assert status == 401 || status == 403 : "Expected 401 or 403, got " + status;
        }

        @Test
        @DisplayName("GET /api/club/me fonctionne avec un token CLUB")
        void clubMe_WorksWithClubToken() throws Exception {
            String token = getAccessToken(generateUniqueEmail(), "CLUB");

            mockMvc.perform(get("/api/club/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/club/me echoue avec un token JOUEUR")
        void clubMe_FailsWithJoueurToken() throws Exception {
            String token = getAccessToken(generateUniqueEmail(), "JOUEUR");

            mockMvc.perform(get("/api/club/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Token invalide")
    class InvalidTokenTests {

        @Test
        @DisplayName("Token invalide retourne 401")
        void invalidToken_Returns401() throws Exception {
            mockMvc.perform(get("/api/joueur/me")
                            .header("Authorization", "Bearer invalid.token.here"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Token mal forme retourne 401")
        void malformedToken_Returns401() throws Exception {
            mockMvc.perform(get("/api/joueur/me")
                            .header("Authorization", "Bearer "))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Header Authorization absent retourne 401")
        void missingAuthHeader_Returns401() throws Exception {
            mockMvc.perform(get("/api/joueur/me"))
                    .andExpect(status().isUnauthorized());
        }
    }
}
