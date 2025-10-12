package com.fieldz.mapper;

import com.fieldz.dto.JoueurDto;
import com.fieldz.model.Joueur;

public class JoueurMapper {

    public static JoueurDto toDto(Joueur joueur) {
        if (joueur == null) return null;

        JoueurDto dto = new JoueurDto();
        dto.setId(joueur.getId());
        dto.setNom(joueur.getNom());
        dto.setPrenom(joueur.getPrenom());
        dto.setTelephone(joueur.getTelephone());
        dto.setPhotoProfilUrl(joueur.getPhotoProfilUrl());
        return dto;
    }
}