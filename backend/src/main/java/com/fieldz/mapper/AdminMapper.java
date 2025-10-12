package com.fieldz.mapper;

import com.fieldz.dto.ClubAdminDto;
import com.fieldz.dto.JoueurAdminDto;
import com.fieldz.model.Club;
import com.fieldz.model.Joueur;
import com.fieldz.model.Utilisateur;
import com.fieldz.model.Sport;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public final class AdminMapper {
    private AdminMapper() {}

    public static ClubAdminDto toClubAdminDto(Club club, Utilisateur responsable) {
        if (club == null) return null;

        ClubAdminDto dto = new ClubAdminDto();
        dto.setId(club.getId());
        dto.setNom(club.getNom());
        dto.setAdresse(club.getAdresse());
        dto.setTelephone(club.getTelephone());

        // Responsable (si dispo côté Utilisateur)
        dto.setEmailResponsable(responsable != null ? responsable.getEmail() : null);
        dto.setNomResponsable(responsable != null ? responsable.getNom() : null);
        dto.setLogin(responsable != null ? responsable.getEmail() : null);

        // 🔁 Set<Sport> -> "PADEL, FOOT5" (ou null)
        dto.setSport(formatSports(club.getSports()));
        dto.setVille(club.getVille());

        dto.setPassword(null); // jamais exposé hors création
        return dto;
    }

    public static JoueurAdminDto toJoueurAdminDto(Joueur j) {
        if (j == null) return null;

        boolean actif = true;
        LocalDateTime until = j.getAccountBlockedUntil();
        if (until != null && until.isAfter(LocalDateTime.now())) {
            actif = false;
        }
        return new JoueurAdminDto(
                j.getId(),
                j.getNom(),
                j.getPrenom(),
                j.getEmail(),
                j.getTelephone(),
                j.getDateInscription(),
                actif
        );
    }

    private static String formatSports(Set<Sport> sports) {
        if (sports == null || sports.isEmpty()) return null;
        return sports.stream()
                .map(Enum::name)              // ou une méthode .getLabel() si tu en as une
                .collect(Collectors.joining(", "));
    }
}
