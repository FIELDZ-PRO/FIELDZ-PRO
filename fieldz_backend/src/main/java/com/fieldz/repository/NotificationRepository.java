package com.fieldz.repository;

import com.fieldz.model.Notification;
import com.fieldz.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataireOrderByDateEnvoiDesc(Utilisateur user);
}
