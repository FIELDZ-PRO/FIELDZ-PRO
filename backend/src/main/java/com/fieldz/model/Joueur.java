package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@DiscriminatorValue("JOUEUR")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class Joueur extends Utilisateur {

    private String prenom;

    private String telephone;

    // URL de la photo de profil
    @Column(name = "photo_profil_url")
    private String photoProfilUrl;

    @OneToMany(mappedBy = "joueur")
    @JsonIgnore // évite les payloads énormes / boucles
    private List<Reservation> reservations;
}
