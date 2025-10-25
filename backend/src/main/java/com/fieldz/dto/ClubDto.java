package com.fieldz.dto;

import lombok.Data;
import java.util.Set;
import com.fieldz.model.Sport;

@Data
public class ClubDto {
    private Long id;
    private String nom; // remplace nomClub
    private String ville;
    private String adresse;
    private String telephone;
    private String banniereUrl;

    // Nazim : description
    private String description;
    private String politique;
    private Set<com.fieldz.model.Sport> sports; // ou Set<String> si tu préfères décorréler
    // Pas de terrains ici pour éviter gros payloads (fait un DTO dédié si besoin)
}
