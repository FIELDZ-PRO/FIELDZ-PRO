package com.fieldz.controller;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final UtilisateurRepository utilisateurRepository;
    private final CreneauRepository creneauRepository;
    private final ReservationRepository reservationRepository;
    private final TerrainRepository terrainRepository;

    /**
     * Réservation d’un créneau par un joueur
     */
    @PostMapping("/creneau/{creneauId}")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> reserver(
            @PathVariable Long creneauId,
            Authentication authentication) {

        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un joueur.");
        }

        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));

        if (!creneau.getStatut().equals(Statut.LIBRE)) {
            return ResponseEntity.badRequest().body("Créneau déjà réservé");
        }

        creneau.setStatut(Statut.RESERVE);
        creneau.setDisponible(false);

        Reservation reservation = new Reservation();
        reservation.setCreneau(creneau);
        reservation.setJoueur(joueur);
        reservation.setDateReservation(LocalDateTime.now());
        reservation.setStatut(Statut.RESERVE);

        reservationRepository.save(reservation);
        return ResponseEntity.ok(reservation);
    }

    /**
     * Liste des réservations du joueur connecté
     */
    @GetMapping("/mes")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> mesReservations(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un joueur.");
        }

        List<Reservation> reservations = reservationRepository.findByJoueur(joueur);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Annulation d’une réservation (par un joueur ou un club)
     */
    @DeleteMapping("/{reservationId}")
    @PreAuthorize("hasAnyRole('JOUEUR', 'CLUB')")
    public ResponseEntity<?> annulerReservation(
            @PathVariable Long reservationId,
            Authentication authentication) {

        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        Creneau creneau = reservation.getCreneau();
        boolean autorise = false;

        if (utilisateur instanceof Joueur joueur) {
            autorise = reservation.getJoueur().getId().equals(joueur.getId());
        } else if (utilisateur instanceof Club club) {
            autorise = creneau.getTerrain().getClub().getId().equals(club.getId());
        }

        if (!autorise) {
            return ResponseEntity.status(403).body("Vous n’avez pas le droit d’annuler cette réservation.");
        }

        // Libération du créneau
        creneau.setStatut(Statut.LIBRE);
        creneau.setDisponible(true);
        creneau.setReservation(null); // pour libérer l'association s’il y en a une

        // Suppression de la réservation
        reservationRepository.delete(reservation);

        return ResponseEntity.ok("Réservation annulée avec succès.");
    }
}
