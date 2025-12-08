package com.fieldz.dto;

import com.fieldz.model.Role;
import com.fieldz.model.Sport;
import lombok.Data;

import java.util.Set;

/**
 * Requête pour compléter un profil après création de compte avec Google (parce
 * qu'au moment de la
 * création on a adresse mail et mdp seulement !!
 * Champs optionnels selon le rôle (JOUEUR ou CLUB).
 */
@Data
public class CompleteProfileRequest {

    // Champs communs
    // Il faudra l'ajouter si on veut la possibilité de changer de rôle
    // un jour :
    // private Role role; // JOUEUR ou CLUB

    private String nom;

    // JOUEUR uniquement
    private String prenom;
    private String telephone;
    private String photoProfilUrl;
    private String locationLink;
    // CLUB uniquement
    private String ville;
    private String adresse;
    private String ImageUrl;
    private Set<com.fieldz.model.Sport> sports;
}
