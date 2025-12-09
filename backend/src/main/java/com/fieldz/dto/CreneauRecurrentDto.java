package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreneauRecurrentDto {
    private LocalDate dateDebut;     // ex : 2025-08-05
    private LocalDate dateFin;       // ex : 2025-09-05
    private String jourDeSemaine;    // "LUNDI", "MARDI", etc.
    private LocalTime heureDebut;    // ex : 18:00
    private int dureeMinutes;        // ex : 60
    private double prix;
    private Long terrainId;
    private String nomReservant;     // Nom du réservant (optionnel)
    private Boolean autoReserver;    // Si true, créer automatiquement des réservations
    private Integer nombreDuplications; // Nombre de créneaux à créer par jour (ex: 3 créneaux par jour)
}
