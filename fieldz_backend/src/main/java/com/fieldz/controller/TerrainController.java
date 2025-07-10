package com.fieldz.controller;

import com.fieldz.model.Club;
import com.fieldz.model.Terrain;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.TerrainRepository;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/terrains")
@RequiredArgsConstructor
public class TerrainController {
    private final UtilisateurRepository utilisateurRepository;
    private final TerrainRepository terrainRepository;

    @PostMapping
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> ajouterTerrain(
            @RequestBody Terrain terrain,
            Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        terrain.setClub(club);
        return ResponseEntity.ok(terrainRepository.save(terrain));
    }

    @GetMapping
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getTerrains(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        return ResponseEntity.ok(terrainRepository.findByClub(club));
    }
}

