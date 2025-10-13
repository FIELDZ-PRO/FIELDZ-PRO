package com.fieldz.repository;

import com.fieldz.model.Creneau;
import com.fieldz.model.Terrain;
import com.fieldz.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;

public interface CreneauRepository extends JpaRepository<Creneau, Long> {
    @Query("SELECT c FROM Creneau c WHERE c.dateDebut BETWEEN :dateStart AND :dateEnd AND c.terrain.id = :terrainId AND c.statut = 'LIBRE' AND c.disponible = true")
    List<Creneau> findCreneauxDisponiblesByDateAndTerrain(@Param("dateStart") LocalDateTime dateStart,
                                                          @Param("dateEnd") LocalDateTime dateEnd,
                                                          @Param("terrainId") Long terrainId);

    List<Creneau> findByStatut(Statut statut);

    @Query("""
    SELECT c FROM Creneau c
    WHERE c.terrain.id = :terrainId
      AND (
          :dateDebut < c.dateFin AND
          :dateFin > c.dateDebut
      )
""")
    List<Creneau> findCreneauxChevauchants(@Param("terrainId") Long terrainId,
                                           @Param("dateDebut") java.time.LocalDateTime dateDebut,
                                           @Param("dateFin") java.time.LocalDateTime dateFin);

    Optional<Creneau> findByTerrainAndDateDebutAndDateFin(Terrain terrain, LocalDateTime dateDebut, LocalDateTime dateFin);


    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Creneau c WHERE c.terrain.id = :terrainId")
    void deleteByTerrainId(Long terrainId);
    // Tous les créneaux disponibles d'un club
    List<Creneau> findByTerrainClubIdAndDisponibleTrue(Long clubId);

// Créneaux disponibles d'un club pour une date spécifique
    List<Creneau> findByTerrainClubIdAndDisponibleTrueAndDateDebutBetween(
    Long clubId, LocalDateTime start, LocalDateTime end
    );
}

