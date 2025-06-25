package com.fieldz.repository;

import com.fieldz.model.Reservation;
import com.fieldz.model.Joueur;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fieldz.model.Terrain;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fieldz.model.Reservation;
import com.fieldz.model.Terrain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByJoueur(Joueur joueur);
    List<Reservation> findByCreneau_TerrainIn(List<Terrain> terrains);
    List<Reservation> findByCreneau_TerrainInAndCreneau_Date(List<Terrain> terrains, LocalDate date);
    @Query("SELECT r FROM Reservation r WHERE r.creneau.terrain IN :terrains AND r.dateReservation BETWEEN :start AND :end")
    List<Reservation> findReservationsByTerrainsAndDateRange(@Param("terrains") List<Terrain> terrains,
                                                             @Param("start") LocalDateTime start,
                                                             @Param("end") LocalDateTime end);

}
