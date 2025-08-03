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

}

