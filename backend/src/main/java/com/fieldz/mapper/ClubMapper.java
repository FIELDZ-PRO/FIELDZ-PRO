package com.fieldz.mapper;

import com.fieldz.dto.ClubDto;
import com.fieldz.model.Club;

public class ClubMapper {

    public static ClubDto toDto(Club club) {
        if (club == null)
            return null;

        ClubDto dto = new ClubDto();
        dto.setId(club.getId());
        dto.setNom(club.getNom());
        dto.setVille(club.getVille());
        dto.setAdresse(club.getAdresse());
        dto.setTelephone(club.getTelephone());
        dto.setBanniereUrl(club.getBanniereUrl());

        // Ajout du map pour la description
        dto.setDescription(club.getDescription());
        dto.setPolitique(club.getPolitique());
        dto.setSports(club.getSports());
        return dto;
    }
}