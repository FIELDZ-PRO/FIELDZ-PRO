package com.fieldz.dto;

import com.fieldz.model.Sport;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class ContactRequestDto {

    @NotBlank(message = "Le nom du club est obligatoire.")
    @Size(max = 150)
    private String nomClub;

    @NotBlank(message = "La ville est obligatoire.")
    @Size(max = 100)
    private String ville;

    @NotBlank(message = "Le nom du responsable est obligatoire.")
    @Size(max = 150)
    private String nomResponsable;

    @NotBlank(message = "L'email est obligatoire.")
    @Email(message = "Format d'email invalide.")
    private String email;

    @NotBlank(message = "Le téléphone est obligatoire.")
    @Size(max = 30, message = "Téléphone trop long.")
    private String telephone;

    /** Ensemble de sports cochés (peut être vide si aucun sport ne correspond) */
    @NotEmpty(message = "Veuillez sélectionner au moins un sport.")
    private Set<Sport> sports;

    /** Message facultatif */
    @Size(max = 4000)
    private String message;
}
