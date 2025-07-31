package com.fieldz.dto;

import com.fieldz.model.Role;
import lombok.Data;

@Data
public class CompleteProfileRequest {
    private String nom;
    private String prenom;
    private String telephone;

}
