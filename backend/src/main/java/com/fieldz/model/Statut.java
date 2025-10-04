package com.fieldz.model;

public enum Statut {

    // Creneaux
    LIBRE, // ajout à documenter
    RESERVE, // aussi pour réservation, équivalent de 'en cours'
    ANNULE,
    // Réservations
    ANNULE_PAR_JOUEUR,
    ANNULE_PAR_CLUB,
    CONFIRMEE
}
