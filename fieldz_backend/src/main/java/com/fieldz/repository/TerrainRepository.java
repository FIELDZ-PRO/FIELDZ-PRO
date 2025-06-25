package com.fieldz.repository;

import com.fieldz.model.Terrain;
import com.fieldz.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TerrainRepository extends JpaRepository<Terrain, Long> {
    List<Terrain> findByClub(Club club);
}
