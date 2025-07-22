package com.fieldz.mapper;

import com.fieldz.dto.UserDto;
import com.fieldz.model.Utilisateur;

public class UserMapper {
    public static UserDto toDto(Utilisateur user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setRole(user.getTypeRole() != null ? user.getTypeRole().name() : null);
        dto.setDateInscription(user.getDateInscription());
        return dto;
    }
}
