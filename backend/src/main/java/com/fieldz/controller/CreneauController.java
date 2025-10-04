package com.fieldz.controller;

import com.fieldz.dto.CreneauDto;
import com.fieldz.dto.CreneauRecurrentDto;
import com.fieldz.model.Creneau;
import com.fieldz.service.CreneauService;
import com.fieldz.mapper.CreneauMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;


import java.util.List;

@RestController
@RequestMapping("/api/creneaux")
@RequiredArgsConstructor
public class CreneauController {

    private final CreneauService creneauService;

    @PostMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<CreneauDto> ajouterCreneau(@PathVariable Long terrainId,
                                                     @RequestBody Creneau creneau,
                                                     Authentication authentication) {
        Creneau created = creneauService.ajouterCreneau(terrainId, creneau, authentication);
        return ResponseEntity.ok(CreneauMapper.toDto(created));
    }

    @GetMapping("/terrains/{terrainId}/creneaux")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<List<CreneauDto>> getCreneauxDuTerrain(@PathVariable Long terrainId,
                                                                 Authentication authentication) {
        List<Creneau> creneaux = creneauService.getCreneauxDuTerrain(terrainId, authentication);
        List<CreneauDto> dtos = creneaux.stream()
                .map(CreneauMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<List<CreneauDto>> getCreneauxDisponibles() {
        List<Creneau> dispo = creneauService.getCreneauxDisponibles();
        List<CreneauDto> dtos = dispo.stream()
                .map(CreneauMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> annulerCreneau(@PathVariable Long id, Authentication authentication) {
        creneauService.annulerCreneau(id, authentication);
        return ResponseEntity.ok("Créneau annulé avec succès.");
    }


    @PostMapping("/recurrent")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<?> creerCreneauxRecurrents(@RequestBody CreneauRecurrentDto dto) {
        Map<String, Object> response = creneauService.creerCreneauxRecurrents(dto);
        return ResponseEntity.ok(response);
    }



}
