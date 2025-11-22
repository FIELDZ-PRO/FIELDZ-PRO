package com.fieldz.integration;

import com.fieldz.dto.UpdateTerrainRequest;
import com.fieldz.model.*;
import com.fieldz.repository.*;
import com.fieldz.service.NotificationService;
import com.fieldz.service.TerrainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@ActiveProfiles("test")
class TerrainServiceTest {

    @Autowired
    private TerrainService terrainService;

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private CreneauRepository creneauRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @MockitoBean
    private NotificationService notificationService;

    private Club testClub;
    private Club testClub2;

    @BeforeEach
    void setUp() {
        // Créer deux clubs de test
        testClub = Club.builder()
                .nom("Club Paris")
                .email("club.paris@fieldz.com")
                .motDePasse("$2a$10$test")
                .ville("Paris")
                .typeRole(Role.CLUB)
                .sports(new HashSet<>(Set.of(Sport.PADEL)))
                .build();
        testClub = (Club) utilisateurRepository.save(testClub);

        testClub2 = Club.builder()
                .nom("Club Lyon")
                .email("club.lyon@fieldz.com")
                .motDePasse("$2a$10$test")
                .ville("Lyon")
                .typeRole(Role.CLUB)
                .sports(new HashSet<>(Set.of(Sport.TENNIS)))
                .build();
        testClub2 = (Club) utilisateurRepository.save(testClub2);
    }

    private Terrain createTerrain(Club club, String nom, String ville, String sport) {
        Terrain t = new Terrain();
        t.setClub(club);
        t.setNomTerrain(nom);
        t.setVille(ville);
        t.setSport(sport);
        return terrainRepository.save(t);
    }

    @Nested
    @DisplayName("Tests de recherche par ville")
    class SearchByVilleTests {

        @Test
        @DisplayName("getTerrainsParVille - doit retourner les terrains de la ville")
        void getTerrainsParVille_shouldReturnTerrainsFromCity() {
            createTerrain(testClub, "Terrain Paris 1", "Paris", "PADEL");
            createTerrain(testClub, "Terrain Paris 2", "Paris", "PADEL");
            createTerrain(testClub2, "Terrain Lyon", "Lyon", "TENNIS");

            List<Terrain> result = terrainService.getTerrainsParVille("Paris");

            assertThat(result).hasSize(2);
            assertThat(result).allMatch(t -> t.getVille().equals("Paris"));
        }

        @Test
        @DisplayName("getTerrainsParVille - recherche insensible à la casse")
        void getTerrainsParVille_shouldBeCaseInsensitive() {
            createTerrain(testClub, "Terrain Test", "Paris", "PADEL");

            List<Terrain> result = terrainService.getTerrainsParVille("PARIS");

            assertThat(result).hasSize(1);
        }

        @Test
        @DisplayName("getTerrainsParVille - retourne vide pour ville null ou blank")
        void getTerrainsParVille_shouldReturnEmptyForNullOrBlank() {
            createTerrain(testClub, "Terrain Test", "Paris", "PADEL");

            assertThat(terrainService.getTerrainsParVille(null)).isEmpty();
            assertThat(terrainService.getTerrainsParVille("")).isEmpty();
            assertThat(terrainService.getTerrainsParVille("   ")).isEmpty();
        }

        @Test
        @DisplayName("searchVilleContient - recherche partielle")
        void searchVilleContient_shouldSearchPartial() {
            createTerrain(testClub, "Terrain 1", "Paris", "PADEL");
            createTerrain(testClub, "Terrain 2", "Paris Centre", "PADEL");
            createTerrain(testClub2, "Terrain 3", "Lyon", "TENNIS");

            List<Terrain> result = terrainService.searchVilleContient("par");

            assertThat(result).hasSize(2);
            assertThat(result).allMatch(t -> t.getVille().toLowerCase().contains("par"));
        }

        @Test
        @DisplayName("getTerrainsParVillesCsv - recherche multi-villes")
        void getTerrainsParVillesCsv_shouldSearchMultipleCities() {
            createTerrain(testClub, "Terrain Paris", "Paris", "PADEL");
            createTerrain(testClub2, "Terrain Lyon", "Lyon", "TENNIS");
            createTerrain(testClub, "Terrain Marseille", "Marseille", "PADEL");

            List<Terrain> result = terrainService.getTerrainsParVillesCsv("Paris,Lyon");

            assertThat(result).hasSize(2);
        }

        @Test
        @DisplayName("getTerrainsParVillesCsv - gère les espaces et doublons")
        void getTerrainsParVillesCsv_shouldHandleSpacesAndDuplicates() {
            createTerrain(testClub, "Terrain Paris", "Paris", "PADEL");

            List<Terrain> result = terrainService.getTerrainsParVillesCsv(" Paris , paris , PARIS ");

            assertThat(result).hasSize(1);
        }
    }

    @Nested
    @DisplayName("Tests de mise à jour de terrain")
    class UpdateTerrainTests {

        @Test
        @DisplayName("updateTerrain - doit modifier les champs fournis")
        void updateTerrain_shouldUpdateProvidedFields() {
            Terrain terrain = createTerrain(testClub, "Ancien Nom", "Paris", "PADEL");

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            UpdateTerrainRequest req = new UpdateTerrainRequest();
            req.setNomTerrain("Nouveau Nom");
            req.setTypeSurface("Gazon synthétique");

            Terrain updated = terrainService.updateTerrain(terrain.getId(), req, auth);

            assertThat(updated.getNomTerrain()).isEqualTo("Nouveau Nom");
            assertThat(updated.getTypeSurface()).isEqualTo("Gazon synthétique");
            assertThat(updated.getVille()).isEqualTo("Paris"); // Non modifié
        }

