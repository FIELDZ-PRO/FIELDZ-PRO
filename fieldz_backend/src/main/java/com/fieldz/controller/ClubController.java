package com.fieldz.controller;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final UtilisateurRepository utilisateurRepository;
    private final TerrainRepository terrainRepository;
    private final ReservationRepository reservationRepository;
    private final CreneauRepository creneauRepository;

    private Club getClub(Authentication authentication) throws AccessDeniedException {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new AccessDeniedException("Vous devez être un CLUB pour effectuer cette action.");
        }
        return club;
    }

    @PostMapping("/terrain")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> ajouterTerrain(@RequestBody Terrain terrain, Authentication authentication) throws AccessDeniedException {
        Club club = getClub(authentication);
        terrain.setClub(club);
        return ResponseEntity.ok(terrainRepository.save(terrain));
    }

    @GetMapping("/terrains")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getTerrains(Authentication authentication) throws AccessDeniedException {
        Club club = getClub(authentication);
        return ResponseEntity.ok(terrainRepository.findByClub(club));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getClubConnecte(Authentication authentication) throws AccessDeniedException {
        Club club = getClub(authentication);
        return ResponseEntity.ok(club);
    }

    @PostMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> ajouterCreneauSansDto(
            @PathVariable Long terrainId,
            @RequestBody Creneau creneau,
            Authentication authentication) throws AccessDeniedException {

        Club club = getClub(authentication);
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new EntityNotFoundException("Terrain introuvable avec l'id " + terrainId));

        if (!terrain.getClub().getId().equals(club.getId())) {
            throw new AccessDeniedException("Ce terrain ne vous appartient pas.");
        }

        creneau.setTerrain(terrain);
        creneau.setStatut(Statut.LIBRE);
        creneau.setDisponible(true);

        return ResponseEntity.ok(creneauRepository.save(creneau));
    }

    @GetMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getCreneauxDuTerrain(@PathVariable Long terrainId, Authentication authentication) throws AccessDeniedException {
        Club club = getClub(authentication);
        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new EntityNotFoundException("Terrain introuvable avec l'id " + terrainId));

        if (!terrain.getClub().getId().equals(club.getId())) {
            throw new AccessDeniedException("Ce terrain ne vous appartient pas.");
        }

        return ResponseEntity.ok(terrain.getCreneaux());
    }

    @GetMapping("/reservations")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getReservationsDuClub(Authentication authentication) throws AccessDeniedException {
        Club club = getClub(authentication);
        List<Terrain> terrains = terrainRepository.findByClub(club);
        List<Reservation> reservations = reservationRepository.findByCreneau_TerrainIn(terrains);
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/reservations/{id}/annuler")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> annulerReservationParClub(@PathVariable Long id, Authentication authentication) throws AccessDeniedException {
        Club club = getClub(authentication);
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réservation introuvable avec l'id : " + id));

        List<Terrain> terrainsDuClub = terrainRepository.findByClub(club);
        if (!terrainsDuClub.contains(reservation.getCreneau().getTerrain())) {
            throw new AccessDeniedException("Cette réservation ne concerne pas un terrain de votre club.");
        }

        reservation.setStatut(Statut.ANNULE);
        reservation.getCreneau().setStatut(Statut.LIBRE);
        reservation.getCreneau().setDisponible(true);

        reservationRepository.save(reservation);
        return ResponseEntity.ok("Réservation annulée avec succès.");
    }

    @GetMapping("/reservations/date")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> getReservationsParDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate parsedDate,
            Authentication authentication) throws AccessDeniedException {

        Club club = getClub(authentication);
        List<Terrain> terrains = terrainRepository.findByClub(club);

        LocalDateTime startOfDay = parsedDate.atStartOfDay();
        LocalDateTime endOfDay = parsedDate.plusDays(1).atStartOfDay().minusNanos(1);

        List<Reservation> reservations = reservationRepository
                .findReservationsByTerrainsAndDateRange(terrains, startOfDay, endOfDay);

        return ResponseEntity.ok(reservations);
    }
}
