package com.fieldz.repository;

import com.fieldz.model.Creneau;
import com.fieldz.model.Statut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreneauRepository extends JpaRepository<Creneau, Long> {
    List<Creneau> findByStatut(Statut statut);
}
