package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Entity
@DiscriminatorValue("CLUB")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Club extends Utilisateur {

    private String nomClub;
    private String adresse;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Terrain> terrains;
}
