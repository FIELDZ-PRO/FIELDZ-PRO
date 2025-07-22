package com.fieldz.service;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fieldz.mapper.ReservationMapper;

import com.fieldz.exception.CreneauDejaReserveException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UtilisateurRepository utilisateurRepository;
    private final CreneauRepository creneauRepository;
    private final ReservationRepository reservationRepository;
    private final TerrainRepository terrainRepository;

    public Reservation reserver(Long creneauId, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }
        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));
        if (!creneau.getStatut().equals(Statut.LIBRE)) {
            throw new CreneauDejaReserveException("Créneau déjà réservé");
        }

        creneau.setStatut(Statut.RESERVE);
        creneau.setDisponible(false);

        Reservation reservation = new Reservation();
        reservation.setCreneau(creneau);
        reservation.setJoueur(joueur);
        reservation.setDateReservation(LocalDateTime.now());
        reservation.setStatut(Statut.RESERVE);

        log.info("Nouvelle réservation créée pour le joueur : {}", joueur.getEmail());
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsDuClub(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }
        List<Terrain> terrains = terrainRepository.findByClub(club);
        List<Reservation> reservations = reservationRepository.findByCreneau_TerrainIn(terrains);
        log.info("Club {} : {} terrains, {} réservations", club.getNom(), terrains.size(), reservations.size());
        return reservations;
    }

    public List<Reservation> mesReservations(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }
        List<Reservation> reservations = reservationRepository.findByJoueur(joueur);
        log.info("Joueur {} a {} réservations", joueur.getEmail(), reservations.size());
        return reservations;
    }



    public String annulerReservation(Long reservationId, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        Creneau creneau = reservation.getCreneau();
        boolean autorise = false;

        if (utilisateur instanceof Joueur joueur) {
            autorise = reservation.getJoueur().getId().equals(joueur.getId());
        } else if (utilisateur instanceof Club club) {
            autorise = creneau.getTerrain().getClub().getId().equals(club.getId());
        }
        if (!autorise) {
            throw new RuntimeException("Vous n’avez pas le droit d’annuler cette réservation.");
        }
        creneau.setStatut(Statut.LIBRE);
        creneau.setDisponible(true);
        creneau.setReservation(null);

        reservationRepository.delete(reservation);

        log.info("Réservation {} annulée par {}", reservationId, email);
        return "Réservation annulée avec succès.";
    }

    public String annulerReservationParClub(Long id, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        List<Terrain> terrainsDuClub = terrainRepository.findByClub(club);
        if (!terrainsDuClub.contains(reservation.getCreneau().getTerrain())) {
            throw new RuntimeException("Cette réservation ne concerne pas un terrain de votre club.");
        }
        reservation.setStatut(Statut.ANNULE);
        reservation.getCreneau().setStatut(Statut.LIBRE);
        reservation.getCreneau().setDisponible(true);

        reservationRepository.save(reservation);

        log.info("Réservation {} annulée par club {}", id, club.getNom());
        return "Réservation annulée avec succès";
    }

    public List<Reservation> getReservationsParDate(LocalDate parsedDate, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }
        List<Terrain> terrains = terrainRepository.findByClub(club);
        LocalDateTime startOfDay = parsedDate.atStartOfDay();
        LocalDateTime endOfDay = parsedDate.plusDays(1).atStartOfDay().minusNanos(1);
        List<Reservation> reservations = reservationRepository.findReservationsByTerrainsAndDateRange(terrains, startOfDay, endOfDay);
        log.info("Club {} : {} terrains, {} réservations trouvées pour la date {}", club.getNom(), terrains.size(), reservations.size(), parsedDate);
        return reservations;
    }
}
