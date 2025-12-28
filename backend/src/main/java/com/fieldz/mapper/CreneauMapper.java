package com.fieldz.mapper;

import com.fieldz.dto.CreneauDto;
import com.fieldz.dto.TerrainDto;
import com.fieldz.dto.ClubDto;
import com.fieldz.model.Creneau;

public class CreneauMapper {

    public static CreneauDto toDto(Creneau c) {
        if (c == null) return null;

        CreneauDto dto = new CreneauDto();
        dto.setId(c.getId());
        dto.setDateDebut(c.getDateDebut());
        dto.setDateFin(c.getDateFin());
        dto.setPrix(c.getPrix());
        // TODO: TEMPORARY - Remove this mapping later (secondPrix feature is temporary)
        dto.setSecondPrix(c.getSecondPrix());
        dto.setStatut(c.getStatut() != null ? c.getStatut().name() : null);
        dto.setDisponible(c.isDisponible());

        if (c.getTerrain() != null) {
            TerrainDto t = new TerrainDto();
            t.setId(c.getTerrain().getId());
            t.setNomTerrain(c.getTerrain().getNomTerrain());
            t.setTypeSurface(c.getTerrain().getTypeSurface());
            t.setVille(c.getTerrain().getVille());
            t.setSport(c.getTerrain().getSport());
            t.setPhoto(c.getTerrain().getPhoto());
            t.setPolitiqueClub(c.getTerrain().getPolitiqueClub());

            // ✅ Ajout du club (id, nom, email, ville...)
            if (c.getTerrain().getClub() != null) {
                ClubDto clubDto = new ClubDto();
                clubDto.setId(c.getTerrain().getClub().getId());
                clubDto.setNom(c.getTerrain().getClub().getNom());
                clubDto.setVille(c.getTerrain().getClub().getVille());
                t.setClub(clubDto);
            }

            dto.setTerrain(t);
        }

        return dto;
    }
}
