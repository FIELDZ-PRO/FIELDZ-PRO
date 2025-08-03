package com.fieldz.mapper;

import com.fieldz.dto.TerrainDto;
import com.fieldz.model.Terrain;

public class TerrainMapper {
    public static TerrainDto toDto(Terrain terrain) {
        if (terrain == null) return null;
        TerrainDto dto = new TerrainDto();
        dto.setId(terrain.getId());
        dto.setNomTerrain(terrain.getNomTerrain());
        dto.setTypeSurface(terrain.getTypeSurface());
        dto.setVille(terrain.getVille());
        dto.setSport(terrain.getSport());
        //dto.setClubId(terrain.getClub() != null ? terrain.getClub().getId() : null);
        dto.setClub(ClubMapper.toDto(terrain.getClub()));
        dto.setPolitiqueClub(terrain.getPolitiqueClub());


        return dto;
    }
}
