package com.fieldz.controller;

import com.fieldz.dto.CompleteProfileRequest;
import com.fieldz.dto.UserDto;
import com.fieldz.mapper.UserMapper;
import com.fieldz.model.Joueur;
import com.fieldz.model.Club;
import com.fieldz.model.ClubImage;
import com.fieldz.model.Role;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.ClubImageRepository;
import com.fieldz.repository.UtilisateurRepository;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.constraints.NotNull;
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
    private final ClubImageRepository clubImageRepository;

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
            if (req.getSports() != null && !req.getSports().isEmpty()) {
                club.setSports(req.getSports());
            }

            // Ajouter l'image au début de la liste si fournie
            if (notBlank(req.getImageUrl())) {
                ClubImage clubImage = ClubImage.builder()
                        .imageUrl(req.getImageUrl())
                        .club(club)
                        .displayOrder(0) // Première position
                        .build();
                clubImageRepository.save(clubImage);
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
            if (notBlank(req.getDescription()))
                joueur.setDescription(req.getDescription());
            // (Optionnel) Revalider profilComplet si souhaité :
            if (!joueur.isProfilComplet() &&
                    notBlank(joueur.getNom()) && notBlank(joueur.getPrenom()) && notBlank(joueur.getTelephone())) {
                joueur.setProfilComplet(true);
            }

            utilisateurRepository.save(joueur);
            return ResponseEntity.ok("Profil joueur mis à jour avec succès.");
        }

        if (utilisateur instanceof Club club) {
            // Re-fetch entity managed (bonne pratique JPA)
            Club managedClub = utilisateurRepository.findById(club.getId())
                    .filter(Club.class::isInstance)
                    .map(Club.class::cast)
                    .orElseThrow(() -> new RuntimeException("Club introuvable"));

            // Helpers
            java.util.function.Function<String, String> clean = s -> (s == null) ? null : s.trim();
            java.util.function.Predicate<String> hasText = s -> s != null && !s.trim().isEmpty();

            // N'écrire que si fourni et non vide (évite d'écraser par "")
            if (hasText.test(req.getNom()))
                managedClub.setNom(clean.apply(req.getNom()));
            if (hasText.test(req.getVille()))
                managedClub.setVille(clean.apply(req.getVille()));
            if (hasText.test(req.getAdresse()))
                managedClub.setAdresse(clean.apply(req.getAdresse()));
            if (hasText.test(req.getTelephone()))
                managedClub.setTelephone(clean.apply(req.getTelephone()));

            // Champs longs : on accepte chaîne vide => efface si tu veux, sinon garde la
            // même logique que dessus
            if (req.getDescription() != null)
                managedClub.setDescription(req.getDescription()); // pas de trim obligatoire
            if (req.getPolitique() != null)
                managedClub.setPolitique(req.getPolitique());

            if (req.getSports() != null) {
                managedClub.setSports(req.getSports()); // null => ne touche pas; vide => efface
            }

            // (Re)validation profil complet basée sur l'entité à jour
            if (!Boolean.TRUE.equals(managedClub.isProfilComplet())) {
                if (hasText.test(managedClub.getNom())
                        && hasText.test(managedClub.getVille())
                        && hasText.test(managedClub.getTelephone())) {
                    managedClub.setProfilComplet(true);
                }
            }

            // Log correct
            System.out.println("Club politique (aperçu) : " +
                    (managedClub.getPolitique() == null ? "<null>"
                            : managedClub.getPolitique().substring(0, Math.min(80, managedClub.getPolitique().length()))
                                    + "..."));

            utilisateurRepository.save(managedClub);
            return ResponseEntity.ok("Profil club mis à jour avec succès.");
        }

        return ResponseEntity.badRequest().body("Type d'utilisateur non pris en charge.");
    }

    // --------- helpers ----------
    private boolean notBlank(String s) {
        return s != null && !s.isBlank();
    }
}