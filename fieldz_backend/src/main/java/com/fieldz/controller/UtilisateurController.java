package com.fieldz.controller;

import com.fieldz.dto.CompleteProfileRequest;
import com.fieldz.dto.UserDto;
import com.fieldz.mapper.UserMapper;
import com.fieldz.model.Joueur;
import com.fieldz.model.Club;
import com.fieldz.model.Role;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.fieldz.dto.UpdateProfilRequest;



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

    @PutMapping("/complete-profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> completeProfile(@RequestBody CompleteProfileRequest request,
                                                  @AuthenticationPrincipal Utilisateur user) {

        if (user.isProfilComplet()) {
            return ResponseEntity.badRequest().body("Profil déjà complété");
        }

        if (!(user instanceof Joueur joueur)) {
            return ResponseEntity.badRequest().body("Complément de profil réservé aux joueurs.");
        }

        user.setNom(request.getNom());
        user.setTypeRole(Role.JOUEUR);
        user.setProfilComplet(true);

        joueur.setPrenom(request.getPrenom());
        joueur.setTelephone(request.getTelephone());

        utilisateurRepository.save(joueur);

        return ResponseEntity.ok("Profil joueur complété avec succès.");
    }

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateProfil(@RequestBody UpdateProfilRequest req,
                                               @AuthenticationPrincipal Utilisateur utilisateur) {
        if (utilisateur instanceof Joueur joueur) {
            joueur.setNom(req.getNom());
            joueur.setPrenom(req.getPrenom());
            joueur.setTelephone(req.getTelephone());
            utilisateurRepository.save(joueur);
            return ResponseEntity.ok("Profil joueur mis à jour avec succès.");
        }

        if (utilisateur instanceof Club club) {
            club.setNomClub(req.getNom());
            club.setAdresse(req.getAdresse());
            club.setTelephone(req.getTelephone());
            utilisateurRepository.save(club);
            return ResponseEntity.ok("Profil club mis à jour avec succès.");
        }

        return ResponseEntity.badRequest().body("Type d'utilisateur non pris en charge.");
    }

}
