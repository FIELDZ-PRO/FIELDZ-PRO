package com.fieldz.controller;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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
* Afficher les réservations d'un club
 */
    @GetMapping("/reservations")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getReservationsDuClub(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        // On récupère tous les terrains du club
        List<Terrain> terrains = terrainRepository.findByClub(club);

        // On récupère toutes les réservations liées à ces terrains via leurs créneaux
        List<Reservation> reservations = reservationRepository.findByCreneau_TerrainIn(terrains);

        return ResponseEntity.ok(reservations);
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

    @PutMapping("/reservations/{id}/annuler")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> annulerReservationParClub(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        // Vérifie si la réservation concerne bien un terrain du club
        List<Terrain> terrainsDuClub = terrainRepository.findByClub(club);
        if (!terrainsDuClub.contains(reservation.getCreneau().getTerrain())) {
            return ResponseEntity.status(403).body("Cette réservation ne concerne pas un terrain de votre club.");
        }

        // Mise à jour du statut
        reservation.setStatut(Statut.ANNULE);
        reservation.getCreneau().setStatut(Statut.LIBRE);
        reservation.getCreneau().setDisponible(true);

        reservationRepository.save(reservation); // ⚠ pas besoin de save le creneau à part
        return ResponseEntity.ok("Réservation annulée avec succès");
    }

    @GetMapping("/reservations/date")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getReservationsParDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate parsedDate,
            Authentication authentication) {

        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un club.");
        }

        List<Terrain> terrains = terrainRepository.findByClub(club);

        LocalDateTime startOfDay = parsedDate.atStartOfDay();
        LocalDateTime endOfDay = parsedDate.plusDays(1).atStartOfDay().minusNanos(1);

        List<Reservation> reservations = reservationRepository
                .findReservationsByTerrainsAndDateRange(terrains, startOfDay, endOfDay);

        System.out.println("📌 Terrains du club : " + terrains.size());
        System.out.println("📌 Date filtrée : " + parsedDate);
        System.out.println("📌 Réservations trouvées : " + reservations.size());

        return ResponseEntity.ok(reservations);
    }
}
