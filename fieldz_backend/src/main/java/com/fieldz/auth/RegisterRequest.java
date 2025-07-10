package com.fieldz.auth;

import com.fieldz.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String nom;
    private String email;
    private String motDePasse;
    private String adresse;
    private String nomClub;
    private String role; // JOUEUR ou CLUB
}
