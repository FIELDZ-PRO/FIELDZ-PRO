package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@SuperBuilder
public class Admin extends Utilisateur {
    
    public Admin() {
        super();
    }
    
    // Pas besoin de champs supplémentaires pour l'instant
    // L'admin hérite de tous les champs de Utilisateur
    
}