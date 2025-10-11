package com.fieldz.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateClubRequest {
    private String nomClub;
    private String adresse;
    private String telephone;
    private String sport;
    private String ville;
    
    // Informations du responsable
    private String nomResponsable;
    private String emailResponsable;
    private String telephoneResponsable;
}