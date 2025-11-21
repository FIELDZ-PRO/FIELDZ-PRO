package com.fieldz.mapper;

import com.fieldz.dto.ReservationDto;
import com.fieldz.dto.JoueurDto;
import com.fieldz.model.Reservation;
import com.fieldz.model.Joueur;


public class ReservationMapper {
    public static ReservationDto toDto(Reservation reservation) {
        if (reservation == null) return null;
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        //dto.setJoueurId(reservation.getJoueur() != null ? reservation.getJoueur().getId() : null);

        //dto.setCreneauId(reservation.getCreneau() != null ? reservation.getCreneau().getId() : null);
        dto.setCreneau(CreneauMapper.toDto(reservation.getCreneau()));

        dto.setDateReservation(reservation.getDateReservation());
        dto.setStatut(reservation.getStatut().name());

        dto.setDateAnnulation(reservation.getDateAnnulation());
        dto.setMotifAnnulation(reservation.getMotifAnnulation());
        dto.setNomReservant(reservation.getNomReservant());

        Joueur joueur = reservation.getJoueur();

        if (joueur != null) {
            //dto.setJoueurId(joueur.getId());
            dto.setJoueur(JoueurMapper.toDto(joueur));
        }

        return dto;
    }
}
