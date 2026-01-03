package com.fieldz.repository;

import com.fieldz.model.Creneau;
import com.fieldz.model.Terrain;
import com.fieldz.model.Statut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CreneauRepository extends JpaRepository<Creneau, Long> {

    @Query("""
        SELECT c FROM Creneau c
        WHERE c.dateDebut BETWEEN :dateStart AND :dateEnd
          AND c.terrain.id = :terrainId
          AND c.statut = 'LIBRE'
          AND c.disponible = true
    """)
    List<Creneau> findCreneauxDisponiblesByDateAndTerrain(@Param("dateStart") LocalDateTime dateStart,
                                                          @Param("dateEnd") LocalDateTime dateEnd,
                                                          @Param("terrainId") Long terrainId);

    List<Creneau> findByStatut(Statut statut);

    // ✅ Nouveau: tient compte de "disponible"
    List<Creneau> findByStatutAndDisponibleTrue(Statut statut);

    @Query("""
        SELECT c FROM Creneau c
        WHERE c.terrain.id = :terrainId
          AND (:dateDebut < c.dateFin AND :dateFin > c.dateDebut)
    """)
    List<Creneau> findCreneauxChevauchants(@Param("terrainId") Long terrainId,
                                           @Param("dateDebut") LocalDateTime dateDebut,
                                           @Param("dateFin") LocalDateTime dateFin);

    Optional<Creneau> findByTerrainAndDateDebutAndDateFin(Terrain terrain, LocalDateTime dateDebut, LocalDateTime dateFin);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Creneau c WHERE c.terrain.id = :terrainId")
    void deleteByTerrainId(Long terrainId);

    // Tous les créneaux disponibles d'un club
    List<Creneau> findByTerrainClubIdAndDisponibleTrue(Long clubId);

    // Créneaux disponibles d'un club pour une date spécifique
    List<Creneau> findByTerrainClubIdAndDisponibleTrueAndDateDebutBetween(Long clubId,
                                                                          LocalDateTime start,
                                                                          LocalDateTime end);

    @Query("""
    select c
    from Creneau c
    join fetch c.terrain t
    left join fetch t.club
    where t.id = :terrainId
""")
    List<Creneau> findByTerrainIdFetchTerrainAndClub(@Param("terrainId") Long terrainId);

    // Paginated query for creneaux by terrain (without join fetch to avoid pagination issues)
    @Query("""
    select c
    from Creneau c
    where c.terrain.id = :terrainId
""")
    Page<Creneau> findByTerrainIdPaginated(@Param("terrainId") Long terrainId, Pageable pageable);

    // Paginated query for all creneaux of a club (across all terrains)
    @Query("""
    select c
    from Creneau c
    where c.terrain.club.id = :clubId
""")
    Page<Creneau> findByClubIdPaginated(@Param("clubId") Long clubId, Pageable pageable);

}

