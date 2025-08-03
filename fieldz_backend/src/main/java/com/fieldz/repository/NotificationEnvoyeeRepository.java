package com.fieldz.repository;

import com.fieldz.model.NotificationEnvoyee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationEnvoyeeRepository extends JpaRepository<NotificationEnvoyee, Long> {
    Optional<NotificationEnvoyee> findByReservationIdAndType(Long reservationId, String type);
}
