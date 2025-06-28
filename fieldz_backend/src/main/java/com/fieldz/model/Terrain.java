package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Terrain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomTerrain;
    private String typeSurface;

    @ManyToOne
    @JoinColumn(name = "club_id")
    @JsonBackReference("club-terrain")
    private Club club;

    @OneToMany(mappedBy = "terrain")
    @JsonIgnore // <-- Ajoute ça, retire le ManagedReference
    private List<Creneau> creneaux;

}
