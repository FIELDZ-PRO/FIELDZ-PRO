package com.fieldz.controller;

import com.fieldz.dto.ClubDto;
import com.fieldz.model.Sport;
import com.fieldz.service.ClubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<ClubDto> getClubConnecte(Authentication authentication) {
        return ResponseEntity.ok(clubService.getClubConnecte(authentication));
    }

    @GetMapping("/hello")
    @PreAuthorize("hasRole('CLUB')")
    public String helloClub(Authentication auth) {
        return "Hello club : " + auth.getName();
    }

    // ===== RECHERCHES =====

    // 1) Par ville : GET /api/club/search/by-ville?ville=Alger
    @GetMapping("/search/by-ville")
    public ResponseEntity<List<ClubDto>> searchByVille(@RequestParam String ville) {
        if (ville == null || ville.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(clubService.searchByVille(ville));
    }

    // 2) Par sport : GET /api/club/search/by-sport?sport=PADEL
    @GetMapping("/search/by-sport")
    public ResponseEntity<List<ClubDto>> searchBySport(@RequestParam Sport sport) {
        return ResponseEntity.ok(clubService.searchBySport(sport));
    }

    // 3) Par ville + sport : GET /api/club/search?ville=Alger&sport=PADEL
    @GetMapping("/search")
    public ResponseEntity<List<ClubDto>> searchByVilleAndSport(@RequestParam String ville,
                                                               @RequestParam Sport sport) {
        if (ville == null || ville.isBlank()) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(clubService.searchByVilleAndSport(ville, sport));
    }

    // 4) Récupérer un club par son ID : GET /api/club/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ClubDto> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    // ===== GESTION DES IMAGES =====

    // 1) Ajouter une image au club connecté : POST /api/club/images
    @PostMapping("/images")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<com.fieldz.dto.ClubImageDto> addImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        com.fieldz.dto.ClubImageDto imageDto = clubService.addClubImage(authentication, file);
        return ResponseEntity.ok(imageDto);
    }

    // 2) Récupérer les images d'un club : GET /api/club/{clubId}/images
    @GetMapping("/{clubId}/images")
    public ResponseEntity<List<String>> getClubImages(@PathVariable Long clubId) {
        return ResponseEntity.ok(clubService.getClubImages(clubId));
    }

    // 3) Supprimer une image : DELETE /api/club/images/{imageId}
    @DeleteMapping("/images/{imageId}")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Void> deleteImage(
            Authentication authentication,
            @PathVariable Long imageId) throws IOException {
        clubService.deleteClubImage(authentication, imageId);
        return ResponseEntity.noContent().build();
    }

    // 4) Modifier l'ordre d'affichage d'une image : PUT /api/club/images/{imageId}/order
    @PutMapping("/images/{imageId}/order")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Void> updateImageOrder(
            Authentication authentication,
            @PathVariable Long imageId,
            @RequestParam Integer order) {
        clubService.updateImageOrder(authentication, imageId, order);
        return ResponseEntity.ok().build();
    }

}
