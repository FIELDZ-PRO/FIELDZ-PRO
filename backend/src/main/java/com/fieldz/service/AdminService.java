package com.fieldz.service;

import com.fieldz.dto.*;

import java.util.List;

public interface AdminService {

    // Dashboard
    AdminStatsDto getStats();

    // Gestion des clubs
    List<ClubAdminDto> getAllClubs();
    List<ClubAdminDto> searchClubs(String query);
    ClubAdminDto getClubDetails(Long clubId);
    ClubAdminDto createClub(CreateClubRequest request);

    // Gestion des joueurs
    List<JoueurAdminDto> getAllJoueurs();
    List<JoueurAdminDto> searchJoueurs(String query);
    JoueurAdminDto getJoueurDetails(Long joueurId);
    JoueurAdminDto toggleJoueurStatus(Long joueurId);
}
