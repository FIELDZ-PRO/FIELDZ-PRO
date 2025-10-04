package com.fieldz.controller;
import com.fieldz.service.ClubService;

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

import com.fieldz.dto.ClubDto;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;
    // Garde les autres repositories s'ils servent à d'autres endpoints

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<ClubDto> getClubConnecte(Authentication authentication) {
        ClubDto clubDto = clubService.getClubConnecte(authentication);
        return ResponseEntity.ok(clubDto);
    }

    @GetMapping("/hello")
    @PreAuthorize("hasRole('CLUB')")
    public String helloClub(Authentication auth) {
        // Ici tu peux soit déléguer à un service, soit laisser tel quel (c'est juste un test)
        return "Hello club : " + auth.getName();
    }


}
