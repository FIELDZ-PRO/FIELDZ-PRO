package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Entity
@DiscriminatorValue("CLUB")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Club extends Utilisateur {

    // ⚠️ Supprimé : @Column(name = "nom_club") qui annotait 'ville' par erreur

    private String ville;

    private String adresse;

    private String telephone;

    @ElementCollection(targetClass = Sport.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "club_sports", joinColumns = @JoinColumn(name = "club_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "sport", nullable = false)
    private Set<Sport> sports;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Terrain> terrains;

    @Column(columnDefinition = "TEXT")
    private String politique;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_link")
    private String locationLink;

    @Column(name = "heure_ouverture")
    private LocalTime heureOuverture;

    @Column(name = "heure_fermeture")
    private LocalTime heureFermeture;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClubImage> images;
}
