package com.fieldz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
public class CreneauDto {
    private Long id;
    
    // Ancien format (pour compatibilité frontend)
    private LocalDate date;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime heureDebut;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime heureFin;
    
    // Nouveau format (pour logique backend)
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    
    private Double prix;
    private String statut;
    private boolean disponible;
    private TerrainSimpleDto terrain;
    
    @Data
    public static class TerrainSimpleDto {
        private Long id;
        private String nom;
        private String sport;
    }
}