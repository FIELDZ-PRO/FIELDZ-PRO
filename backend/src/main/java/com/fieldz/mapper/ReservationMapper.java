package com.fieldz.mapper;

import com.fieldz.dto.ReservationDto;
import com.fieldz.model.Reservation;

public class ReservationMapper {
    public static ReservationDto toDto(Reservation reservation) {
        if (reservation == null) return null;
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        dto.setJoueurId(reservation.getJoueur() != null ? reservation.getJoueur().getId() : null);

        //dto.setCreneauId(reservation.getCreneau() != null ? reservation.getCreneau().getId() : null);
        dto.setCreneau(CreneauMapper.toDto(reservation.getCreneau()));

        dto.setDateReservation(reservation.getDateReservation());
        dto.setStatut(reservation.getStatut().name());

        dto.setDateAnnulation(reservation.getDateAnnulation());
        dto.setMotifAnnulation(reservation.getMotifAnnulation());


        return dto;
    }
}
