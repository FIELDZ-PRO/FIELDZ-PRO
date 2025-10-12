package com.fieldz.controller;

import com.fieldz.dto.*;
import com.fieldz.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Dashboard
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // Gestion des clubs
    @GetMapping("/clubs")
    public ResponseEntity<List<ClubAdminDto>> getAllClubs() {
        return ResponseEntity.ok(adminService.getAllClubs());
    }

    @GetMapping("/clubs/search")
    public ResponseEntity<List<ClubAdminDto>> searchClubs(@RequestParam String query) {
        return ResponseEntity.ok(adminService.searchClubs(query));
    }

    @GetMapping("/clubs/{id}")
    public ResponseEntity<ClubAdminDto> getClubDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getClubDetails(id));
    }

    @PostMapping("/clubs")
    public ResponseEntity<ClubAdminDto> createClub(@RequestBody CreateClubRequest request) {
        return ResponseEntity.ok(adminService.createClub(request));
    }

    // Gestion des joueurs
    @GetMapping("/joueurs")
    public ResponseEntity<List<JoueurAdminDto>> getAllJoueurs() {
        return ResponseEntity.ok(adminService.getAllJoueurs());
    }

    @GetMapping("/joueurs/search")
    public ResponseEntity<List<JoueurAdminDto>> searchJoueurs(@RequestParam String query) {
        return ResponseEntity.ok(adminService.searchJoueurs(query));
    }

    @GetMapping("/joueurs/{id}")
    public ResponseEntity<JoueurAdminDto> getJoueurDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getJoueurDetails(id));
    }

    @PatchMapping("/joueurs/{id}/toggle-status")
    public ResponseEntity<JoueurAdminDto> toggleJoueurStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleJoueurStatus(id));
    }
}
