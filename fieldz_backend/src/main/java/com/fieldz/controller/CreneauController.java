package com.fieldz.controller;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.persistence.EntityNotFoundException;



@RestController
@RequestMapping("/api/creneaux")
@RequiredArgsConstructor
public class CreneauController {

    private final CreneauRepository creneauRepository;
    private final TerrainRepository terrainRepository;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping("/terrain/{terrainId}")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> ajouterCreneau(
            @PathVariable Long terrainId,
            @RequestBody Creneau creneau,
            Authentication authentication) {

        // Récupérer le club connecté
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        if (!terrain.getClub().getId().equals(club.getId())) {
            return ResponseEntity.status(403).body("Ce terrain n'appartient pas à votre club.");
        }

        creneau.setTerrain(terrain);
        creneau.setStatut(Statut.LIBRE); // valeur par défaut
        return ResponseEntity.ok(creneauRepository.save(creneau));
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<List<Creneau>> getCreneauxDisponibles() {
        List<Creneau> disponibles = creneauRepository.findByStatut(Statut.LIBRE);
        return ResponseEntity.ok(disponibles);
    }
    @GetMapping("/creneaux")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> getCreneauxDisponibles(
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = true) Long terrainId
    ) {
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new EntityNotFoundException("Terrain introuvable avec l'id : " + terrainId));

        List<Creneau> creneaux = creneauRepository.findCreneauxDisponiblesByDateAndTerrain(date, terrainId);

        if (creneaux.isEmpty()) {
            return ResponseEntity.status(404).body("Aucun créneau disponible pour cette date et ce terrain.");
        }

        return ResponseEntity.ok(creneaux);
    }

}
