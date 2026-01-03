package com.fieldz.controller;

import com.fieldz.dto.CreneauDto;
import com.fieldz.dto.CreneauRecurrentDto;
import com.fieldz.dto.UpdateCreneauRequest;
import com.fieldz.mapper.CreneauMapper;
import com.fieldz.model.Creneau;
import com.fieldz.service.CreneauService;
import com.fieldz.exception.CreneauHasActiveReservationsException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/creneaux", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CreneauController {

    private final CreneauService creneauService;

    // LISTE de TOUS les créneaux du club (GET) - WITH PAGINATION
    // GET /api/creneaux?page=0&size=20
    @GetMapping
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Page<CreneauDto>> getAllCreneauxDuClub(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        Page<CreneauDto> dtos = creneauService.getAllCreneauxDuClubPaginated(page, size, authentication);
        return ResponseEntity.ok(dtos);
    }

    // LISTE des créneaux d'un terrain (GET) - WITH PAGINATION
    // GET /api/creneaux/terrains/{terrainId}?page=0&size=20
    @GetMapping(path = {"/terrains/{terrainId}", "/terrains/{terrainId}/creneaux"})
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Page<CreneauDto>> getCreneauxDuTerrain(
            @PathVariable Long terrainId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {

        Page<CreneauDto> dtos = creneauService.getCreneauxDuTerrainPaginated(terrainId, page, size, authentication);
        return ResponseEntity.ok(dtos);
    }

    // CRÉATION d'un créneau (POST) – si ton front envoie encore sur /creneaux
    @PostMapping(path = {"/terrains/{terrainId}", "/terrains/{terrainId}/creneaux"})
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<CreneauDto> ajouterCreneau(@PathVariable Long terrainId,
                                                     @RequestBody Creneau creneau,
                                                     Authentication authentication) {
        Creneau created = creneauService.ajouterCreneau(terrainId, creneau, authentication);
        return ResponseEntity.ok(CreneauMapper.toDto(created));
    }


    // GET /api/creneaux/disponibles
    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<List<CreneauDto>> getCreneauxDisponibles() {
        List<CreneauDto> dtos = creneauService.getCreneauxDisponibles()
                .stream().map(CreneauMapper::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    // PUT /api/creneaux/{id}/annuler
    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Map<String, Object>> annulerCreneau(@PathVariable Long id,
                                                              Authentication authentication) {
        creneauService.annulerCreneau(id, authentication);
        return ResponseEntity.ok(Map.of(
                "creneauId", id,
                "message", "Créneau annulé avec succès."
        ));
    }

    // POST /api/creneaux/recurrent
    @PostMapping(value = "/recurrent", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Map<String, Object>> creerCreneauxRecurrents(@RequestBody CreneauRecurrentDto dto) {
        Map<String, Object> response = creneauService.creerCreneauxRecurrents(dto);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/creneaux/{id}?force=false
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Map<String, Object>> deleteCreneau(@PathVariable Long id,
                                                             @RequestParam(defaultValue = "false") boolean force,
                                                             Authentication auth) {
        int annulees = creneauService.supprimerCreneau(id, auth, force);
        return ResponseEntity.ok(Map.of(
                "creneauId", id,
                "reservationsAnnulees", annulees,
                "deleted", true
        ));
    }

    // PUT /api/creneaux/{creneauId}
    @PutMapping(value = "/{creneauId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<CreneauDto> updateCreneau(@PathVariable Long creneauId,
                                                    @RequestBody UpdateCreneauRequest req,
                                                    Authentication authentication) {
        Creneau updated = creneauService.updateCreneau(creneauId, req, authentication);
        return ResponseEntity.ok(CreneauMapper.toDto(updated));
    }

    /**
     * GET /api/creneaux/club/{clubId}?date=YYYY-MM-DD&sport=PADEL
     * Créneaux disponibles d'un club pour une date donnée et optionnellement un sport (PUBLIC)
     */
    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<CreneauDto>> getCreneauxDisponiblesParClub(@PathVariable Long clubId,
                                                                          @RequestParam(required = false) String date,
                                                                          @RequestParam(required = false) String sport) {
        List<CreneauDto> dtos = creneauService.getCreneauxDisponiblesParClub(clubId, date, sport)
                .stream().map(CreneauMapper::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    /* -------- Handlers d'erreurs spécifiques / propres pour Postman -------- */

    @ExceptionHandler(CreneauHasActiveReservationsException.class)
    public ResponseEntity<Map<String, Object>> handleActive(CreneauHasActiveReservationsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "code", "CRENEAU_HAS_ACTIVE_RESERVATIONS",
                "message", ex.getMessage(),
                "creneauId", ex.getCreneauId(),
                "activeReservations", ex.getActiveCount()
        ));
    }

    // Optionnel (utile pour le debug Postman) : renvoie un JSON 400/500 propre
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "BadRequest",
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        // Conseil: log.error("Creneaux endpoint error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", ex.getClass().getSimpleName(),
                "message", ex.getMessage()
        ));
    }
}
