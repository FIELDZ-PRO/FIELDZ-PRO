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

@Slf4j
@Service
@RequiredArgsConstructor
public class TerrainService {

    private final UtilisateurRepository utilisateurRepository;
    private final TerrainRepository terrainRepository;

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
}
