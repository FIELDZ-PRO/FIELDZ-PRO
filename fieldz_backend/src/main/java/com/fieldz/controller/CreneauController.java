package com.fieldz.controller;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/creneaux")
@RequiredArgsConstructor
public class CreneauController {

    private final CreneauRepository creneauRepository;
    private final TerrainRepository terrainRepository;
    private final UtilisateurRepository utilisateurRepository;
    @PostMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> ajouterCreneau(@PathVariable Long terrainId,
                                                   @RequestBody Creneau creneau,
                                                   Authentication authentication) {

        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        // Vérifie que le terrain appartient bien au club
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        if (!terrain.getClub().getId().equals(club.getId())) {
            return ResponseEntity.status(403).body("Ce terrain ne vous appartient pas.");
        }

        creneau.setTerrain(terrain);  // Association au terrain
        creneau.setStatut(Statut.LIBRE);  // Valeur par défaut si non envoyée
        creneau.setDisponible(true);      // Valeur par défaut aussi

        return ResponseEntity.ok(creneauRepository.save(creneau));
    }
    @GetMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getCreneauxDuTerrain(@PathVariable Long terrainId,
                                                  Authentication authentication) {

        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        // Vérifie que le terrain appartient bien au club
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));
        if (!terrain.getClub().getId().equals(club.getId())) {
            return ResponseEntity.status(403).body("Ce terrain ne vous appartient pas.");
        }

        return ResponseEntity.ok(terrain.getCreneaux());
    }
    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<List<Creneau>> getCreneauxDisponibles() {
        List<Creneau> disponibles = creneauRepository.findByStatut(Statut.LIBRE);
        return ResponseEntity.ok(disponibles);
    }
}
