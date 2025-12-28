package com.fieldz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesDto {

    // Total number of reservations in the period
    private Long totalReservations;

    // Number of reservations with RESERVE status
    private Long reservationsReserve;

    // Total revenue from CONFIRMEE reservations
    private Double revenuConfirmee;

    // Period information
    private String periode; // "daily", "weekly", "monthly"
    private String dateDebut;
    private String dateFin;
}
