package com.fieldz.integration;

import com.fieldz.dto.ClubDto;
import com.fieldz.dto.ClubImageDto;
import com.fieldz.model.Club;
import com.fieldz.model.ClubImage;
import com.fieldz.model.Role;
import com.fieldz.model.Sport;
import com.fieldz.repository.ClubImageRepository;
import com.fieldz.repository.ClubRepository;
import com.fieldz.repository.UtilisateurRepository;
import com.fieldz.service.CloudService;
import com.fieldz.service.ClubService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@ActiveProfiles("test")
class ClubServiceTest {

    @Autowired
    private ClubService clubService;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubImageRepository clubImageRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @MockitoBean
    private CloudService cloudService;

    private Club testClub;
    private Club testClub2;

    @BeforeEach
    void setUp() {
        // Créer un club de test
        testClub = Club.builder()
                .nom("Padel Club Paris")
                .email("club.paris@fieldz.com")
                .motDePasse("$2a$10$test")
                .ville("Paris")
                .typeRole(Role.CLUB)
                .sports(new HashSet<>(Set.of(Sport.PADEL)))
                .build();
        testClub = (Club) utilisateurRepository.save(testClub);

        // Créer un second club
        testClub2 = Club.builder()
                .nom("Tennis Club Lyon")
                .email("club.lyon@fieldz.com")
                .motDePasse("$2a$10$test")
                .ville("Lyon")
                .typeRole(Role.CLUB)
                .sports(new HashSet<>(Set.of(Sport.TENNIS)))
                .build();
        testClub2 = (Club) utilisateurRepository.save(testClub2);
    }

    @Nested
    @DisplayName("Tests de recherche de clubs")
    class SearchTests {

        @Test
        @DisplayName("searchByVille - doit retourner les clubs d'une ville")
        void searchByVille_shouldReturnClubsFromCity() {
            List<ClubDto> result = clubService.searchByVille("Paris");

            // Vérifie que le club créé est dans les résultats
            assertThat(result).anyMatch(c -> c.getNom().equals("Padel Club Paris"));
            // Vérifie que tous les résultats sont de Paris
            assertThat(result).allMatch(c -> c.getVille().equalsIgnoreCase("Paris"));
        }

        @Test
        @DisplayName("searchByVille - recherche insensible à la casse")
        void searchByVille_shouldBeCaseInsensitive() {
            List<ClubDto> result = clubService.searchByVille("PARIS");

            assertThat(result).isNotEmpty();
            assertThat(result).allMatch(c -> c.getVille().equalsIgnoreCase("Paris"));
        }

