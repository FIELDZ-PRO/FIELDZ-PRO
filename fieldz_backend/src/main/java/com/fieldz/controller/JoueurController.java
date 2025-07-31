package com.fieldz.controller;

import com.fieldz.dto.JoueurDto;
import com.fieldz.service.JoueurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/joueur")
@RequiredArgsConstructor
public class JoueurController {

    private final JoueurService joueurService;

    @GetMapping("/hello")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Bienvenue, joueur authentifié !");
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<JoueurDto> getConnectedUser(Authentication authentication) {
        JoueurDto dto = joueurService.getConnectedUserDto(authentication);
        return ResponseEntity.ok(dto);
    }


}
