package com.fieldz.dto;

import lombok.Data;

@Data
public class TerrainDto {
    private Long id;
    private String nomTerrain;
    private String typeSurface;
    private String ville;
    private String sport;
    //private Long clubId;    // Pour lier au club sans exposer l'objet Club
    private ClubDto club;

}
