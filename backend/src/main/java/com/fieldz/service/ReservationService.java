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
import com.fieldz.exception.ReservationDejaAnnuleeException;
import com.fieldz.exception.ReservationIntrouvableException;
import com.fieldz.exception.AnnulationNonAutoriseeException;

import jakarta.persistence.EntityNotFoundException;
import java.time.format.DateTimeFormatter;
import java.time.Duration;

import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UtilisateurRepository utilisateurRepository;
    private final CreneauRepository creneauRepository;
    private final ReservationRepository reservationRepository;
    private final TerrainRepository terrainRepository;

    private final JoueurService joueurService;
    private final NotificationService notificationService;

    private static final Duration NO_SHOW_GRACE = Duration.ofMinutes(15);

    /**
     * Patch: transaction + emails déplacés APRÈS la persistance,
     * et protégés par try/catch pour ne JAMAIS casser la réservation.
     */
    @Transactional
    public Reservation reserver(Long creneauId, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }

        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));

        // Vérif disponibilité
        if (!creneau.getStatut().equals(Statut.LIBRE)) {
            throw new CreneauDejaReserveException("Créneau déjà réservé");
        }

        // Met à jour le créneau
        creneau.setStatut(Statut.RESERVE);
        creneau.setDisponible(false);
        creneauRepository.save(creneau);

        // Crée la réservation
        Reservation reservation = new Reservation();
        reservation.setCreneau(creneau);
        reservation.setJoueur(joueur);
        reservation.setDateReservation(LocalDateTime.now());
        reservation.setStatut(Statut.RESERVE);
        Reservation saved = reservationRepository.save(reservation);

        log.info("Nouvelle réservation créée pour le joueur : {} (id={})", joueur.getEmail(), saved.getId());

        // ---- Effets de bord NON bloquants : on ne casse jamais l’API si ça échoue ----
        try {
            notificationService.envoyerEmailConfirmationReservation(joueur.getEmail(), creneau);
        } catch (Exception ex) {
            log.warn("Email confirmation joueur non envoyé (res {}): {}", saved.getId(), ex.getMessage());
        }

        try {
            notificationService.envoyerEmailAuClubReservation(creneau.getTerrain().getClub(), joueur, creneau);
        } catch (Exception ex) {
            log.warn("Email notification club non envoyé (res {}): {}", saved.getId(), ex.getMessage());
        }
        // -------------------------------------------------------------------------------

        return saved;
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

    public String annulerReservation(Long reservationId, Authentication authentication, String motif) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationIntrouvableException("Réservation introuvable."));

        if (reservation.getStatut() == Statut.ANNULE_PAR_JOUEUR || reservation.getStatut() == Statut.ANNULE_PAR_CLUB) {
            throw new ReservationDejaAnnuleeException("Cette réservation est déjà annulée.");
        }

        Creneau creneau = reservation.getCreneau();
        boolean estClub = false;
        boolean autorise = false;

        if (utilisateur instanceof Joueur joueur) {
            autorise = reservation.getJoueur().getId().equals(joueur.getId());
        } else if (utilisateur instanceof Club club) {
            if (creneau == null || creneau.getTerrain() == null || creneau.getTerrain().getClub() == null) {
                throw new AnnulationNonAutoriseeException("Créneau/terrain introuvable pour cette réservation.");
            }
            autorise = creneau.getTerrain().getClub().getId().equals(club.getId());
            estClub = true;
        }

        if (!autorise) {
            throw new AnnulationNonAutoriseeException("Vous n’avez pas le droit d’annuler cette réservation.");
        }

        // -- Annulation
        reservation.setStatut(estClub ? Statut.ANNULE_PAR_CLUB : Statut.ANNULE_PAR_JOUEUR);
        reservation.setDateAnnulation(LocalDateTime.now());
        reservation.setMotifAnnulation(motif);

        // -- Libérer le créneau si encore lié
        if (creneau != null) {
            creneau.setStatut(Statut.LIBRE);
            creneau.setDisponible(true);
            creneauRepository.save(creneau);
        }

        reservationRepository.save(reservation);

        // -- Notifications (non bloquantes)
        if (estClub) {
            try {
                notificationService.notifierAnnulationReservationParClub(reservation,
                        motif != null && !motif.isBlank() ? motif : "Annulée par le club");
            } catch (Exception e) {
                log.warn("Notif annulation club non envoyée (res {}): {}", reservation.getId(), e.getMessage());
            }
        } else {
            if (reservation.getJoueur() != null && creneau != null) {
                try {
                    notificationService.envoyerEmailAuClubAnnulation(
                            creneau.getTerrain().getClub(), reservation.getJoueur(), creneau);
                } catch (Exception e) {
                    log.warn("Email annulation vers club non envoyé (res {}): {}", reservation.getId(), e.getMessage());
                }
            }
        }

        return "Réservation annulée et historisée avec succès.";
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

        List<Reservation> reservations = reservationRepository.findByTerrainsAndDateDebut(
                terrains, startOfDay, endOfDay
        );

        log.info("Club {} : {} terrains, {} réservations trouvées pour la date {}",
                club.getNom(), terrains.size(), reservations.size(), parsedDate);

        return reservations;
    }

    public List<Reservation> getReservationsAnnuleesPourJoueur(String email) {
        Joueur joueur = joueurService.getByEmail(email);
        List<Statut> statutsAnnules = List.of(Statut.ANNULE, Statut.ANNULE_PAR_JOUEUR, Statut.ANNULE_PAR_CLUB);
        return reservationRepository.findAnnuleesByJoueurId(statutsAnnules, joueur.getId());
    }

    public void confirmerPresence(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Réservation introuvable"));

        if (reservation.getStatut() != Statut.RESERVE) {
            throw new IllegalStateException("Seules les réservations au statut RESERVE peuvent être confirmées.");
        }

        reservation.setStatut(Statut.CONFIRMEE);
        reservationRepository.save(reservation);

        try {
            notificationService.envoyerEmailConfirmationPresence(
                    reservation.getJoueur().getEmail(),
                    reservation.getCreneau()
            );
        } catch (Exception e) {
            log.warn("Email confirmation présence non envoyé (res {}): {}", reservation.getId(), e.getMessage());
        }
    }

    public String marquerAbsent(Long reservationId, Authentication authentication, String motif) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("Seul un club peut marquer une absence.");
        }

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ReservationIntrouvableException("Réservation introuvable."));

        if (reservation.getCreneau() == null ||
                reservation.getCreneau().getTerrain() == null ||
                reservation.getCreneau().getTerrain().getClub() == null ||
                !reservation.getCreneau().getTerrain().getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Action non autorisée pour ce club.");
        }

        Statut s = reservation.getStatut();
        if (!(s == Statut.RESERVE || s == Statut.CONFIRMEE)) {
            throw new IllegalStateException("Transition vers ABSENT non autorisée depuis " + s);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = reservation.getCreneau().getDateDebut();
        if (now.isBefore(start.plus(NO_SHOW_GRACE))) {
            throw new IllegalStateException(
                    "Impossible de marquer absent avant " + NO_SHOW_GRACE.toMinutes() + " minutes après le début."
            );
        }

        reservation.setStatut(Statut.ABSENT);
        reservation.setDateAnnulation(now);
        reservation.setMotifAnnulation((motif != null && !motif.isBlank()) ? motif : "Absence constatée par le club");
        reservationRepository.save(reservation);

        try {
            notificationService.notifierAbsenceReservationParClub(reservation, reservation.getMotifAnnulation());
        } catch (Exception e) {
            log.warn("Notification absence non envoyée (res {}): {}", reservation.getId(), e.getMessage());
        }

        return "Réservation marquée comme ABSENT.";
    }
}
