package com.fieldz.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubAdminDto {
 private Long id;

 // Uniquement "nom" désormais (plus de nomClub)
 private String nom;

 private String adresse;
 private String telephone;

 // Informations du responsable (Utilisateur)
 private String emailResponsable;
 private String nomResponsable;

 // Identifiants de connexion (login = email du responsable, password renvoyé UNIQUEMENT à la création)
 private String login;
 private String password;

 // Pour l'affichage
 private String sport;  // si dispo côté entité, sinon laissez null
 private String ville;  // peut être extrait d'adresse ou stocké tel quel
}
