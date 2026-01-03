package com.fieldz.service;

import com.fieldz.dto.CreneauDto;
import com.fieldz.dto.CreneauRecurrentDto;
import com.fieldz.dto.UpdateCreneauRequest;
import com.fieldz.exception.CreneauHasActiveReservationsException;
import com.fieldz.mapper.CreneauMapper;
import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

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
            log.warn("Club {} tente d'ajouter un créneau sur un terrain qui ne lui appartient pas : terrainId={}",
                    club.getNom(), terrainId);
            throw new RuntimeException("Ce terrain ne vous appartient pas.");
        }

        if (creneau.getDateDebut() == null || creneau.getDateFin() == null) {
            throw new RuntimeException("Les dates de début et de fin sont obligatoires.");
        }
        if (creneau.getDateDebut().isAfter(creneau.getDateFin())) {
            throw new RuntimeException("L'heure de fin doit être après l'heure de début.");
        }

        // Récupérer les heures d'ouverture/fermeture du club
        LocalTime heureOuverture = club.getHeureOuverture();
        LocalTime heureFermeture = club.getHeureFermeture();

        // Nombre de duplications (défaut = 1 si non précisé ou <= 1)
        int nombreDuplications = (creneau.getNombreDuplications() != null && creneau.getNombreDuplications() > 1)
                                  ? creneau.getNombreDuplications()
                                  : 1;

        List<Creneau> creneauxCrees = new ArrayList<>();
        long dureeMinutes = java.time.Duration.between(creneau.getDateDebut(), creneau.getDateFin()).toMinutes();

        // Créer les créneaux consécutifs
        for (int i = 0; i < nombreDuplications; i++) {
            LocalDateTime dateDebut = creneau.getDateDebut().plusMinutes(i * dureeMinutes);
            LocalDateTime dateFin = creneau.getDateFin().plusMinutes(i * dureeMinutes);

            // Validation des heures d'ouverture/fermeture
            if (heureOuverture != null && heureFermeture != null) {
                LocalTime creneauDebut = dateDebut.toLocalTime();
                LocalTime creneauFin = dateFin.toLocalTime();

                if (creneauDebut.isBefore(heureOuverture) || creneauFin.isAfter(heureFermeture)) {
                    log.warn("Créneau {} refusé: hors horaires d'ouverture ({} - {})",
                            i + 1, heureOuverture, heureFermeture);
                    throw new RuntimeException(String.format(
                        "Le créneau %d est hors des horaires d'ouverture (%s - %s)",
                        i + 1, heureOuverture, heureFermeture));
                }
            }

            // Vérifier les chevauchements
            List<Creneau> chevauchants = creneauRepository.findCreneauxChevauchants(
                    terrainId, dateDebut, dateFin);
            if (!chevauchants.isEmpty()) {
                throw new RuntimeException(String.format(
                    "Le créneau %d chevauche un créneau existant.", i + 1));
            }

            Creneau nouveauCreneau = new Creneau();
            nouveauCreneau.setDateDebut(dateDebut);
            nouveauCreneau.setDateFin(dateFin);
            nouveauCreneau.setPrix(creneau.getPrix());
            // TODO: TEMPORARY - Remove this setter later (secondPrix feature is temporary)
            nouveauCreneau.setSecondPrix(creneau.getSecondPrix());
            nouveauCreneau.setTerrain(terrain);
            nouveauCreneau.setStatut(Statut.LIBRE);
            nouveauCreneau.setDisponible(true);

            creneauxCrees.add(nouveauCreneau);
        }

        // Sauvegarder tous les créneaux
        List<Creneau> saved = creneauRepository.saveAll(creneauxCrees);

        log.info("Club {} a ajouté {} créneau(x) au terrain {} (id={})",
                club.getNom(), saved.size(), terrain.getNomTerrain(), terrainId);

        // Retourner le premier créneau créé (pour compatibilité avec l'ancienne signature)
        return saved.get(0);
    }

    @Transactional(readOnly = true)
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

        // ✅ Fetch terrain + club pour le mapper
        return creneauRepository.findByTerrainIdFetchTerrainAndClub(terrainId);
    }

    /**
     * Get paginated creneaux for a terrain
     * Default sort: dateDebut descending (most recent first)
     */
    @Transactional(readOnly = true)
    public Page<CreneauDto> getCreneauxDuTerrainPaginated(Long terrainId, int page, int size, Authentication authentication) {
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

        // Create pageable with default sort by dateDebut descending
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateDebut"));

        // Get paginated creneaux
        Page<Creneau> creneauxPage = creneauRepository.findByTerrainIdPaginated(terrainId, pageable);

        // Map to DTO
        return creneauxPage.map(CreneauMapper::toDto);
    }

    /**
     * Get all paginated creneaux for a club (across all terrains)
     * Default sort: dateDebut descending (most recent first)
     */
    @Transactional(readOnly = true)
    public Page<CreneauDto> getAllCreneauxDuClubPaginated(int page, int size, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        // Create pageable with default sort by dateDebut descending
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateDebut"));

        // Get all creneaux for this club
        Page<Creneau> creneauxPage = creneauRepository.findByClubIdPaginated(club.getId(), pageable);

        log.info("Club {} retrieved {} creneaux (page {}/{}, size {})",
                club.getNom(), creneauxPage.getNumberOfElements(), page + 1, creneauxPage.getTotalPages(), size);

        // Map to DTO
        return creneauxPage.map(CreneauMapper::toDto);
    }

    public List<Creneau> getCreneauxDisponibles() {
        // ancien: findByStatut(Statut.LIBRE) -> on tient compte aussi de
        // disponible=true
        LocalDateTime maintenant = LocalDateTime.now();
        List<Creneau> dispo = creneauRepository.findByStatutAndDisponibleTrue(Statut.LIBRE);

        // Filtrer pour ne garder que les créneaux futurs
        List<Creneau> creneauxFuturs = dispo.stream()
                .filter(c -> c.getDateDebut() != null && c.getDateDebut().isAfter(maintenant))
                .toList();

        log.info("Nombre de créneaux disponibles renvoyés à un joueur : {} (futurs: {})",
                dispo.size(), creneauxFuturs.size());
        return creneauxFuturs;
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

        if (!Objects.equals(creneau.getTerrain().getClub().getId(), club.getId())) {
            log.warn("Club {} tente d’annuler un créneau qui ne lui appartient pas : creneauId={}", club.getNom(),
                    creneauId);
            throw new RuntimeException("Ce créneau ne vous appartient pas.");
        }

        if (creneau.getStatut() == Statut.ANNULE) {
            log.info("Club {} tente d’annuler un créneau déjà annulé : creneauId={}", club.getNom(), creneauId);
            throw new RuntimeException("Ce créneau est déjà annulé.");
        }

        creneau.setStatut(Statut.ANNULE);
        creneau.setDisponible(false);
        creneauRepository.save(creneau);

        // Marquer les réservations actives comme ANNULE_PAR_CLUB + notifier
        List<Reservation> reservations = reservationRepository.findByCreneauId(creneauId);
        for (Reservation reservation : reservations) {
            reservation.setStatut(Statut.ANNULE_PAR_CLUB);
            reservation.setDateAnnulation(LocalDateTime.now());
            reservation.setMotifAnnulation("Créneau annulé par le club");
            reservationRepository.save(reservation);

            try {
                if (reservation.getJoueur() != null) {
                    notificationService.envoyerEmailAnnulationCreneau(
                            reservation.getJoueur().getEmail(), creneau);
                }
            } catch (Exception ex) {
                log.warn("Erreur envoi email annulation (resa {}): {}", reservation.getId(), ex.getMessage());
            }
        }
        log.info("Club {} a annulé le créneau id={} sur {}", club.getNom(), creneauId,
                creneau.getTerrain().getNomTerrain());
    }

    public Map<String, Object> creerCreneauxRecurrents(CreneauRecurrentDto dto) {
        DayOfWeek jourTarget = DayOfWeek.valueOf(dto.getJourDeSemaine().toUpperCase());
        LocalDate current = dto.getDateDebut();
        LocalDate end = dto.getDateFin();

        Terrain terrain = terrainRepository.findById(dto.getTerrainId())
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        // Récupérer les heures d'ouverture/fermeture du club
        Club club = terrain.getClub();
        LocalTime heureOuverture = club.getHeureOuverture();
        LocalTime heureFermeture = club.getHeureFermeture();

        List<Creneau> aCreer = new ArrayList<>();
        int totalDemandes = 0;
        int totalRefuses = 0; // Hors horaires d'ouverture
        int totalConflits = 0; // Conflits avec créneaux existants
        boolean autoReserver = Boolean.TRUE.equals(dto.getAutoReserver());
        String nomReservant = dto.getNomReservant();

        // Nombre de duplications par jour (défaut = 1 si non précisé ou <= 1)
        int nombreDuplications = (dto.getNombreDuplications() != null && dto.getNombreDuplications() > 1)
                                  ? dto.getNombreDuplications()
                                  : 1;

        while (!current.isAfter(end)) {
            if (current.getDayOfWeek() == jourTarget) {
                // Pour chaque jour correspondant, créer le nombre de duplications demandé
                for (int i = 0; i < nombreDuplications; i++) {
                    totalDemandes++;

                    LocalDateTime dateDebut = LocalDateTime.of(current, dto.getHeureDebut()).plusMinutes(i * dto.getDureeMinutes());
                    LocalDateTime dateFin = dateDebut.plusMinutes(dto.getDureeMinutes());

                    // Validation des heures d'ouverture/fermeture
                    if (heureOuverture != null && heureFermeture != null) {
                        LocalTime creneauDebut = dateDebut.toLocalTime();
                        LocalTime creneauFin = dateFin.toLocalTime();

                        if (creneauDebut.isBefore(heureOuverture) || creneauFin.isAfter(heureFermeture)) {
                            log.warn("Créneau refusé: {}:{} - {}:{} (hors horaires d'ouverture {} - {})",
                                    creneauDebut.getHour(), creneauDebut.getMinute(),
                                    creneauFin.getHour(), creneauFin.getMinute(),
                                    heureOuverture, heureFermeture);
                            totalRefuses++;
                            continue; // Passer au prochain créneau
                        }
                    }

                    // Vérifier les chevauchements avec des créneaux existants
                    List<Creneau> chevauchants = creneauRepository.findCreneauxChevauchants(
                            terrain.getId(), dateDebut, dateFin);

                    if (!chevauchants.isEmpty()) {
                        // Créneau en conflit, on le saute et on continue avec les autres
                        log.debug("Créneau ignoré (conflit): {} - {}", dateDebut, dateFin);
                        totalConflits++;
                        continue; // Passer au prochain créneau
                    }

                    // Pas de conflit, on peut créer ce créneau
                    Creneau c = new Creneau();
                    c.setDateDebut(dateDebut);
                    c.setDateFin(dateFin);
                    c.setPrix(dto.getPrix());
                    // TODO: TEMPORARY - Remove this setter later (secondPrix feature is temporary)
                    c.setSecondPrix(dto.getSecondPrix());
                    c.setTerrain(terrain);

                    // Si auto-réservation demandée, marquer comme RESERVE
                    if (autoReserver && nomReservant != null && !nomReservant.trim().isEmpty()) {
                        c.setStatut(Statut.RESERVE);
                        c.setDisponible(false);
                    } else {
                        c.setStatut(Statut.LIBRE);
                        c.setDisponible(true);
                    }

                    aCreer.add(c);
                }
            }
            current = current.plusDays(1);
        }

        List<Creneau> saved = aCreer.isEmpty() ? List.of() : creneauRepository.saveAll(aCreer);

        // Créer les réservations automatiques si demandé
        int reservationsCrees = 0;
        if (autoReserver && nomReservant != null && !nomReservant.trim().isEmpty()) {
            for (Creneau creneau : saved) {
                try {
                    Reservation reservation = new Reservation();
                    reservation.setCreneau(creneau);
                    reservation.setStatut(Statut.RESERVE);
                    reservation.setDateReservation(LocalDateTime.now());
                    reservation.setNomReservant(nomReservant.trim());
                    // Note: joueur reste null car c'est une réservation manuelle par le club
                    reservationRepository.save(reservation);
                    reservationsCrees++;
                } catch (Exception e) {
                    log.warn("Erreur lors de la création de la réservation pour le créneau {}: {}",
                            creneau.getId(), e.getMessage());
                }
            }
        }

        // Construction du message informatif
        StringBuilder messageBuilder = new StringBuilder();
        if (saved.isEmpty()) {
            messageBuilder.append("Aucun créneau créé.");
            if (totalRefuses > 0 || totalConflits > 0) {
                messageBuilder.append(" Raisons:");
                if (totalRefuses > 0) {
                    messageBuilder.append(String.format(" %d hors horaires,", totalRefuses));
                }
                if (totalConflits > 0) {
                    messageBuilder.append(String.format(" %d en conflit.", totalConflits));
                }
            } else {
                messageBuilder.append(" Tous existent déjà.");
            }
        } else {
            if (autoReserver && reservationsCrees > 0) {
                messageBuilder.append(String.format(
                    "Créneaux récurrents générés avec succès ! %d créneaux créés et automatiquement réservés pour %s.",
                    saved.size(), nomReservant));
            } else {
                messageBuilder.append(String.format(
                    "Créneaux récurrents générés avec succès ! %d créneaux créés.",
                    saved.size()));
            }

            if (totalRefuses > 0 || totalConflits > 0) {
                messageBuilder.append(" Note:");
                if (totalRefuses > 0) {
                    messageBuilder.append(String.format(" %d hors horaires,", totalRefuses));
                }
                if (totalConflits > 0) {
                    messageBuilder.append(String.format(" %d en conflit.", totalConflits));
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", messageBuilder.toString());
        response.put("totalDemandes", totalDemandes);
        response.put("totalCrees", saved.size());
        response.put("totalRefuses", totalRefuses);
        response.put("totalConflits", totalConflits);
        response.put("totalIgnores", totalRefuses + totalConflits);
        response.put("reservationsCrees", reservationsCrees);
        response.put("nomReservant", nomReservant);
        response.put("creneaux", saved.stream().map(CreneauMapper::toDto).toList());

        return response;
    }

    /**
     * Supprime un créneau. Si des réservations actives existent:
     * - force=false -> lève 409 avec le nombre de réservations actives.
     * - force=true -> annule d'abord ces réservations (ANNULE_PAR_CLUB) puis
     * supprime le créneau.
     * 
     * @return le nombre de réservations annulées avant suppression
     */
    @Transactional
    public int supprimerCreneau(Long creneauId, Authentication authentication, boolean force) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        Creneau creneau = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau introuvable"));

        if (!creneau.getTerrain().getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Ce créneau ne vous appartient pas.");
        }

        var statutsActifs = Arrays.asList(Statut.RESERVE, Statut.CONFIRMEE);

        long activeCount = reservationRepository.countByCreneauIdAndStatutIn(creneauId, statutsActifs);
        if (activeCount > 0 && !force) {
            throw new CreneauHasActiveReservationsException(creneauId, activeCount);
        }

        int annulees = 0;
        if (activeCount > 0) {
            var actives = reservationRepository.findByCreneauIdAndStatutIn(creneauId, statutsActifs);
            for (Reservation r : actives) {
                r.setStatut(Statut.ANNULE_PAR_CLUB);
                r.setDateAnnulation(LocalDateTime.now());
                r.setMotifAnnulation("Créneau supprimé par le club");
            }
            reservationRepository.saveAll(actives);
            annulees = actives.size();

            for (Reservation r : actives) {
                try {
                    if (r.getJoueur() != null) {
                        notificationService.envoyerEmailAnnulationCreneau(r.getJoueur().getEmail(), creneau);
                    }
                } catch (Exception ex) {
                    log.warn("Notification suppression: resa {}: {}", r.getId(), ex.getMessage());
                }
            }
        }

        // Déréférencer toutes les réservations (historique inclus) avant suppression
        var toutes = reservationRepository.findByCreneauId(creneauId);
        if (!toutes.isEmpty()) {
            for (Reservation r : toutes) {
                r.setCreneau(null);
            }
            reservationRepository.saveAll(toutes);
        }

        creneauRepository.delete(creneau);
        log.info("Créneau {} supprimé par le club {} (réservations annulées: {}).", creneauId, club.getNom(), annulees);
        return annulees;
    }

    @Transactional
    public Creneau updateCreneau(Long creneauId, UpdateCreneauRequest req, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        Creneau c = creneauRepository.findById(creneauId)
                .orElseThrow(() -> new RuntimeException("Créneau introuvable"));

        if (!c.getTerrain().getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Ce créneau ne vous appartient pas.");
        }

        // Déplacement éventuel de terrain
        if (req.getTerrainId() != null && !req.getTerrainId().equals(c.getTerrain().getId())) {
            Terrain nouveauTerrain = terrainRepository.findById(req.getTerrainId())
                    .orElseThrow(() -> new RuntimeException("Terrain cible introuvable"));
            if (!nouveauTerrain.getClub().getId().equals(club.getId())) {
                throw new RuntimeException("Le terrain cible n'appartient pas à votre club.");
            }
            c.setTerrain(nouveauTerrain);
        }

        LocalDateTime oldDebut = c.getDateDebut();
        LocalDateTime oldFin = c.getDateFin();
        Double oldPrix = c.getPrix();

        if (req.getDateDebut() != null)
            c.setDateDebut(req.getDateDebut());
        if (req.getDateFin() != null)
            c.setDateFin(req.getDateFin());
        if (req.getPrix() != null)
            c.setPrix(req.getPrix());
        // TODO: TEMPORARY - Remove this setter later (secondPrix feature is temporary)
        if (req.getSecondPrix() != null)
            c.setSecondPrix(req.getSecondPrix());

        if (c.getDateDebut() == null || c.getDateFin() == null) {
            throw new RuntimeException("Les dates de début et de fin sont obligatoires.");
        }
        if (c.getDateDebut().isAfter(c.getDateFin())) {
            throw new RuntimeException("L'heure de fin doit être après l'heure de début.");
        }

        // Chevauchements (en excluant le créneau courant)
        List<Creneau> chevauchants = creneauRepository.findCreneauxChevauchants(
                c.getTerrain().getId(), c.getDateDebut(), c.getDateFin()).stream()
                .filter(x -> !x.getId().equals(c.getId())).toList();
        if (!chevauchants.isEmpty()) {
            throw new RuntimeException("Un créneau existant chevauche les horaires proposés.");
        }

        Creneau saved = creneauRepository.save(c);
        log.info("Club {} modifie créneau id={} (terrain={}, {}->{}, prix {}->{}).",
                club.getNom(), saved.getId(), saved.getTerrain().getNomTerrain(),
                oldDebut, saved.getDateDebut(), oldPrix, saved.getPrix());

        // Notification simple si modification temps/prix
        boolean changedTime = (oldDebut != null && !oldDebut.equals(saved.getDateDebut()))
                || (oldFin != null && !oldFin.equals(saved.getDateFin()));
        boolean changedPrix = (oldPrix != null && !oldPrix.equals(saved.getPrix()));

        if (changedTime || changedPrix) {
            var actives = reservationRepository.findByCreneauIdAndStatutIn(
                    saved.getId(), Arrays.asList(Statut.RESERVE, Statut.CONFIRMEE));
            for (Reservation r : actives) {
                try {
                    if (r.getJoueur() != null) {
                        notificationService.envoyerEmailAnnulationCreneau(r.getJoueur().getEmail(), saved);
                    }
                } catch (Exception ex) {
                    log.warn("Notification changement créneau échouée (resa {}): {}", r.getId(), ex.getMessage());
                }
            }
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Creneau> getCreneauxDisponiblesParClub(Long clubId, String dateStr, String sportStr) {
        List<Creneau> creneaux;
        LocalDateTime maintenant = LocalDateTime.now();

        if (dateStr == null || dateStr.isBlank()) {
            creneaux = creneauRepository.findByTerrainClubIdAndDisponibleTrue(clubId);
            creneaux = creneaux.stream()
                    .filter(c -> c.getDateDebut() != null && c.getDateDebut().isAfter(maintenant))
                    .toList();
        } else {
            try {
                LocalDate date = LocalDate.parse(dateStr);
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.atTime(23, 59, 59);

                if (date.equals(LocalDate.now())) {
                    startOfDay = maintenant;
                }

                creneaux = creneauRepository.findByTerrainClubIdAndDisponibleTrueAndDateDebutBetween(
                        clubId, startOfDay, endOfDay);
            } catch (Exception e) {
                throw new RuntimeException("Format de date invalide. Utilisez YYYY-MM-DD");
            }
        }

        // Filter by sport if provided
        System.out.println("The sport filter is :" + sportStr);
        if (sportStr != null && !sportStr.isBlank()) {
            final String sportFilter = sportStr.trim();
            creneaux = creneaux.stream()
                    .filter(c -> c.getTerrain() != null
                            && c.getTerrain().getSport() != null)
                    .toList();
        }

        return creneaux;
    }

}
