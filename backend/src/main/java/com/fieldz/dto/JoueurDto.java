package com.fieldz.dto;

import lombok.Data;

@Data
public class JoueurDto {
    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    // Ajoute d'autres champs à exposer côté front si besoin
}
