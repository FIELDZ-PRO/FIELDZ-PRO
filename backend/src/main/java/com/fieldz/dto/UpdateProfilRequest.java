package com.fieldz.dto;

import com.fieldz.model.Sport;
import lombok.Data;

import java.util.Set;

/**
 * Requête pour mettre à jour partiellement le profil utilisateur.
 * Null-safe : seuls les champs fournis seront modifiés.
 */
@Data
public class UpdateProfilRequest {

    // Champs communs
    private String nom;
    private String email;

    // JOUEUR uniquement
    private String prenom;
    private String telephone;
    private String photoProfilUrl;

    // CLUB uniquement
    private String ville;
    private String adresse;

    // Nazim : Champ de description
    private String description;
    private String politique;
    private String locationLink;
    private Set<com.fieldz.model.Sport> sports;
}
