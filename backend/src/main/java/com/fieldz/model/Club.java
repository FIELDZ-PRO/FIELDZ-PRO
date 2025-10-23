package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

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

    @Column(name = "banniere_url")
    private String banniereUrl;

    @ElementCollection(targetClass = Sport.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "club_sports", joinColumns = @JoinColumn(name = "club_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "sport", nullable = false)
    private Set<Sport> sports;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Terrain> terrains;

    // Ajout de la politique du club

    private String description;
}
