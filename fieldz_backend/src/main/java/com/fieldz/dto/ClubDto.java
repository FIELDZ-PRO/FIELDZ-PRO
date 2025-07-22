package com.fieldz.dto;

import lombok.Data;

@Data
public class ClubDto {
    private Long id;
    private String nomClub;
    private String nom; // Correction ici !
    private String adresse;

    // On n'ajoute pas la liste de terrains dans le DTO de base pour l'instant (sinon on risque d’avoir de gros objets ou de la récursivité)
}
