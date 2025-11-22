package com.fieldz.integration;

import com.fieldz.model.Sport;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    @DisplayName("GET /api/sports - doit retourner tous les sports disponibles")
    void getSports_shouldReturnAllSports() throws Exception {
        mockMvc.perform(get("/api/sports")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$", hasSize(Sport.values().length)))
                .andExpect(jsonPath("$", hasItem("PADEL")))
                .andExpect(jsonPath("$", hasItem("TENNIS")));
    }

    @Test
    @DisplayName("GET /api/sports - endpoint requiert authentification")
    void getSports_shouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/sports"))
                .andExpect(status().isUnauthorized());
    }
}
