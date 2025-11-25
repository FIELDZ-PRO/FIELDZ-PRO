package com.fieldz.controller;

import java.util.List;

// DTO pour la requête
class DemandePartenariatRequest {
    private String nomClub;
    private String ville;
    private String nomResponsable;
    private String email;
    private String telephone;
    private List<String> terrains;
    private String message;

    // Getters et Setters
    public String getNomClub() {
        return nomClub;
    }

    public void setNomClub(String nomClub) {
        this.nomClub = nomClub;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getNomResponsable() {
        return nomResponsable;
    }

    public void setNomResponsable(String nomResponsable) {
        this.nomResponsable = nomResponsable;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public List<String> getTerrains() {
        return terrains;
    }

    public void setTerrains(List<String> terrains) {
        this.terrains = terrains;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
