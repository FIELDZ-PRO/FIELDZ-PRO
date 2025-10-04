package com.fieldz.controller;

import com.fieldz.dto.TerrainDto;
import com.fieldz.model.Terrain;
import com.fieldz.service.TerrainService;
import com.fieldz.mapper.TerrainMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.util.StringUtils;

@RestController
@RequestMapping("/api/terrains")
@RequiredArgsConstructor
public class TerrainController {

    private final TerrainService terrainService;

    @PostMapping
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<TerrainDto> ajouterTerrain(
            @RequestBody Terrain terrain,
            Authentication authentication) {
        Terrain saved = terrainService.ajouterTerrain(terrain, authentication);
        return ResponseEntity.ok(TerrainMapper.toDto(saved));
    }

    @GetMapping
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<List<TerrainDto>> getTerrains(Authentication authentication) {
        List<Terrain> terrains = terrainService.getTerrains(authentication);
        List<TerrainDto> dtos = terrains.stream()
                .map(TerrainMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // ====== NOUVEAUX ENDPOINTS ======

    // Filtre exact: une ou plusieurs villes
    // GET /api/terrains/search?ville=Alger
    // GET /api/terrains/search?villes=Alger,Oran
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('JOUEUR','CLUB','ADMIN')")
    public ResponseEntity<List<TerrainDto>> searchTerrains(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String villes) {

        List<Terrain> terrains;
        if (StringUtils.hasText(villes)) {
            terrains = terrainService.getTerrainsParVillesCsv(villes);
        } else {
            terrains = terrainService.getTerrainsParVille(ville);
        }

        List<TerrainDto> dtos = terrains.stream()
                .map(TerrainMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // Recherche partielle (autocomplétion):
    // GET /api/terrains/search/contains?q=alg
    @GetMapping("/search/contains")
    @PreAuthorize("hasAnyRole('JOUEUR','CLUB','ADMIN')")
    public ResponseEntity<List<TerrainDto>> searchTerrainsContains(@RequestParam("q") String q) {
        List<Terrain> terrains = terrainService.searchVilleContient(q);
        List<TerrainDto> dtos = terrains.stream()
                .map(TerrainMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
