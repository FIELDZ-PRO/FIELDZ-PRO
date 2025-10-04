package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Utilisateur destinataire;

    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    private String message;

    private LocalDateTime dateEnvoi;

    private boolean lue;

    @ManyToOne
    private Reservation reservation;
}
