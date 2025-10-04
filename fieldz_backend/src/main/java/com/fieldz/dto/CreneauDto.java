package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
public class CreneauDto {
    private Long id;
    //private LocalDate date;
    //private LocalTime heureDebut;
    //private LocalTime heureFin;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Double prix;
    private String statut;      // LIBRE, RESERVE, etc.
    private boolean disponible;
    //private Long terrainId;     // Pour ne pas exposer tout l'objet Terrain, seulement l'id
    private TerrainDto terrain;
}
