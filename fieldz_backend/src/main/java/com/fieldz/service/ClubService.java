package com.fieldz.service;

import com.fieldz.model.Club;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import com.fieldz.dto.ClubDto;
import com.fieldz.mapper.ClubMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClubService {

    private final UtilisateurRepository utilisateurRepository;

    public ClubDto getClubConnecte(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            log.warn("Tentative d'accès à /api/club/me par un non-club : {}", email);
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }
        log.info("Club connecté récupéré : {} ({})", club.getNomClub(), email);
        return ClubMapper.toDto(club);
    }
}
