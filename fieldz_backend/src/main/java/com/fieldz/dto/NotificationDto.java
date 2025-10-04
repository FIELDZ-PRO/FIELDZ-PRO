package com.fieldz.dto;

import com.fieldz.model.TypeNotification;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;
    private String message;
    private TypeNotification type;
    private LocalDateTime dateEnvoi;
    private boolean lue;
    private Long reservationId;
}
