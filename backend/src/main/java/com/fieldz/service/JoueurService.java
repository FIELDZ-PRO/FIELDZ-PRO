package com.fieldz.service;

import com.fieldz.dto.JoueurDto;
import com.fieldz.mapper.JoueurMapper;
import com.fieldz.model.Joueur;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class JoueurService {

    private final UtilisateurRepository utilisateurRepository;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public Joueur getByEmail(String email) {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(user instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }
        return joueur;
    }

    /** PUT /api/joueur/me : mise à jour null-safe des champs envoyés */
    public JoueurDto updateConnectedUser(Authentication authentication, JoueurDto dto) {
        String email = authentication.getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(user instanceof Joueur joueur)) {
            log.warn("Tentative d'update de /api/joueur/me par un non-joueur : {}", email);
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }

        if (notBlank(dto.getNom())) joueur.setNom(dto.getNom());
        if (notBlank(dto.getPrenom())) joueur.setPrenom(dto.getPrenom());
        if (notBlank(dto.getTelephone())) joueur.setTelephone(dto.getTelephone());
        if (notBlank(dto.getPhotoProfilUrl())) joueur.setPhotoProfilUrl(dto.getPhotoProfilUrl());

        // Option : marquer le profil complet si tout est renseigné
        if (profilComplet(joueur)) joueur.setProfilComplet(true);

        Joueur saved = (Joueur) utilisateurRepository.save(joueur);
        return JoueurMapper.toDto(saved);
    }

    private boolean profilComplet(Joueur j) {
        return notBlank(j.getNom()) && notBlank(j.getPrenom()) && notBlank(j.getTelephone());
    }
    private boolean notBlank(String s) { return s != null && !s.isBlank(); }
}
