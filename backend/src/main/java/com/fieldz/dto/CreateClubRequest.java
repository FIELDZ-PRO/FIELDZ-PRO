package com.fieldz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateClubRequest {
    // NOM DU CLUB (unique – remplace totalement nomClub)
    private String nom;

    private String adresse;
    private String telephone;
    private String sport;      // optionnel si vous gérez plus tard Set<Sport>
    private String ville;

    // Informations du responsable
    private String nomResponsable;
    private String emailResponsable;
    private String telephoneResponsable;
}
