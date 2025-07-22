package com.fieldz.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String nom;
    private String role; // ou typeRole
    private LocalDateTime dateInscription;
}
