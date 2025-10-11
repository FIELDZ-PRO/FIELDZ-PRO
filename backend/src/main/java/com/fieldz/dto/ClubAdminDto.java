package com.fieldz.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubAdminDto {
    private Long id;
    private String nomClub;
    private String nom; // Pour la recherche
    private String adresse;
    private String telephone;
    
    // Informations du responsable (Utilisateur)
    private String emailResponsable;
    private String nomResponsable;
    
    // Identifiants de connexion
    private String login;
    private String password;
    
    // Pour l'affichage dans la liste
    private String sport; // On peut l'inférer des terrains, ou ajouter dans Club
    private String ville; // On peut l'extraire de l'adresse
}