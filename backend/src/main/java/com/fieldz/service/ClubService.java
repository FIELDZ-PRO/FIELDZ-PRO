package com.fieldz.service;

import com.fieldz.dto.ClubDto;
import com.fieldz.mapper.ClubMapper;
import com.fieldz.model.Club;
import com.fieldz.model.Sport;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.ClubRepository;              // <-- ajout
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;                                     // <-- ajout
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClubService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClubRepository clubRepository;           // <-- ajout

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
        if (notBlank(dto.getBanniereUrl())) club.setBanniereUrl(dto.getBanniereUrl());
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

    private boolean notBlank(String s) { return s != null && !s.isBlank(); }
}
