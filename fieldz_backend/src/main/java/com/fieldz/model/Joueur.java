package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import lombok.experimental.SuperBuilder;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@DiscriminatorValue("JOUEUR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Joueur extends Utilisateur {

    @OneToMany(mappedBy = "joueur")
    @JsonManagedReference
    private List<Reservation> reservations;


}
