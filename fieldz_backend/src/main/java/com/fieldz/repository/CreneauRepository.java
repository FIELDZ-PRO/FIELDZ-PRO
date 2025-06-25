package com.fieldz.repository;

import com.fieldz.model.Creneau;
import com.fieldz.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;


public interface CreneauRepository extends JpaRepository<Creneau, Long> {
    @Query("SELECT c FROM Creneau c WHERE c.date = :date AND c.terrain.id = :terrainId AND c.statut = 'LIBRE' AND c.disponible = true")
    List<Creneau> findCreneauxDisponiblesByDateAndTerrain(@Param("date") LocalDate date, @Param("terrainId") Long terrainId);

    List<Creneau> findByStatut(Statut statut);
}

