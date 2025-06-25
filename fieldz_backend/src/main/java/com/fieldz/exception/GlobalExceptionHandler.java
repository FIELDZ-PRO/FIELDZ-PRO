package com.fieldz.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import java.util.Map;


@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EmailDejaUtiliseException.class)
  public ResponseEntity<String> handleEmailDejaUtiliseException(EmailDejaUtiliseException ex) {
    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ex.getMessage()); // ou un DTO d'erreur si tu veux aller plus loin
  }
  @ExceptionHandler(AuthentificationException.class)
  public ResponseEntity<?> handleAuthentificationException(AuthentificationException ex) {
    return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("erreur", ex.getMessage()));
  }

  // Tu pourras ajouter d'autres handlers ici plus tard
}
