package com.fieldz.service;

import com.fieldz.model.Utilisateur;
import com.fieldz.model.Joueur;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import com.fieldz.dto.JoueurDto;
import com.fieldz.mapper.JoueurMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class JoueurService {

    private final UtilisateurRepository utilisateurRepository;

    public JoueurDto getConnectedUserDto(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(user instanceof Joueur joueur)) {
            log.warn("Tentative d'accès à /api/joueur/me par un non-joueur : {}", email);
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }
        log.info("Joueur connecté récupéré : {}", email);
        return JoueurMapper.toDto(joueur);
    }

    public Joueur getByEmail(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(user instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }
        return joueur;
    }

}
