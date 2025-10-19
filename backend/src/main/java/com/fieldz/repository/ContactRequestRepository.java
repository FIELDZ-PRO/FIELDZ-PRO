package com.fieldz.repository;

import com.fieldz.model.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {

    // nombre de demandes depuis 'after' pour une adresse (insensible à la casse)
    long countByEmailIgnoreCaseAndCreatedAtAfter(String email, LocalDateTime after);
}
