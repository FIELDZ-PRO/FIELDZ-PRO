package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;




@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "joueur_id")
    @JsonIgnoreProperties({"reservations", "hibernateLazyInitializer", "handler"})
    private Joueur joueur;

    @OneToOne
    @JoinColumn(name = "creneau_id")
    @JsonIgnoreProperties({"reservation", "hibernateLazyInitializer", "handler"})
    private Creneau creneau;



    @Column(name = "date_reservation")
    private LocalDateTime dateReservation;


    @Enumerated(EnumType.STRING)
    private Statut statut;

}
