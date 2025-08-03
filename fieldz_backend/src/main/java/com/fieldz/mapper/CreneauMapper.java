package com.fieldz.mapper;

import com.fieldz.dto.CreneauDto;
import com.fieldz.model.Creneau;

public class CreneauMapper {
    public static CreneauDto toDto(Creneau creneau) {
        if (creneau == null) return null;
        CreneauDto dto = new CreneauDto();
        dto.setId(creneau.getId());
        //dto.setDate(creneau.getDate());
        //dto.setHeureDebut(creneau.getHeureDebut());
        //dto.setHeureFin(creneau.getHeureFin());
        dto.setDateDebut(creneau.getDateDebut());
        dto.setDateFin(creneau.getDateFin());
        dto.setPrix(creneau.getPrix());
        dto.setStatut(creneau.getStatut().name());
        dto.setDisponible(creneau.isDisponible());
        //dto.setTerrainId(creneau.getTerrain() != null ? creneau.getTerrain().getId() : null);
        dto.setTerrain(TerrainMapper.toDto(creneau.getTerrain()));

        return dto;
    }
}
