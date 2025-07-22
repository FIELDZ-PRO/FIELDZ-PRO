package com.fieldz.service;

import com.fieldz.model.*;
import com.fieldz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreneauService {

    private final CreneauRepository creneauRepository;
    private final TerrainRepository terrainRepository;
    private final UtilisateurRepository utilisateurRepository;

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
}