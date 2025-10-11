package com.fieldz.mapper;

import com.fieldz.dto.ClubAdminDto;
import com.fieldz.dto.JoueurAdminDto;
import com.fieldz.model.Club;
import com.fieldz.model.Joueur;
import com.fieldz.model.Utilisateur;

public class AdminMapper {
    
    public static ClubAdminDto toClubAdminDto(Club club, Utilisateur responsable) {
        if (club == null) return null;
        
        ClubAdminDto dto = new ClubAdminDto();
        dto.setId(club.getId());
        dto.setNomClub(club.getNomClub());
        dto.setNom(club.getNom());
        dto.setAdresse(club.getAdresse());
        
        // Extraire la ville de l'adresse (simple extraction, à améliorer)
        if (club.getAdresse() != null && club.getAdresse().contains(",")) {
            String[] parts = club.getAdresse().split(",");
            dto.setVille(parts[parts.length - 1].trim());
        }
        
        if (responsable != null) {
            dto.setEmailResponsable(responsable.getEmail());
            dto.setNomResponsable(responsable.getNom());
            dto.setLogin(responsable.getEmail()); // Email comme login
            dto.setPassword("********"); // Ne jamais exposer le vrai mot de passe
        }
        
        // TODO: Déterminer le sport depuis les terrains
        dto.setSport("À définir");
        
        return dto;
    }
    
    public static JoueurAdminDto toJoueurAdminDto(Joueur joueur) {
        if (joueur == null) return null;
        
        JoueurAdminDto dto = new JoueurAdminDto();
        dto.setId(joueur.getId());
        dto.setNom(joueur.getNom());
        dto.setPrenom(joueur.getPrenom());
        dto.setEmail(joueur.getEmail());
        dto.setTelephone(joueur.getTelephone());
        
        // Date d'inscription depuis createdAt ou autre champ
        // dto.setDateInscription(joueur.getCreatedAt()); // À adapter selon votre modèle
        
        // Statut actif (à définir selon votre logique)
        dto.setActif(true); // Par défaut, à adapter
        
        return dto;
    }
}