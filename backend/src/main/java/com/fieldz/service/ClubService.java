package com.fieldz.service;

import com.fieldz.dto.ClubDto;
import com.fieldz.mapper.ClubMapper;
import com.fieldz.model.Club;
import com.fieldz.model.ClubImage;
import com.fieldz.model.Creneau;
import com.fieldz.model.Sport;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.ClubImageRepository;
import com.fieldz.repository.ClubRepository;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClubService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClubRepository clubRepository;
    private final ClubImageRepository clubImageRepository;
    private final CloudService cloudService;

    @Transactional(readOnly = true)
    public ClubDto getClubConnecte(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            log.warn("Tentative d'accès à /api/club/me par un non-club : {}", email);
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }
        log.info("Club connecté récupéré : {} ({})", club.getNom(), email);
        return ClubMapper.toDto(club);
    }

    /** PUT /api/club/me : mise à jour null-safe des champs envoyés */
    public ClubDto updateClubConnecte(Authentication authentication, ClubDto dto) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            log.warn("Tentative d'update de /api/club/me par un non-club : {}", email);
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        if (notBlank(dto.getNom())) club.setNom(dto.getNom());
        if (notBlank(dto.getVille())) club.setVille(dto.getVille());
        if (notBlank(dto.getAdresse())) club.setAdresse(dto.getAdresse());
        if (notBlank(dto.getTelephone())) club.setTelephone(dto.getTelephone());

        // ✅ champs longs (ne pas filtrer avec notBlank : on veut accepter du multi-ligne)
        if (dto.getDescription() != null) club.setDescription(dto.getDescription());
        if (dto.getPolitique() != null) club.setPolitique(dto.getPolitique());
        if (dto.getLocationLink() != null) club.setLocationLink(dto.getLocationLink());
        if (dto.getHeureOuverture() != null) club.setHeureOuverture(dto.getHeureOuverture());
        if (dto.getHeureFermeture() != null) club.setHeureFermeture(dto.getHeureFermeture());

        Set<Sport> sports = dto.getSports();
        if (sports != null) club.setSports(sports);

        Club saved = (Club) utilisateurRepository.save(club);
        return ClubMapper.toDto(saved);
    }


    // ---------- NOUVELLES MÉTHODES DE RECHERCHE ----------

    @Transactional(readOnly = true)
    public List<ClubDto> searchByVille(String ville) {
        return clubRepository.findByVilleLikeIgnoreCase(ville)
                .stream().map(ClubMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ClubDto> searchBySport(Sport sport) {
        return clubRepository.findBySport(sport)
                .stream().map(ClubMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ClubDto> searchByVilleAndSport(String ville, Sport sport) {
        return clubRepository.findByVilleAndSport(ville, sport)
                .stream().map(ClubMapper::toDto).toList();
    }

    // ---------- RÉCUPÉRER UN CLUB PAR ID ----------
    
    @Transactional(readOnly = true)
    public ClubDto getClubById(Long id) {
        Club club = clubRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Club non trouvé avec l'ID : " + id));
        return ClubMapper.toDto(club);  // ← Utilise ClubMapper au lieu de ModelMapper
    }

    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }

    // ---------- GESTION DES IMAGES ----------

    public com.fieldz.dto.ClubImageDto addClubImage(Authentication authentication, MultipartFile file) throws IOException {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        // Upload de l'image sur Cloudinary
        String imageUrl = cloudService.uploadClubImage(file);

        // Créer l'entité ClubImage
        ClubImage clubImage = ClubImage.builder()
                .imageUrl(imageUrl)
                .club(club)
                .displayOrder(club.getImages() != null ? club.getImages().size() : 0)
                .build();

        ClubImage savedImage = clubImageRepository.save(clubImage);
        log.info("Image ajoutée au club {} : {}", club.getNom(), imageUrl);

        // Retourner le DTO avec l'ID pour permettre la suppression
        return com.fieldz.mapper.ClubMapper.toClubImageDto(savedImage);
    }

    @Transactional(readOnly = true)
    public List<String> getClubImages(Long clubId) {
        return clubImageRepository.findByClubIdOrderByDisplayOrderAsc(clubId)
                .stream()
                .map(ClubImage::getImageUrl)
                .toList();
    }

    public void deleteClubImage(Authentication authentication, Long imageId) throws IOException {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        ClubImage clubImage = clubImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image introuvable"));

        // Vérifier que l'image appartient bien au club connecté
        if (!clubImage.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Cette image n'appartient pas à ce club");
        }

        // Supprimer de Cloudinary
        cloudService.deleteImage(clubImage.getImageUrl());

        // Supprimer de la base de données
        clubImageRepository.delete(clubImage);
        log.info("Image supprimée du club {} : {}", club.getNom(), clubImage.getImageUrl());
    }

    public void updateImageOrder(Authentication authentication, Long imageId, Integer newOrder) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        ClubImage clubImage = clubImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image introuvable"));

        // Vérifier que l'image appartient bien au club connecté
        if (!clubImage.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Cette image n'appartient pas à ce club");
        }

        clubImage.setDisplayOrder(newOrder);
        clubImageRepository.save(clubImage);
        log.info("Ordre de l'image {} mis à jour pour le club {}", imageId, club.getNom());
    }

}