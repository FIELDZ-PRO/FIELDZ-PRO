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
import com.fieldz.model.Reservation;
import com.fieldz.repository.ReservationRepository;
import com.fieldz.model.Creneau;
import com.fieldz.model.Statut;
import com.fieldz.repository.CreneauRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat; // ajoute cet import en haut
import java.time.LocalDateTime;
import java.util.List;

import com.fieldz.model.Reservation;
import com.fieldz.model.Terrain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final UtilisateurRepository utilisateurRepository;
    private final TerrainRepository terrainRepository;
    private final ReservationRepository reservationRepository;
    private final CreneauRepository creneauRepository;

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getClubConnecte(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        return ResponseEntity.ok(club);
    }

    @GetMapping("/hello")
    @PreAuthorize("hasRole('CLUB')")
    public String helloClub(Authentication auth) {
        System.out.println("Authorities: " + auth.getAuthorities());
        return "Hello club : " + auth.getName();
    }


}
