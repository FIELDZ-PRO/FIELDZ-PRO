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
}
