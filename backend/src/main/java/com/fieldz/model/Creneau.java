package com.fieldz.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Creneau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Supprimer plus tard
    //private LocalDate date;
    //private LocalTime heureDebut;
    //private LocalTime heureFin;

    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;

    // ✅ Champ ajouté
    private Double prix;

    // TODO: TEMPORARY - Remove this field later (secondPrix feature is temporary)
    private Double secondPrix;

    @Enumerated(EnumType.STRING)
    private Statut statut = Statut.LIBRE;

    private boolean disponible = true;

    @ManyToOne
    @JsonIgnoreProperties({"creneaux"})
    private Terrain terrain;

    // Champ transient pour la duplication (non persisté en base)
    @Transient
    private Integer nombreDuplications;

//Supprimer à la fin des test
    //@OneToOne(mappedBy = "creneau")
    //@JsonIgnore   // <-- Ajoute pour éviter d'inclure Reservation dans le JSON d'un créneau (sinon boucle)
    //private Reservation reservation;

}
