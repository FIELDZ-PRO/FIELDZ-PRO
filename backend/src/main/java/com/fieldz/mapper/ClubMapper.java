package com.fieldz.mapper;

import com.fieldz.dto.ClubDto;
import com.fieldz.dto.ClubImageDto;
import com.fieldz.model.Club;
import com.fieldz.model.ClubImage;

import java.util.Comparator;
import java.util.stream.Collectors;

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

        // Ajout du map pour la description
        dto.setDescription(club.getDescription());
        dto.setPolitique(club.getPolitique());
        dto.setLocationLink(club.getLocationLink());
        dto.setHeureOuverture(club.getHeureOuverture());
        dto.setHeureFermeture(club.getHeureFermeture());
        dto.setSports(club.getSports());

        // Mapper les images du club avec leurs IDs et ordre d'affichage
        if (club.getImages() != null) {
            dto.setImages(club.getImages().stream()
                    .sorted(Comparator.comparing(ClubImage::getDisplayOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                    .map(ClubMapper::toClubImageDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static ClubImageDto toClubImageDto(ClubImage clubImage) {
        if (clubImage == null)
            return null;

        return ClubImageDto.builder()
                .id(clubImage.getId())
                .imageUrl(clubImage.getImageUrl())
                .displayOrder(clubImage.getDisplayOrder())
                .build();
    }
}