        @Test
        @DisplayName("updateTerrain - doit lever exception si terrain d'un autre club")
        void updateTerrain_shouldThrowIfNotOwner() {
            Terrain terrain = createTerrain(testClub2, "Terrain Lyon", "Lyon", "TENNIS");

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com"); // Club1 essaie de modifier

            UpdateTerrainRequest req = new UpdateTerrainRequest();
            req.setNomTerrain("Hacked");

            final Long terrainId = terrain.getId();
            assertThatThrownBy(() -> terrainService.updateTerrain(terrainId, req, auth))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("ne vous appartient pas");
        }

        @Test
        @DisplayName("updateTerrain - doit lever exception si terrain inexistant")
        void updateTerrain_shouldThrowIfNotFound() {
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            UpdateTerrainRequest req = new UpdateTerrainRequest();

            assertThatThrownBy(() -> terrainService.updateTerrain(99999L, req, auth))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Terrain introuvable");
        }
    }

    @Nested
    @DisplayName("Tests de suppression de terrain")
    class SupprimerTerrainTests {

        @Test
        @DisplayName("supprimerTerrain - doit supprimer un terrain sans créneaux")
        void supprimerTerrain_shouldDeleteTerrainWithoutCreneaux() {
            Terrain terrain = createTerrain(testClub, "Terrain à supprimer", "Paris", "PADEL");

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            int annulees = terrainService.supprimerTerrain(terrain.getId(), auth);

            assertThat(annulees).isEqualTo(0);
            assertThat(terrainRepository.findById(terrain.getId())).isEmpty();
        }

        @Test
        @DisplayName("supprimerTerrain - doit annuler les réservations actives")
        void supprimerTerrain_shouldCancelActiveReservations() {
            Terrain terrain = createTerrain(testClub, "Terrain avec réservations", "Paris", "PADEL");

            // Créer un créneau
            Creneau creneau = new Creneau();
            creneau.setTerrain(terrain);
            creneau.setDateDebut(LocalDateTime.now().plusDays(1));
            creneau.setDateFin(LocalDateTime.now().plusDays(1).plusHours(1));
            creneau.setStatut(Statut.RESERVE);
            creneau.setDisponible(false);
            creneau.setPrix(25.0);
            creneau = creneauRepository.save(creneau);

            // Créer un joueur
            Joueur joueur = Joueur.builder()
                    .nom("Test")
                    .prenom("Joueur")
                    .email("joueur.terrain@fieldz.com")
                    .motDePasse("$2a$10$test")
                    .typeRole(Role.JOUEUR)
                    .build();
            joueur = (Joueur) utilisateurRepository.save(joueur);

            // Créer une réservation active
            Reservation reservation = new Reservation();
            reservation.setCreneau(creneau);
            reservation.setJoueur(joueur);
            reservation.setStatut(Statut.CONFIRMEE);
            reservation.setDateReservation(LocalDateTime.now());
            reservation = reservationRepository.save(reservation);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            int annulees = terrainService.supprimerTerrain(terrain.getId(), auth);

            assertThat(annulees).isEqualTo(1);
            assertThat(terrainRepository.findById(terrain.getId())).isEmpty();
            assertThat(creneauRepository.findById(creneau.getId())).isEmpty();

            // Vérifier que la réservation est annulée et déréférencée
            Reservation updatedRes = reservationRepository.findById(reservation.getId()).orElseThrow();
            assertThat(updatedRes.getStatut()).isEqualTo(Statut.ANNULE_PAR_CLUB);
            assertThat(updatedRes.getCreneau()).isNull();
        }

        @Test
        @DisplayName("supprimerTerrain - doit lever exception si terrain d'un autre club")
        void supprimerTerrain_shouldThrowIfNotOwner() {
            Terrain terrain = createTerrain(testClub2, "Terrain Lyon", "Lyon", "TENNIS");

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            final Long terrainId = terrain.getId();
            assertThatThrownBy(() -> terrainService.supprimerTerrain(terrainId, auth))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("ne vous appartient pas");
        }
    }

    @Nested
    @DisplayName("Tests d'ajout de terrain")
    class AjouterTerrainTests {

        @Test
        @DisplayName("ajouterTerrain - doit créer un terrain pour le club connecté")
        void ajouterTerrain_shouldCreateTerrainForConnectedClub() {
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            Terrain newTerrain = new Terrain();
            newTerrain.setNomTerrain("Nouveau Terrain");
            newTerrain.setVille("Paris");
            newTerrain.setSport("PADEL");
            newTerrain.setTypeSurface("Béton");

            Terrain saved = terrainService.ajouterTerrain(newTerrain, auth);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getClub().getId()).isEqualTo(testClub.getId());
            assertThat(saved.getNomTerrain()).isEqualTo("Nouveau Terrain");
        }

        @Test
        @DisplayName("ajouterTerrain - doit lever exception si utilisateur non-club")
        void ajouterTerrain_shouldThrowIfNotClub() {
            // Créer un joueur
            Joueur joueur = Joueur.builder()
                    .nom("Test")
                    .prenom("Joueur")
                    .email("joueur.ajout@fieldz.com")
                    .motDePasse("$2a$10$test")
                    .typeRole(Role.JOUEUR)
                    .build();
            utilisateurRepository.save(joueur);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("joueur.ajout@fieldz.com");

            Terrain newTerrain = new Terrain();
            newTerrain.setNomTerrain("Test");

            assertThatThrownBy(() -> terrainService.ajouterTerrain(newTerrain, auth))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("n'est pas un club");
        }
    }
}
