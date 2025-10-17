package com.fieldz.controller;

import com.fieldz.dto.CompleteProfileRequest;
import com.fieldz.dto.UserDto;
import com.fieldz.mapper.UserMapper;
import com.fieldz.model.Joueur;
import com.fieldz.model.Club;
import com.fieldz.model.Role;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.fieldz.dto.UpdateProfilRequest;
import com.fieldz.model.Sport;
import java.util.Set;

@RestController
@RequestMapping("/api/utilisateur")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    /**
     * Complète le profil de l'utilisateur connecté (JOUEUR ou CLUB).
     * Null-safe : seuls les champs fournis sont pris en compte.
     * Marque profilComplet=true si les champs essentiels du rôle sont bien
     * renseignés.
     */
    @PutMapping("/complete-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> completeProfile(@RequestBody CompleteProfileRequest req,
            @AuthenticationPrincipal Utilisateur user) {

        if (user.isProfilComplet()) {
            return ResponseEntity.badRequest().body("Profil déjà complété");
        }

        // (Optionnel) Si tu souhaites permettre de (re)préciser le rôle à cette étape
        /*
         * if (req.getRole() != null) {
         * user.setTypeRole(req.getRole());
         * } else if (user.getTypeRole() == null) {
         * // sécurité: si aucun rôle présent, on refuse la complétion
         * return
         * ResponseEntity.badRequest().body("Rôle manquant pour compléter le profil.");
         * }
         */

        // Champs communs
        if (notBlank(req.getNom()))
            user.setNom(req.getNom());

        if (user instanceof Joueur joueur) {
            // Champs joueur
            if (notBlank(req.getPrenom()))
                joueur.setPrenom(req.getPrenom());
            if (notBlank(req.getTelephone()))
                joueur.setTelephone(req.getTelephone());
            if (notBlank(req.getPhotoProfilUrl()))
                joueur.setPhotoProfilUrl(req.getPhotoProfilUrl());

            // Validation minimale avant de marquer complet
            if (notBlank(joueur.getNom()) && notBlank(joueur.getPrenom()) && notBlank(joueur.getTelephone())) {
                joueur.setProfilComplet(true);
            } else {
                return ResponseEntity.badRequest()
                        .body("Champs requis manquants pour le joueur (nom, prénom, téléphone).");
            }

            utilisateurRepository.save(joueur);
            return ResponseEntity.ok("Profil joueur complété avec succès.");
        }

        if (user instanceof Club club) {
            // Champs club
            if (notBlank(req.getNom()))
                club.setNom(req.getNom());
            if (notBlank(req.getVille()))
                club.setVille(req.getVille());
            if (notBlank(req.getAdresse()))
                club.setAdresse(req.getAdresse());
            if (notBlank(req.getTelephone()))
                club.setTelephone(req.getTelephone());
            if (notBlank(req.getBanniereUrl()))
                club.setBanniereUrl(req.getBanniereUrl());
            if (req.getSports() != null && !req.getSports().isEmpty()) {
                club.setSports(req.getSports());
            }

            // Validation minimale avant de marquer complet
            if (notBlank(club.getNom()) && notBlank(club.getVille()) && notBlank(club.getTelephone())) {
                club.setProfilComplet(true);
            } else {
                return ResponseEntity.badRequest()
                        .body("Champs requis manquants pour le club (nom, ville, téléphone).");
            }

            utilisateurRepository.save(club);
            return ResponseEntity.ok("Profil club complété avec succès.");
        }

        return ResponseEntity.badRequest().body("Type d'utilisateur non pris en charge.");
    }

    /**
     * Mise à jour partielle du profil (null-safe).
     * Ne modifie que les champs explicitement fournis.
     */
    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateProfil(@RequestBody UpdateProfilRequest req,
            @AuthenticationPrincipal Utilisateur utilisateur) {

        // Commun
        if (notBlank(req.getNom()))
            utilisateur.setNom(req.getNom());

        if (utilisateur instanceof Joueur joueur) {
            if (notBlank(req.getPrenom()))
                joueur.setPrenom(req.getPrenom());
            if (notBlank(req.getTelephone()))
                joueur.setTelephone(req.getTelephone());
            if (notBlank(req.getPhotoProfilUrl()))
                joueur.setPhotoProfilUrl(req.getPhotoProfilUrl());

            // (Optionnel) Revalider profilComplet si souhaité :
            if (!joueur.isProfilComplet() &&
                    notBlank(joueur.getNom()) && notBlank(joueur.getPrenom()) && notBlank(joueur.getTelephone())) {
                joueur.setProfilComplet(true);
            }

            utilisateurRepository.save(joueur);
            return ResponseEntity.ok("Profil joueur mis à jour avec succès.");
        }

        if (utilisateur instanceof Club club) {
            if (notBlank(req.getNom()))
                club.setNom(req.getNom());
            if (notBlank(req.getVille()))
                club.setVille(req.getVille());
            if (notBlank(req.getAdresse()))
                club.setAdresse(req.getAdresse());
            if (notBlank(req.getTelephone()))
                club.setTelephone(req.getTelephone());
            if (notBlank(req.getBanniereUrl()))
                club.setBanniereUrl(req.getBanniereUrl());

            Set<Sport> sports = req.getSports();
            if (sports != null) {
                // Choix d'update:
                // - si vide => on efface; si tu préfères "ne pas toucher si vide", remplace
                // par:
                // if (!sports.isEmpty()) club.setSports(sports);
                club.setSports(sports);
            }

            // (Optionnel) Revalider profilComplet si souhaité :
            if (!club.isProfilComplet() &&
                    notBlank(club.getNom()) && notBlank(club.getVille()) && notBlank(club.getTelephone())) {
                club.setProfilComplet(true);
            }

            utilisateurRepository.save(club);
            return ResponseEntity.ok("Profil club mis à jour avec succès.");
        }

        return ResponseEntity.badRequest().body("Type d'utilisateur non pris en charge.");
    }

    // --------- helpers ----------
    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}