package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import lombok.experimental.SuperBuilder;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;



@Entity
@DiscriminatorValue("JOUEUR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Joueur extends Utilisateur {

    private String prenom;
    private String telephone;



    @OneToMany(mappedBy = "joueur")
    @JsonIgnore   // <-- Ajoute cette ligne pour ne JAMAIS envoyer la liste des réservations d'un joueur dans le JSON
    private List<Reservation> reservations;



}
