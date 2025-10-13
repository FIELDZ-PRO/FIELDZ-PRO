package com.fieldz.exception;

public class CreneauHasActiveReservationsException extends RuntimeException {
    private final Long creneauId;
    private final long activeCount;

    public CreneauHasActiveReservationsException(Long creneauId, long activeCount) {
        super("Le créneau " + creneauId + " possède déjà " + activeCount + " réservation(s) active(s).");
        this.creneauId = creneauId;
        this.activeCount = activeCount;
    }

    public Long getCreneauId() {
        return creneauId;
    }

    public long getActiveCount() {
        return activeCount;
    }
}
