package com.fieldz.mapper;

import com.fieldz.dto.UserDto;
import com.fieldz.model.Club;
import com.fieldz.model.Joueur;
import com.fieldz.model.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDto toDto(Utilisateur user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setRole(user.getTypeRole() != null ? user.getTypeRole().name() : null);
        dto.setDateInscription(user.getDateInscription());
        dto.setProfilComplet(user.isProfilComplet());

        if (user instanceof Joueur joueur) {
            dto.setPrenom(joueur.getPrenom());
            dto.setTelephone(joueur.getTelephone());
        }

        if (user instanceof Club club) {
            dto.setTelephone(club.getTelephone());
            dto.setAdresse(club.getAdresse());
        }

        return dto;
    }
}
