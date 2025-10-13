package com.fieldz.service;

import com.fieldz.model.Club;
import com.fieldz.model.Terrain;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.TerrainRepository;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.util.StringUtils;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import com.fieldz.repository.ReservationRepository;
import com.fieldz.repository.CreneauRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class TerrainService {

    private final UtilisateurRepository utilisateurRepository;
    private final TerrainRepository terrainRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;
    private final CreneauRepository creneauRepository;

    public Terrain ajouterTerrain(Terrain terrain, Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        terrain.setClub(club);
        Terrain saved = terrainRepository.save(terrain);
        log.info("Club {} a ajouté un terrain : {}", club.getNom(), saved.getNomTerrain());
        return saved;
    }

    public List<Terrain> getTerrains(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!(utilisateur instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        List<Terrain> terrains = terrainRepository.findByClub(club);
        log.info("Club {} a consulté ses terrains ({} au total)", club.getNom(), terrains.size());
        return terrains;
    }

    public List<Terrain> getTerrainsParVille(String ville) {
        if (!StringUtils.hasText(ville)) return List.of();
        return terrainRepository.findByVilleIgnoreCase(ville.trim());
    }

    // (Optionnel) recherche partielle : "alg" => "Alger", "Alger Centre"
    public List<Terrain> searchVilleContient(String fragment) {
        if (!StringUtils.hasText(fragment)) return List.of();
        // nécessite la requête LIKE dans le repository
        return terrainRepository.findByVilleContainingIgnoreCase(fragment.trim());
    }

    // 2) Multi-villes via CSV: "Alger,Oran"
    public List<Terrain> getTerrainsParVillesCsv(String villesCsv) {
        if (!StringUtils.hasText(villesCsv)) return List.of();

        List<String> villesNorm = Arrays.stream(villesCsv.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .map(s -> s.toLowerCase(Locale.ROOT))
                .distinct()
                .collect(Collectors.toList());

        if (villesNorm.isEmpty()) return List.of();
        return terrainRepository.findByVillesIgnoreCase(villesNorm);
    }

    @org.springframework.transaction.annotation.Transactional
    public com.fieldz.model.Terrain updateTerrain(
            Long terrainId,
            com.fieldz.dto.UpdateTerrainRequest req,
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();
        com.fieldz.model.Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof com.fieldz.model.Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        com.fieldz.model.Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        if (!terrain.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Ce terrain ne vous appartient pas.");
        }

        if (req.getNomTerrain() != null)   terrain.setNomTerrain(req.getNomTerrain());
        if (req.getTypeSurface() != null)  terrain.setTypeSurface(req.getTypeSurface());
        if (req.getVille() != null)        terrain.setVille(req.getVille());
        if (req.getSport() != null)        terrain.setSport(req.getSport());
        if (req.getPolitiqueClub() != null) terrain.setPolitiqueClub(req.getPolitiqueClub());

        com.fieldz.model.Terrain saved = terrainRepository.save(terrain);
        log.info("Club {} a modifié le terrain id={} ({})", club.getNom(), saved.getId(), saved.getNomTerrain());
        return saved;
    }

    @org.springframework.transaction.annotation.Transactional
    public int supprimerTerrain(Long terrainId, org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();
        com.fieldz.model.Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!(utilisateur instanceof com.fieldz.model.Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club.");
        }

        com.fieldz.model.Terrain terrain = terrainRepository.findById(terrainId)
                .orElseThrow(() -> new RuntimeException("Terrain introuvable"));

        if (!terrain.getClub().getId().equals(club.getId())) {
            throw new RuntimeException("Ce terrain ne vous appartient pas.");
        }

        var statutsActifs = java.util.Arrays.asList(com.fieldz.model.Statut.RESERVE, com.fieldz.model.Statut.CONFIRMEE);
        long activeCount = reservationRepository.countByTerrainIdAndStatutIn(terrainId, statutsActifs);

        int annulees = 0;
        if (activeCount > 0) {
            var actives = reservationRepository.findByTerrainIdAndStatutIn(terrainId, statutsActifs);
            for (com.fieldz.model.Reservation r : actives) {
                r.setStatut(com.fieldz.model.Statut.ANNULE_PAR_CLUB);
                r.setDateAnnulation(java.time.LocalDateTime.now());
                r.setMotifAnnulation("Terrain supprimé par le club");
                try {
                    if (r.getJoueur() != null && r.getCreneau() != null) {
                        notificationService.envoyerEmailAnnulationCreneau(r.getJoueur().getEmail(), r.getCreneau());
                    }
                } catch (Exception ex) {
                    log.warn("Notif annulation (terrain supprimé) échouée pour réservation {}: {}", r.getId(), ex.getMessage());
                }
            }
            reservationRepository.saveAll(actives);
            annulees = actives.size();
        }

        // Déréférencer toutes les réservations (actives + historiques) liées aux créneaux du terrain
        var toutes = reservationRepository.findByCreneau_TerrainId(terrainId);
        if (!toutes.isEmpty()) {
            for (com.fieldz.model.Reservation r : toutes) {
                r.setCreneau(null);
            }
            reservationRepository.saveAll(toutes);
        }

// 1) Annuler les résa
// 2) Déréférencer toutes les résa
// 3) Supprimer tous les créneaux du terrain (évite la FK CRENEAU -> TERRAIN)
        creneauRepository.deleteByTerrainId(terrainId);

        // Supprimer le terrain (si pas de cascade sur Terrain->Creneaux, supprime les créneaux d'abord via repo si besoin)
        // Si tu veux forcer côté JPA : ajoute cascade = CascadeType.REMOVE + orphanRemoval = true sur @OneToMany
        terrainRepository.delete(terrain);
        log.info("Terrain {} (id={}) supprimé par le club {} (réservations annulées: {}).",
                terrain.getNomTerrain(), terrain.getId(), club.getNom(), annulees);

        return annulees;
    }

}
