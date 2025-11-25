package com.fieldz.model;

public enum Statut {

    // Creneaux
    LIBRE, // ajout à documenter
    RESERVE, // aussi pour réservation, équivalent de 'en cours'
    ANNULE,  // créneau annulé (indisponible)
    // Réservations
    ANNULE_PAR_JOUEUR,
    ANNULE_PAR_CLUB,
    CONFIRMEE,        // participation confirmée
    ABSENT            // joueur ne s'est pas présenté
}
