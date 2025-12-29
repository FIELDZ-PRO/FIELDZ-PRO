package com.fieldz.repository;

import com.fieldz.model.Reservation;
import com.fieldz.model.Joueur;
import com.fieldz.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fieldz.model.Terrain;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByJoueur(Joueur joueur);
    List<Reservation> findByCreneau_TerrainIn(List<Terrain> terrains);


    // A supprimer après les test
    // List<Reservation> findByCreneau_TerrainInAndCreneau_Date(List<Terrain> terrains, LocalDate date);
    @Query("SELECT r FROM Reservation r WHERE r.creneau.terrain IN :terrains AND r.dateReservation BETWEEN :start AND :end")
    List<Reservation> findReservationsByTerrainsAndDateRange(@Param("terrains") List<Terrain> terrains,
                                                             @Param("start") LocalDateTime start,
                                                             @Param("end") LocalDateTime end);
    boolean existsByCreneau_Id(Long creneauId);
    boolean existsByCreneau_IdAndStatutNotIn(Long creneauId, List<Statut> statutsExclus);
    List<Reservation> findByJoueurAndStatut(Joueur joueur, Statut statut);

    @Query("SELECT r FROM Reservation r WHERE r.joueur.id = :joueurId AND r.statut IN :statuts")
    List<Reservation> findAnnuleesByJoueurId(@Param("statuts") List<Statut> statuts, @Param("joueurId") Long joueurId);

    List<Reservation> findByCreneauId(Long creneauId);

    /*@Query("""
    SELECT r FROM Reservation r
    WHERE r.creneau.terrain IN :terrains
      AND r.creneau.dateDebut BETWEEN :start AND :end
""")
    List<Reservation> findByTerrainsAndDateDebut(
            @Param("terrains") List<Terrain> terrains,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    ); */
    @Query("""
    SELECT r FROM Reservation r
    WHERE r.creneau.terrain IN :terrains
      AND r.creneau.dateDebut BETWEEN :start AND :end
""")
    List<Reservation> findByTerrainsAndDateDebut(
            @Param("terrains") List<Terrain> terrains,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /*
    @Query("SELECT r FROM Reservation r " +
            "WHERE r.creneau.terrain IN :terrains " +
            "AND FUNCTION('DATE', r.dateReservation) = :date")
    List<Reservation> findByTerrainsAndDateReservation(
            List<Terrain> terrains,
            @Param("date") LocalDate date);

            */

    long countByCreneauIdAndStatutIn(Long creneauId, List<Statut> statuts);

    List<Reservation> findByCreneauIdAndStatutIn(Long creneauId, List<Statut> statuts);

    // Réservations actives sur un terrain (tous ses créneaux)
    @org.springframework.data.jpa.repository.Query("""
       SELECT r FROM Reservation r
       WHERE r.creneau.terrain.id = :terrainId
         AND r.statut IN :statuts
       """)
    java.util.List<com.fieldz.model.Reservation> findByTerrainIdAndStatutIn(
            @org.springframework.data.repository.query.Param("terrainId") Long terrainId,
            @org.springframework.data.repository.query.Param("statuts") java.util.List<com.fieldz.model.Statut> statuts);

    @org.springframework.data.jpa.repository.Query("""
       SELECT COUNT(r) FROM Reservation r
       WHERE r.creneau.terrain.id = :terrainId
         AND r.statut IN :statuts
       """)
    long countByTerrainIdAndStatutIn(
            @org.springframework.data.repository.query.Param("terrainId") Long terrainId,
            @org.springframework.data.repository.query.Param("statuts") java.util.List<com.fieldz.model.Statut> statuts);

    // Pour déréférencer TOUTES les réservations liées à un terrain (actives + historiques)
    java.util.List<com.fieldz.model.Reservation> findByCreneau_TerrainId(Long terrainId);


    @Query("""
    select r
    from Reservation r
    join fetch r.creneau c
    join fetch r.joueur j
    left join fetch c.terrain t
    left join fetch t.club club
    where r.statut = :statut
      and c.dateDebut between :start and :end
""")
    List<Reservation> findUpcomingWithCreneauBetween(
            @Param("start") LocalDateTime start,
            @Param("end")   LocalDateTime end,
            @Param("statut") Statut statut
    );

    // Statistics queries - Filter by creneau date (when the game is scheduled), not reservation date
    @Query("""
    SELECT COUNT(r) FROM Reservation r
    WHERE r.creneau.terrain IN :terrains
      AND r.creneau.dateDebut BETWEEN :start AND :end
    """)
    long countByTerrainsAndDateRange(
            @Param("terrains") List<Terrain> terrains,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
    SELECT COUNT(r) FROM Reservation r
    WHERE r.creneau.terrain IN :terrains
      AND r.statut = :statut
      AND r.creneau.dateDebut BETWEEN :start AND :end
    """)
    long countByTerrainsAndStatutAndDateRange(
            @Param("terrains") List<Terrain> terrains,
            @Param("statut") Statut statut,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
    SELECT SUM(r.creneau.prix) FROM Reservation r
    WHERE r.creneau.terrain IN :terrains
      AND r.statut = :statut
      AND r.creneau.dateDebut BETWEEN :start AND :end
      AND r.creneau.prix IS NOT NULL
    """)
    Double sumPrixByTerrainsAndStatutAndDateRange(
            @Param("terrains") List<Terrain> terrains,
            @Param("statut") Statut statut,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}
