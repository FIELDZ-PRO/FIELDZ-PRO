package com.fieldz.mapper;

import com.fieldz.dto.NotificationDto;
import com.fieldz.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setMessage(n.getMessage());
        dto.setType(n.getType());
        dto.setDateEnvoi(n.getDateEnvoi());
        dto.setLue(n.isLue());
        dto.setReservationId(n.getReservation() != null ? n.getReservation().getId() : null);
        return dto;
    }
}
