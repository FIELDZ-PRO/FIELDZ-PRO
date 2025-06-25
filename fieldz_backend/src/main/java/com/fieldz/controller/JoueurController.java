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

    @PostMapping("/reservations")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> reserver(@RequestParam Long creneauId,
                                      Authentication authentication) {

        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un joueur.");
        }

        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Creneau non trouvé"));

        if (!creneau.isDisponible()) {
            return ResponseEntity.badRequest().body("Ce créneau est déjà réservé.");
        }

        Reservation reservation = new Reservation();
        reservation.setCreneau(creneau);
        reservation.setJoueur(joueur);
        reservation.setDateReservation(LocalDateTime.now());
        reservation.setStatut(Statut.RESERVE);

        creneau.setDisponible(false);
        creneau.setStatut(Statut.RESERVE);
        creneau.setReservation(reservation);

        reservationRepository.save(reservation);
        creneauRepository.save(creneau);

        return ResponseEntity.ok("Réservation effectuée !");
    }
    @GetMapping("/reservations") // donc sur postman il faudra mettre
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> getAllReservations(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un joueur.");
        }

        return ResponseEntity.ok(joueur.getReservations());
    }
    @GetMapping("/reservations/{id}")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> getReservationById(@PathVariable Long id,
                                                Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un joueur.");
        }

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        // Vérifie que le joueur est bien le propriétaire de la réservation
        if (!reservation.getJoueur().getId().equals(joueur.getId())) {
            return ResponseEntity.status(403).body("Réservation non autorisée.");
        }

        return ResponseEntity.ok(reservation);
    }
    @DeleteMapping("/reservations/{id}")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<?> annulerReservation(@PathVariable Long id,
                                                Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            return ResponseEntity.status(403).body("L'utilisateur n'est pas un joueur.");
        }

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));

        if (!reservation.getJoueur().getId().equals(joueur.getId())) {
            return ResponseEntity.status(403).body("Réservation non autorisée.");
        }

        // Libérer le créneau
        Creneau creneau = reservation.getCreneau();
        creneau.setDisponible(true);
        creneau.setStatut(Statut.LIBRE);
        creneau.setReservation(null);

        reservationRepository.delete(reservation);
        creneauRepository.save(creneau);

        return ResponseEntity.ok("Réservation annulée avec succès !");
    }

}
