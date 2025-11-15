package com.fieldz.repository;

import com.fieldz.model.ClubImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubImageRepository extends JpaRepository<ClubImage, Long> {
    List<ClubImage> findByClubIdOrderByDisplayOrderAsc(Long clubId);
    void deleteByClubIdAndId(Long clubId, Long imageId);
}
