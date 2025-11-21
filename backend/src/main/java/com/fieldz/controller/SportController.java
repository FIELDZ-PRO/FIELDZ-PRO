package com.fieldz.controller;

import com.fieldz.model.Sport;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
public class SportController {

    /**
     * GET /api/sports
     * Récupère la liste de tous les sports disponibles
     */
    @GetMapping
    public ResponseEntity<List<Sport>> getAllSports() {
        List<Sport> sports = Arrays.asList(Sport.values());
        return ResponseEntity.ok(sports);
    }
}
