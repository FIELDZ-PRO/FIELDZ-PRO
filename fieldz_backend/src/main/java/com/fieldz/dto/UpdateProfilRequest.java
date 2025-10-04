package com.fieldz.dto;

import lombok.Data;

@Data
public class UpdateProfilRequest {
    private String nom;         // nomClub ou nom du joueur
    private String prenom;      // Joueur uniquement
    private String telephone;   // Les deux
    private String adresse;     // Club uniquement
}
