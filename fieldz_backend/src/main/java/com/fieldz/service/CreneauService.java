package com.fieldz.service;

import com.fieldz.model.*;
import com.fieldz.dto.CreneauRecurrentDto;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.fieldz.service.NotificationService;
import java.time.DayOfWeek;
import java.util.ArrayList;


import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import com.fieldz.mapper.CreneauMapper;

import java.util.List;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.HashMap;


@Slf4j
@Service
@RequiredArgsConstructor
public class CreneauService {

    private final CreneauRepository creneauRepository;
    private final TerrainRepository terrainRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;



    public Creneau ajouterCreneau(Long terrainId, Creneau creneau, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        if (!terrain.getClub().getId().equals(club.getId())) {
            log.warn("Club {} tente d’ajouter un créneau sur un terrain qui ne lui appartient pas : terrainId={}", club.getNom(), terrainId);
            throw new RuntimeException("Ce terrain ne vous appartient pas.");
        }

        if (creneau.getDateDebut() == null || creneau.getDateFin() == null) {
            throw new RuntimeException("Les dates de début et de fin sont obligatoires.");
        }

        if (creneau.getDateDebut().isAfter(creneau.getDateFin())) {
            throw new RuntimeException("L'heure de fin doit être après l'heure de début.");
        }

        List<Creneau> chevauchants = creneauRepository.findCreneauxChevauchants(
                terrainId,
                creneau.getDateDebut(),
                creneau.getDateFin()
        );

        if (!chevauchants.isEmpty()) {
            throw new RuntimeException("Un créneau existant chevauche les horaires proposés.");
        }

        creneau.setTerrain(terrain);
        creneau.setStatut(Statut.LIBRE);
        creneau.setDisponible(true);

        Creneau saved = creneauRepository.save(creneau);
        log.info("Club {} a ajouté un créneau au terrain {} (id={})", club.getNom(), terrain.getNomTerrain(), terrainId);
        return saved;
    }


    public List<Creneau> getCreneauxDuTerrain(Long terrainId, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));
        if (!terrain.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Ce terrain ne vous appartient pas.");
        }

        log.info("Club {} a consulté les créneaux du terrain id={}", club.getNom(), terrainId);
        return terrain.getCreneaux();
    }

    public List<Creneau> getCreneauxDisponibles() {
        List<Creneau> dispo = creneauRepository.findByStatut(Statut.LIBRE);
        log.info("Nombre de créneaux disponibles renvoyés à un joueur : {}", dispo.size());
        return dispo;
    }

    public void annulerCreneau(Long creneauId, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau introuvable"));

        if (!creneau.getTerrain().getClub().getId().equals(club.getId())) {
            log.warn("Club {} tente d’annuler un créneau qui ne lui appartient pas : creneauId={}", club.getNom(), creneauId);
            throw new RuntimeException("Ce créneau ne vous appartient pas.");
        }

        if (creneau.getStatut() == Statut.ANNULE) {
            log.info("Club {} a tenté d’annuler un créneau déjà annulé : creneauId={}", club.getNom(), creneauId);
            throw new RuntimeException("Ce créneau est déjà annulé.");
        }

        creneau.setStatut(Statut.ANNULE);
        creneau.setDisponible(false);
        creneauRepository.save(creneau);

        log.info("Club {} a annulé le créneau id={} sur le terrain {}", club.getNom(), creneauId, creneau.getTerrain().getNomTerrain());

        // ✅ Marquer les réservations comme ANNULE_PAR_CLUB
        List<Reservation> reservations = reservationRepository.findByCreneauId(creneauId);
        for (Reservation reservation : reservations) {
            reservation.setStatut(Statut.ANNULE_PAR_CLUB);
            reservationRepository.save(reservation);

            // 📨 Notification possible ici
            notificationService.envoyerEmailAnnulationCreneau(
                    reservation.getJoueur().getEmail(), creneau
            );
        }
    }


    public Map<String, Object> creerCreneauxRecurrents(CreneauRecurrentDto dto) {
        DayOfWeek jourTarget = DayOfWeek.valueOf(dto.getJourDeSemaine().toUpperCase());
        LocalDate current = dto.getDateDebut();
        LocalDate end = dto.getDateFin();

        Terrain terrain = terrainRepository.findById(dto.getTerrainId())
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        List<Creneau> creneaux = new ArrayList<>();
        int totalDemandes = 0;

        while (!current.isAfter(end)) {
            if (current.getDayOfWeek() == jourTarget) {
                totalDemandes++;

                LocalDateTime dateDebut = LocalDateTime.of(current, dto.getHeureDebut());
                LocalDateTime dateFin = dateDebut.plusMinutes(dto.getDureeMinutes());

                boolean existe = creneauRepository
                        .findByTerrainAndDateDebutAndDateFin(terrain, dateDebut, dateFin)
                        .isPresent();

                if (!existe) {
                    Creneau c = new Creneau();
                    c.setDateDebut(dateDebut);
                    c.setDateFin(dateFin);
                    c.setPrix(dto.getPrix());
                    c.setTerrain(terrain);
                    c.setStatut(Statut.LIBRE);
                    c.setDisponible(true);
                    creneaux.add(c);
                }
            }
            current = current.plusDays(1);
        }

        List<Creneau> saved = creneauRepository.saveAll(creneaux);  // ✅ Maintenant on a la variable saved

        Map<String, Object> response = new HashMap<>();
        if (saved.isEmpty()) {
            response.put("message", "Aucun créneau créé. Ils existent déjà tous.");
        } else if (saved.size() < totalDemandes) {
            response.put("message", "Certains créneaux existaient déjà et n’ont pas été recréés.");
        } else {
            response.put("message", "Créneaux récurrents générés avec succès !");
        }

        response.put("totalDemandes", totalDemandes);
        response.put("totalCrees", saved.size());
        response.put("dejaExistants", totalDemandes - saved.size());
        response.put("creneaux", saved.stream()
                .map(CreneauMapper::toDto)
                .toList());

        return response;
    }




}