package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreneauDto {
    private Long id;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Double prix;
    private String statut;      // LIBRE, RESERVE, etc.
    private boolean disponible;
    private TerrainDto terrain; // Référence au DTO existant
}
