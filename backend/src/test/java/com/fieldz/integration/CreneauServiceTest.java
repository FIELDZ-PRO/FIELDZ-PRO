package com.fieldz.integration;

import com.fieldz.dto.CreneauRecurrentDto;
import com.fieldz.dto.UpdateCreneauRequest;
import com.fieldz.exception.CreneauHasActiveReservationsException;
import com.fieldz.model.*;
import com.fieldz.repository.*;
import com.fieldz.service.CreneauService;
import com.fieldz.service.NotificationService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@ActiveProfiles("test")
class CreneauServiceTest {

    @Autowired
    private CreneauService creneauService;

    @Autowired
    private CreneauRepository creneauRepository;

    @Autowired
    private TerrainRepository terrainRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @MockitoBean
    private NotificationService notificationService;

    private Club testClub;
    private Terrain testTerrain;

    @BeforeEach
    void setUp() {
        // Créer un club de test
        testClub = Club.builder()
                .nom("Test Club")
                .email("club.test@fieldz.com")
                .motDePasse("$2a$10$test")
                .ville("Paris")
                .typeRole(Role.CLUB)
                .sports(new HashSet<>(Set.of(Sport.PADEL)))
                .build();
        testClub = (Club) utilisateurRepository.save(testClub);

        // Créer un terrain
        testTerrain = new Terrain();
        testTerrain.setNomTerrain("Terrain 1");
        testTerrain.setClub(testClub);
        testTerrain.setVille("Paris");
        testTerrain.setSport("PADEL");
        testTerrain = terrainRepository.save(testTerrain);
    }

    private Creneau createCreneau(Terrain terrain, LocalDateTime debut, LocalDateTime fin,
                                   Statut statut, boolean disponible, Double prix) {
        Creneau c = new Creneau();
        c.setTerrain(terrain);
        c.setDateDebut(debut);
        c.setDateFin(fin);
        c.setStatut(statut);
        c.setDisponible(disponible);
        c.setPrix(prix);
        return creneauRepository.save(c);
    }

    private Reservation createReservation(Creneau creneau, Joueur joueur, Statut statut) {
        Reservation r = new Reservation();
        r.setCreneau(creneau);
        r.setJoueur(joueur);
        r.setStatut(statut);
        r.setDateReservation(LocalDateTime.now());
        return reservationRepository.save(r);
    }

    @Nested
    @DisplayName("Tests de création de créneaux récurrents")
    class CreneauxRecurrentsTests {

        @Test
        @DisplayName("creerCreneauxRecurrents - doit créer des créneaux pour chaque jour cible")
        void creerCreneauxRecurrents_shouldCreateSlotsForEachTargetDay() {
            CreneauRecurrentDto dto = new CreneauRecurrentDto();
            dto.setDateDebut(LocalDate.now().plusDays(1));
            dto.setDateFin(LocalDate.now().plusDays(15));
            dto.setJourDeSemaine("MONDAY");
            dto.setHeureDebut(LocalTime.of(10, 0));
            dto.setDureeMinutes(90);
            dto.setPrix(30.0);
            dto.setTerrainId(testTerrain.getId());

            Map<String, Object> result = creneauService.creerCreneauxRecurrents(dto);

            assertThat(result).containsKey("totalCrees");
            assertThat((Integer) result.get("totalCrees")).isGreaterThanOrEqualTo(1);
            assertThat(result.get("message")).asString().contains("succès");
        }

        @Test
        @DisplayName("creerCreneauxRecurrents - ne doit pas créer de doublons")
        void creerCreneauxRecurrents_shouldNotCreateDuplicates() {
            CreneauRecurrentDto dto = new CreneauRecurrentDto();
            dto.setDateDebut(LocalDate.now().plusDays(1));
            dto.setDateFin(LocalDate.now().plusDays(8));
            dto.setJourDeSemaine("TUESDAY");
            dto.setHeureDebut(LocalTime.of(14, 0));
            dto.setDureeMinutes(60);
            dto.setPrix(25.0);
            dto.setTerrainId(testTerrain.getId());

            // Première création
            Map<String, Object> result1 = creneauService.creerCreneauxRecurrents(dto);
            int firstCount = (Integer) result1.get("totalCrees");

            // Deuxième création identique
            Map<String, Object> result2 = creneauService.creerCreneauxRecurrents(dto);
            int secondCount = (Integer) result2.get("totalCrees");

            assertThat(secondCount).isEqualTo(0);
            assertThat((Integer) result2.get("dejaExistants")).isEqualTo(firstCount);
        }

