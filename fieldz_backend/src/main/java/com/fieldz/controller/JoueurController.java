package com.fieldz.controller;

import com.fieldz.model.Utilisateur;
import com.fieldz.model.Creneau;
import com.fieldz.model.Reservation;
import com.fieldz.model.Joueur;
import com.fieldz.model.Statut;

import com.fieldz.repository.UtilisateurRepository;
import com.fieldz.repository.CreneauRepository;
import com.fieldz.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/joueur")
@RequiredArgsConstructor
public class JoueurController {

    private final UtilisateurRepository utilisateurRepository;
    private final CreneauRepository creneauRepository;
    private final ReservationRepository reservationRepository;

    @GetMapping("/hello")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Bienvenue, joueur authentifié !");
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> getConnectedUser(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return ResponseEntity.ok(user);
    }

}
