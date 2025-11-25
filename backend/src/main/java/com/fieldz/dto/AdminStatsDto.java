package com.fieldz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {
    private Long totalClubs;
    private Long totalJoueurs;
    private Long reservationsHebdomadaires;
     private Double croissanceClubs; // pourcentage de croissance des clubs
     private Double croissanceJoueurs; // pourcentage de croissance des joueurs
}