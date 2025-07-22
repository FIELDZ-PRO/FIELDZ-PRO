package com.fieldz.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Créneau déjà réservé")
public class CreneauDejaReserveException extends RuntimeException {
    public CreneauDejaReserveException(String message) {
        super(message);
    }
}
