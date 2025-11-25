package com.fieldz.repository;

import com.fieldz.model.Terrain;
import com.fieldz.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface TerrainRepository extends JpaRepository<Terrain, Long> {
    List<Terrain> findByClub(Club club);

    // Ville exacte (insensible à la casse)
    @Query("SELECT t FROM Terrain t WHERE LOWER(t.ville) = LOWER(:ville)")
    List<Terrain> findByVilleIgnoreCase(String ville);

    // Multi-villes (insensible à la casse)
    @Query("SELECT t FROM Terrain t WHERE LOWER(t.ville) IN :villes")
    List<Terrain> findByVillesIgnoreCase(List<String> villes);

    // ✅ Recherche par correspondance partielle (contient)
    List<Terrain> findByVilleContainingIgnoreCase(String fragment);

}
