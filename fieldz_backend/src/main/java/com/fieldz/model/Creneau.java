package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Creneau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;

    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.LIBRE;  // par défaut

    private boolean disponible = true;

    @ManyToOne
    @JsonBackReference
    private Terrain terrain;

    @OneToOne(mappedBy = "creneau")
    @JsonBackReference
    private Reservation reservation;

}
