package com.fieldz.dto;

import lombok.Data;

@Data
public class JoueurDto {
    private Long id;
    private String nom;            // hérité de Utilisateur
    private String prenom;
    private String telephone;
    private String photoProfilUrl; // nouveau
}
