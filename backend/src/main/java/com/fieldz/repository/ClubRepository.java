package com.fieldz.repository;

import com.fieldz.model.Club;
import com.fieldz.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClubRepository extends JpaRepository<Club, Long> {

    @Query("""
           select c from Club c
           where lower(c.ville) like lower(concat('%', :ville, '%'))
           """)
    List<Club> findByVilleLikeIgnoreCase(@Param("ville") String ville);

    @Query("""
           select c from Club c
           where :sport member of c.sports
           """)
    List<Club> findBySport(@Param("sport") Sport sport);

    @Query("""
           select c from Club c
           where lower(c.ville) like lower(concat('%', :ville, '%'))
             and :sport member of c.sports
           """)
    List<Club> findByVilleAndSport(@Param("ville") String ville, @Param("sport") Sport sport);
}
