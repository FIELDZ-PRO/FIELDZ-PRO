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

    @PostMapping("/terrain")
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

    @GetMapping("/terrains")
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
    @PostMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> ajouterCreneauSansDto(@PathVariable Long terrainId,
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
    @GetMapping("/hello")
    @PreAuthorize("hasRole('CLUB')")
    public String helloClub(Authentication auth) {
        System.out.println("Authorities: " + auth.getAuthorities());
        return "Hello club : " + auth.getName();
    }


}
