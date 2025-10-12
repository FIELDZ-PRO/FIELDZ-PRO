package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Set;

@Entity
@DiscriminatorValue("CLUB")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class Club extends Utilisateur {

    // rétro-compat: on mappe nom sur l'ancienne colonne nom_club si elle existe
    @Column(name = "nom_club")
    //private String nom;

    private String ville;

    private String adresse;

    private String telephone;

    // URL publique ou chemin vers la bannière
    @Column(name = "banniere_url")
    private String banniereUrl;

    // Plusieurs sports pris en charge par le club
    @ElementCollection(targetClass = Sport.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "club_sports", joinColumns = @JoinColumn(name = "club_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "sport", nullable = false)
    private Set<Sport> sports;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Terrain> terrains;
}