        @Test
        @DisplayName("searchByVille - retourne liste vide si ville inexistante")
        void searchByVille_shouldReturnEmptyForUnknownCity() {
            List<ClubDto> result = clubService.searchByVille("Marseille");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("searchBySport - doit retourner les clubs par sport")
        void searchBySport_shouldReturnClubsBySport() {
            List<ClubDto> result = clubService.searchBySport(Sport.PADEL);

            // Vérifie que le club créé est dans les résultats
            assertThat(result).anyMatch(c -> c.getNom().equals("Padel Club Paris"));
            // Vérifie que tous les résultats ont le sport PADEL
            assertThat(result).allMatch(c -> c.getSports() != null && c.getSports().contains(Sport.PADEL));
        }

        @Test
        @DisplayName("searchByVilleAndSport - recherche combinée")
        void searchByVilleAndSport_shouldReturnMatchingClubs() {
            List<ClubDto> result = clubService.searchByVilleAndSport("Paris", Sport.PADEL);

            // Vérifie que le club créé est dans les résultats
            assertThat(result).anyMatch(c -> c.getNom().equals("Padel Club Paris"));
            // Vérifie les critères de recherche
            assertThat(result).allMatch(c -> c.getVille().equalsIgnoreCase("Paris"));
            assertThat(result).allMatch(c -> c.getSports() != null && c.getSports().contains(Sport.PADEL));
        }

        @Test
        @DisplayName("searchByVilleAndSport - retourne vide si pas de correspondance")
        void searchByVilleAndSport_shouldReturnEmptyIfNoMatch() {
            List<ClubDto> result = clubService.searchByVilleAndSport("Paris", Sport.TENNIS);

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("getClubById - doit retourner le club existant")
        void getClubById_shouldReturnExistingClub() {
            ClubDto result = clubService.getClubById(testClub.getId());

            assertThat(result).isNotNull();
            assertThat(result.getNom()).isEqualTo("Padel Club Paris");
        }

        @Test
        @DisplayName("getClubById - doit lever exception si club inexistant")
        void getClubById_shouldThrowIfNotFound() {
            assertThatThrownBy(() -> clubService.getClubById(99999L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Club non trouvé");
        }
    }

    @Nested
    @DisplayName("Tests de gestion des images")
    class ImageTests {

        @Test
        @DisplayName("addClubImage - doit ajouter une image au club")
        void addClubImage_shouldAddImageToClub() throws IOException {
            // Mock du service cloud
            when(cloudService.uploadClubImage(any())).thenReturn("https://cloudinary.com/test-image.jpg");

            // Mock de l'authentification
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            // Créer un fichier mock
            MockMultipartFile file = new MockMultipartFile(
                    "file", "test.jpg", "image/jpeg", "test content".getBytes());

            ClubImageDto result = clubService.addClubImage(auth, file);

            assertThat(result).isNotNull();
            assertThat(result.getImageUrl()).isEqualTo("https://cloudinary.com/test-image.jpg");
            assertThat(result.getDisplayOrder()).isEqualTo(0);

            // Vérifier en base
            List<ClubImage> images = clubImageRepository.findByClubIdOrderByDisplayOrderAsc(testClub.getId());
            assertThat(images).hasSize(1);
        }

        @Test
        @DisplayName("addClubImage - doit lever exception si utilisateur non-club")
        void addClubImage_shouldThrowIfNotClub() {
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("joueur@fieldz.com");

            MockMultipartFile file = new MockMultipartFile(
                    "file", "test.jpg", "image/jpeg", "test".getBytes());

            assertThatThrownBy(() -> clubService.addClubImage(auth, file))
                    .isInstanceOf(RuntimeException.class);
        }

        @Test
        @DisplayName("getClubImages - doit retourner les images ordonnées")
        void getClubImages_shouldReturnOrderedImages() {
            // Ajouter des images directement en base
            ClubImage image1 = ClubImage.builder()
                    .imageUrl("https://test.com/image1.jpg")
                    .club(testClub)
                    .displayOrder(1)
                    .build();
            ClubImage image2 = ClubImage.builder()
                    .imageUrl("https://test.com/image2.jpg")
                    .club(testClub)
                    .displayOrder(0)
                    .build();
            clubImageRepository.save(image1);
            clubImageRepository.save(image2);

            List<String> result = clubService.getClubImages(testClub.getId());

            assertThat(result).hasSize(2);
            assertThat(result.get(0)).isEqualTo("https://test.com/image2.jpg"); // displayOrder 0
            assertThat(result.get(1)).isEqualTo("https://test.com/image1.jpg"); // displayOrder 1
        }

        @Test
        @DisplayName("deleteClubImage - doit supprimer l'image du club")
        void deleteClubImage_shouldDeleteImage() throws IOException {
            // Ajouter une image
            ClubImage image = ClubImage.builder()
                    .imageUrl("https://test.com/to-delete.jpg")
                    .club(testClub)
                    .displayOrder(0)
                    .build();
            image = clubImageRepository.save(image);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            clubService.deleteClubImage(auth, image.getId());

            // Vérifier suppression
            assertThat(clubImageRepository.findById(image.getId())).isEmpty();
        }

        @Test
        @DisplayName("deleteClubImage - doit lever exception si image d'un autre club")
        void deleteClubImage_shouldThrowIfNotOwner() {
            // Ajouter une image au club2
            ClubImage image = ClubImage.builder()
                    .imageUrl("https://test.com/other-club.jpg")
                    .club(testClub2)
                    .displayOrder(0)
                    .build();
            image = clubImageRepository.save(image);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com"); // Club1 essaie de supprimer

            final Long imageId = image.getId();
            assertThatThrownBy(() -> clubService.deleteClubImage(auth, imageId))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("n'appartient pas");
        }

        @Test
        @DisplayName("updateImageOrder - doit mettre à jour l'ordre d'affichage")
        void updateImageOrder_shouldUpdateDisplayOrder() {
            ClubImage image = ClubImage.builder()
                    .imageUrl("https://test.com/image.jpg")
                    .club(testClub)
                    .displayOrder(0)
                    .build();
            image = clubImageRepository.save(image);

            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            clubService.updateImageOrder(auth, image.getId(), 5);

            // Vérifier la mise à jour
            ClubImage updated = clubImageRepository.findById(image.getId()).orElseThrow();
            assertThat(updated.getDisplayOrder()).isEqualTo(5);
        }
    }

    @Nested
    @DisplayName("Tests de mise à jour du club")
    class UpdateTests {

        @Test
        @DisplayName("updateClubConnecte - doit mettre à jour les champs non-null")
        void updateClubConnecte_shouldUpdateNonNullFields() {
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            ClubDto updateDto = new ClubDto();
            updateDto.setNom("Nouveau Nom");
            updateDto.setVille("Marseille");

            ClubDto result = clubService.updateClubConnecte(auth, updateDto);

            assertThat(result.getNom()).isEqualTo("Nouveau Nom");
            assertThat(result.getVille()).isEqualTo("Marseille");
        }

        @Test
        @DisplayName("updateClubConnecte - ne doit pas modifier les champs null")
        void updateClubConnecte_shouldNotUpdateNullFields() {
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("club.paris@fieldz.com");

            ClubDto updateDto = new ClubDto();
            updateDto.setVille("Marseille");
            // nom est null

            ClubDto result = clubService.updateClubConnecte(auth, updateDto);

            assertThat(result.getNom()).isEqualTo("Padel Club Paris"); // Inchangé
            assertThat(result.getVille()).isEqualTo("Marseille"); // Modifié
        }
    }
}
