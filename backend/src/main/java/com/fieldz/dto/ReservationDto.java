package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationDto {
    private Long id;
    private Long joueurId;          // Pour lier le joueur sans exposer tout l'objet
    // private Long creneauId;         // Pour lier le créneau sans exposer tout l'objet
    private CreneauDto creneau;
    private LocalDateTime dateReservation;
    private String statut;          // LIBRE, RESERVE, etc.

    private LocalDateTime dateAnnulation;
    private String motifAnnulation;

}
