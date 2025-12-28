package com.fieldz.controller;

import com.fieldz.dto.StatistiquesDto;
import com.fieldz.service.StatistiquesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
public class StatistiquesController {

    private final StatistiquesService statistiquesService;

    /**
     * GET /api/statistiques/journalieres
     * Get daily statistics for the authenticated club (today)
     */
    @GetMapping("/journalieres")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<StatistiquesDto> getStatistiquesJournalieres(Authentication authentication) {
        StatistiquesDto stats = statistiquesService.getStatistiquesJournalieres(authentication);
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/statistiques/hebdomadaires
     * Get weekly statistics for the authenticated club (current week: Monday to Sunday)
     */
    @GetMapping("/hebdomadaires")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<StatistiquesDto> getStatistiquesHebdomadaires(Authentication authentication) {
        StatistiquesDto stats = statistiquesService.getStatistiquesHebdomadaires(authentication);
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/statistiques/mensuelles
     * Get monthly statistics for the authenticated club (current month)
     */
    @GetMapping("/mensuelles")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<StatistiquesDto> getStatistiquesMensuelles(Authentication authentication) {
        StatistiquesDto stats = statistiquesService.getStatistiquesMensuelles(authentication);
        return ResponseEntity.ok(stats);
    }
}
