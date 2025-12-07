package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String nom;
    private String role; // ou typeRole
    private LocalDateTime dateInscription;
    private boolean profilComplet;
    private String prenom;

    // Nazim : Description = politique club
    private String description;
    private String telephone;
    private String adresse;
    private String locationLink;
}
