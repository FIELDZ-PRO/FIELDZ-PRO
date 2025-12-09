package com.fieldz.dto;

import lombok.Data;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import com.fieldz.model.Sport;

@Data
public class ClubDto {
    private Long id;
    private String nom; // remplace nomClub
    private String ville;
    private String adresse;
    private String telephone;

    // Nazim : description
    private String description;
    private String politique;
    private String locationLink;
    private LocalTime heureOuverture;
    private LocalTime heureFermeture;
    private Set<com.fieldz.model.Sport> sports; // ou Set<String> si tu préfères décorréler

    // Liste des images du club avec IDs pour permettre la suppression
    private List<ClubImageDto> images;
    // Pas de terrains ici pour éviter gros payloads (fait un DTO dédié si besoin)
}
