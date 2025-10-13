package com.fieldz.mapper;

import com.fieldz.dto.CreneauDto;
import com.fieldz.model.Creneau;

public class CreneauMapper {
    public static CreneauDto toDto(Creneau creneau) {
        if (creneau == null) return null;
        
        CreneauDto dto = new CreneauDto();
        dto.setId(creneau.getId());
        
        // Nouveau format (LocalDateTime)
        dto.setDateDebut(creneau.getDateDebut());
        dto.setDateFin(creneau.getDateFin());
        
        // Ancien format (LocalDate + LocalTime) - extrait du nouveau
        if (creneau.getDateDebut() != null) {
            dto.setDate(creneau.getDateDebut().toLocalDate());
            dto.setHeureDebut(creneau.getDateDebut().toLocalTime());
        }
        
        if (creneau.getDateFin() != null) {
            dto.setHeureFin(creneau.getDateFin().toLocalTime());
        }
        
        dto.setPrix(creneau.getPrix());
        
        // Statut avec vérification
        if (creneau.getStatut() != null) {
            dto.setStatut(creneau.getStatut().name());
        }
        
        dto.setDisponible(creneau.isDisponible());
        
        // Mapper le terrain de façon simplifiée
        if (creneau.getTerrain() != null) {
            CreneauDto.TerrainSimpleDto terrainDto = new CreneauDto.TerrainSimpleDto();
            terrainDto.setId(creneau.getTerrain().getId());
            terrainDto.setNom(creneau.getTerrain().getNomTerrain());
            
            // Sport avec vérification
            if (creneau.getTerrain().getSport() != null) {
                terrainDto.setSport(creneau.getTerrain().getSport());
            }
            
            dto.setTerrain(terrainDto);
        }

        return dto;
    }
}