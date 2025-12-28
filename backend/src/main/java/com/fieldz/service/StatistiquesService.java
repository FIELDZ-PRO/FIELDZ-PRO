package com.fieldz.service;

import com.fieldz.dto.StatistiquesDto;
import com.fieldz.model.Club;
import com.fieldz.model.Statut;
import com.fieldz.model.Terrain;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.ReservationRepository;
import com.fieldz.repository.TerrainRepository;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatistiquesService {

    private final ReservationRepository reservationRepository;
    private final TerrainRepository terrainRepository;
    private final UtilisateurRepository utilisateurRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Get daily statistics for the club (today)
     */
    @Transactional(readOnly = true)
    public StatistiquesDto getStatistiquesJournalieres(Authentication authentication) {
        Club club = getAuthenticatedClub(authentication);
        List<Terrain> terrains = terrainRepository.findByClub(club);

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();

        return calculateStatistiques(terrains, startOfDay, endOfDay, "daily",
                startOfDay.format(DATE_FORMATTER), endOfDay.format(DATE_FORMATTER));
    }

    /**
     * Get weekly statistics for the club (current week: Monday to Sunday)
     */
    @Transactional(readOnly = true)
    public StatistiquesDto getStatistiquesHebdomadaires(Authentication authentication) {
        Club club = getAuthenticatedClub(authentication);
        List<Terrain> terrains = terrainRepository.findByClub(club);

        LocalDate today = LocalDate.now();
        LocalDate monday = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate sunday = monday.plusDays(6);

        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.plusDays(1).atStartOfDay();

        return calculateStatistiques(terrains, startOfWeek, endOfWeek, "weekly",
                startOfWeek.format(DATE_FORMATTER), endOfWeek.format(DATE_FORMATTER));
    }

    /**
     * Get monthly statistics for the club (current month)
     */
    @Transactional(readOnly = true)
    public StatistiquesDto getStatistiquesMensuelles(Authentication authentication) {
        Club club = getAuthenticatedClub(authentication);
        List<Terrain> terrains = terrainRepository.findByClub(club);

        LocalDate today = LocalDate.now();
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDate lastDayOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
        LocalDateTime endOfMonth = lastDayOfMonth.plusDays(1).atStartOfDay();

        return calculateStatistiques(terrains, startOfMonth, endOfMonth, "monthly",
                startOfMonth.format(DATE_FORMATTER), endOfMonth.format(DATE_FORMATTER));
    }

    /**
     * Calculate statistics for a given period
     */
    private StatistiquesDto calculateStatistiques(List<Terrain> terrains,
                                                   LocalDateTime start,
                                                   LocalDateTime end,
                                                   String periode,
                                                   String dateDebut,
                                                   String dateFin) {
        if (terrains.isEmpty()) {
            log.warn("No terrains found for club, returning zero statistics");
            return new StatistiquesDto(0L, 0L, 0.0, periode, dateDebut, dateFin);
        }

        // Total number of reservations in the period
        long totalReservations = reservationRepository.countByTerrainsAndDateRange(terrains, start, end);

        // Number of reservations with RESERVE status
        long reservationsReserve = reservationRepository.countByTerrainsAndStatutAndDateRange(
                terrains, Statut.RESERVE, start, end);

        // Total revenue from CONFIRMEE reservations
        Double revenuConfirmee = reservationRepository.sumPrixByTerrainsAndStatutAndDateRange(
                terrains, Statut.CONFIRMEE, start, end);

        // Handle null case (no confirmed reservations)
        if (revenuConfirmee == null) {
            revenuConfirmee = 0.0;
        }

        log.info("Statistiques {} - Club terrains: {}, Total: {}, Reserve: {}, Revenu Confirmee: {}€",
                periode, terrains.size(), totalReservations, reservationsReserve, revenuConfirmee);

        return new StatistiquesDto(
                totalReservations,
                reservationsReserve,
                revenuConfirmee,
                periode,
                dateDebut,
                dateFin
        );
    }

    /**
     * Get authenticated club from authentication
     */
    private Club getAuthenticatedClub(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        return club;
    }
}