        @Test
        @DisplayName("creerCreneauxRecurrents - avec auto-réservation")
        void creerCreneauxRecurrents_withAutoReservation() {
            CreneauRecurrentDto dto = new CreneauRecurrentDto();
            dto.setDateDebut(LocalDate.now().plusDays(1));
            dto.setDateFin(LocalDate.now().plusDays(8));
            dto.setJourDeSemaine("WEDNESDAY");
            dto.setHeureDebut(LocalTime.of(18, 0));
            dto.setDureeMinutes(90);
            dto.setPrix(35.0);
            dto.setTerrainId(testTerrain.getId());
            dto.setAutoReserver(true);
            dto.setNomReservant("Équipe Régulière");

            Map<String, Object> result = creneauService.creerCreneauxRecurrents(dto);

            assertThat((Integer) result.get("reservationsCrees")).isGreaterThanOrEqualTo(0);
            assertThat(result.get("nomReservant")).isEqualTo("Équipe Régulière");
        }

        @Test
        @DisplayName("creerCreneauxRecurrents - doit lever exception si terrain inexistant")
        void creerCreneauxRecurrents_shouldThrowIfTerrainNotFound() {
            CreneauRecurrentDto dto = new CreneauRecurrentDto();
            dto.setDateDebut(LocalDate.now().plusDays(1));
            dto.setDateFin(LocalDate.now().plusDays(8));
            dto.setJourDeSemaine("MONDAY");
            dto.setHeureDebut(LocalTime.of(10, 0));
            dto.setDureeMinutes(60);
            dto.setPrix(20.0);
            dto.setTerrainId(99999L);

            assertThatThrownBy(() -> creneauService.creerCreneauxRecurrents(dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Terrain introuvable");
        }
    }

    @Nested
    @DisplayName("Tests de suppression de créneaux")
    class SupprimerCreneauTests {

        @Test
        @DisplayName("supprimerCreneau - doit supprimer un créneau sans réservations")
        void supprimerCreneau_shouldDeleteCreneauWithoutReservations() {
            Creneau creneau = createCreneau(testTerrain,
                    LocalDateTime.now().plusDays(1),
                    LocalDateTime.now().plusDays(1).plusHours(1),
                    Statut.LIBRE, true, 25.0);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.test@fieldz.com");

            int annulees = creneauService.supprimerCreneau(creneau.getId(), auth, false);

            assertThat(annulees).isEqualTo(0);
            assertThat(creneauRepository.findById(creneau.getId())).isEmpty();
        }

        @Test
        @DisplayName("supprimerCreneau - doit lever exception si réservations actives et force=false")
        void supprimerCreneau_shouldThrowIfActiveReservationsAndNotForced() {
            // Créer un joueur
            Joueur joueur = Joueur.builder()
                    .nom("Test")
                    .prenom("Joueur")
                    .email("joueur.test@fieldz.com")
                    .motDePasse("$2a$10$test")
                    .typeRole(Role.JOUEUR)
                    .build();
            joueur = (Joueur) utilisateurRepository.save(joueur);

            // Créer un créneau
            Creneau creneau = createCreneau(testTerrain,
                    LocalDateTime.now().plusDays(1),
                    LocalDateTime.now().plusDays(1).plusHours(1),
                    Statut.RESERVE, false, 25.0);

            // Créer une réservation active
            createReservation(creneau, joueur, Statut.RESERVE);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.test@fieldz.com");

            final Long creneauId = creneau.getId();
            assertThatThrownBy(() -> creneauService.supprimerCreneau(creneauId, auth, false))
                    .isInstanceOf(CreneauHasActiveReservationsException.class);
        }

        @Test
        @DisplayName("supprimerCreneau - doit annuler réservations si force=true")
        void supprimerCreneau_shouldCancelReservationsIfForced() {
            // Créer un joueur
            Joueur joueur = Joueur.builder()
                    .nom("Test")
                    .prenom("Joueur")
                    .email("joueur.force@fieldz.com")
                    .motDePasse("$2a$10$test")
                    .typeRole(Role.JOUEUR)
                    .build();
            joueur = (Joueur) utilisateurRepository.save(joueur);

            // Créer un créneau
            Creneau creneau = createCreneau(testTerrain,
                    LocalDateTime.now().plusDays(2),
                    LocalDateTime.now().plusDays(2).plusHours(1),
                    Statut.RESERVE, false, 25.0);

            // Créer une réservation active
            Reservation reservation = createReservation(creneau, joueur, Statut.CONFIRMEE);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.test@fieldz.com");

            int annulees = creneauService.supprimerCreneau(creneau.getId(), auth, true);

            assertThat(annulees).isEqualTo(1);
            assertThat(creneauRepository.findById(creneau.getId())).isEmpty();

            // Vérifier que la réservation est annulée
            Reservation updatedRes = reservationRepository.findById(reservation.getId()).orElseThrow();
            assertThat(updatedRes.getStatut()).isEqualTo(Statut.ANNULE_PAR_CLUB);
            assertThat(updatedRes.getCreneau()).isNull();
        }
    }

    @Nested
    @DisplayName("Tests de modification de créneaux")
    class UpdateCreneauTests {

        @Test
        @DisplayName("updateCreneau - doit modifier les champs fournis")
        void updateCreneau_shouldUpdateProvidedFields() {
            Creneau creneau = createCreneau(testTerrain,
                    LocalDateTime.now().plusDays(3).withHour(10).withMinute(0),
                    LocalDateTime.now().plusDays(3).withHour(11).withMinute(0),
                    Statut.LIBRE, true, 30.0);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.test@fieldz.com");

            UpdateCreneauRequest req = new UpdateCreneauRequest();
            req.setPrix(45.0);

            Creneau updated = creneauService.updateCreneau(creneau.getId(), req, auth);

            assertThat(updated.getPrix()).isEqualTo(45.0);
        }

        @Test
        @DisplayName("updateCreneau - doit lever exception si chevauchement")
        void updateCreneau_shouldThrowIfOverlap() {
            LocalDateTime date = LocalDateTime.now().plusDays(5).withHour(10).withMinute(0).withSecond(0).withNano(0);

            // Créer deux créneaux
            createCreneau(testTerrain, date, date.plusHours(1), Statut.LIBRE, true, 25.0);
            Creneau creneau2 = createCreneau(testTerrain, date.plusHours(2), date.plusHours(3), Statut.LIBRE, true, 25.0);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.test@fieldz.com");

            // Essayer de déplacer creneau2 pour chevaucher creneau1
            UpdateCreneauRequest req = new UpdateCreneauRequest();
            req.setDateDebut(date.plusMinutes(30));
            req.setDateFin(date.plusHours(1).plusMinutes(30));

            final Long creneauId = creneau2.getId();
            assertThatThrownBy(() -> creneauService.updateCreneau(creneauId, req, auth))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("chevauche");
        }
    }

    @Nested
    @DisplayName("Tests de récupération des créneaux disponibles")
    class GetCreneauxDisponiblesTests {

        @Test
        @DisplayName("getCreneauxDisponibles - doit retourner uniquement les créneaux futurs et libres")
        void getCreneauxDisponibles_shouldReturnOnlyFutureAndAvailable() {
            // Créneau passé (ne doit pas être retourné)
            createCreneau(testTerrain,
                    LocalDateTime.now().minusDays(1),
                    LocalDateTime.now().minusDays(1).plusHours(1),
                    Statut.LIBRE, true, 20.0);

            // Créneau futur libre
            Creneau creneauLibre = createCreneau(testTerrain,
                    LocalDateTime.now().plusDays(1),
                    LocalDateTime.now().plusDays(1).plusHours(1),
                    Statut.LIBRE, true, 25.0);

            // Créneau futur réservé (ne doit pas être retourné)
            createCreneau(testTerrain,
                    LocalDateTime.now().plusDays(2),
                    LocalDateTime.now().plusDays(2).plusHours(1),
                    Statut.RESERVE, false, 25.0);

            List<Creneau> result = creneauService.getCreneauxDisponibles();

            // Vérifie que le créneau libre créé est bien dans les résultats
            assertThat(result).anyMatch(c -> c.getId().equals(creneauLibre.getId()));
            // Vérifie que tous les résultats sont libres et futurs
            assertThat(result).allMatch(c -> c.getStatut() == Statut.LIBRE);
            assertThat(result).allMatch(c -> c.getDateDebut().isAfter(LocalDateTime.now()));
        }

        @Test
        @DisplayName("getCreneauxDisponiblesParClub - avec filtre de date")
        void getCreneauxDisponiblesParClub_shouldFilterByDate() {
            LocalDate targetDate = LocalDate.now().plusDays(3);

            // Créneau à la date cible
            createCreneau(testTerrain,
                    targetDate.atTime(14, 0),
                    targetDate.atTime(15, 0),
                    Statut.LIBRE, true, 25.0);

            // Créneau autre date
            createCreneau(testTerrain,
                    targetDate.plusDays(1).atTime(14, 0),
                    targetDate.plusDays(1).atTime(15, 0),
                    Statut.LIBRE, true, 25.0);

            List<Creneau> result = creneauService.getCreneauxDisponiblesParClub(
                    testClub.getId(), targetDate.toString(), null);

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getDateDebut().toLocalDate()).isEqualTo(targetDate);
        }
    }
}
