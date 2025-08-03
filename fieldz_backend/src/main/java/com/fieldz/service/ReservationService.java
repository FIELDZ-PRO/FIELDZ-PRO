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

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import java.time.format.DateTimeFormatter;




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



    public Reservation reserver(Long creneauId, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur.");
        }

        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau non trouvé"));

        // ✅ Ce bloc suffit pour vérifier la disponibilité
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
        notificationService.envoyerEmailConfirmationReservation(joueur.getEmail(), creneau);

        notificationService.envoyerEmailAuClubReservation(creneau.getTerrain().getClub(), joueur, creneau);

        log.info("Nouvelle réservation créée pour le joueur : {}", joueur.getEmail());

        // ✅ Sauvegarde du créneau mis à jour
        creneauRepository.save(creneau);

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

        boolean autorise = false;
        boolean estClub = false;

        if (utilisateur instanceof Joueur joueur) {
            autorise = reservation.getJoueur().getId().equals(joueur.getId());
        } else if (utilisateur instanceof Club club) {
            autorise = creneau.getTerrain().getClub().getId().equals(club.getId());
            estClub = true;
        }

        if (!autorise) {
            throw new AnnulationNonAutoriseeException("Vous n’avez pas le droit d’annuler cette réservation.");
        }

        reservation.setStatut(estClub ? Statut.ANNULE_PAR_CLUB : Statut.ANNULE_PAR_JOUEUR);
        reservation.setDateAnnulation(LocalDateTime.now());
        reservation.setMotifAnnulation(motif);

        creneau.setStatut(Statut.LIBRE);
        creneau.setDisponible(true);
        //creneau.setReservation(null); // SUPPRIMER PLUS TARD
        creneauRepository.save(creneau);

        reservationRepository.save(reservation);
        if (!estClub && reservation.getJoueur() != null) {
            notificationService.envoyerEmailAuClubAnnulation(creneau.getTerrain().getClub(), reservation.getJoueur(), creneau);
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
        // 🔍 On récupère le joueur à partir de l'email
        Joueur joueur = joueurService.getByEmail(email);

        // 🏷️ On définit les statuts considérés comme "annulés"
        List<Statut> statutsAnnules = List.of(
                Statut.ANNULE,
                Statut.ANNULE_PAR_JOUEUR,
                Statut.ANNULE_PAR_CLUB
        );

        // 📄 On récupère les réservations annulées pour ce joueur
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

        // (Optionnel) Envoyer un email
        Utilisateur joueur = reservation.getJoueur();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm");
        String dateFormatee = reservation.getCreneau().getDateDebut().format(formatter);

        notificationService.envoyerEmailConfirmationPresence(
                joueur.getEmail(),
                reservation.getCreneau()
        );

    }



}
