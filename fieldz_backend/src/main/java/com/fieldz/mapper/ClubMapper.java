package com.fieldz.mapper;

import com.fieldz.dto.ClubDto;
import com.fieldz.model.Club;

public class ClubMapper {
    public static ClubDto toDto(Club club) {
        if (club == null) return null;
        ClubDto dto = new ClubDto();
        dto.setId(club.getId());
        dto.setNomClub(club.getNomClub());
        dto.setNom(club.getNom()); // Attention au nom
        dto.setAdresse(club.getAdresse());
        // Pas de mapping des terrains ici pour le DTO simple
        return dto;
    }
}
