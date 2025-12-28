package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UpdateCreneauRequest {
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Double prix;
    // TODO: TEMPORARY - Remove this field later (secondPrix feature is temporary)
    private Double secondPrix;
    private Long terrainId; // optionnel : déplacer le créneau vers un autre terrain du même club
}
