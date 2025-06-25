package com.fieldz.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import java.util.Map;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MissingServletRequestParameterException;


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
  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<?> handleNotFound(EntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<?> handleBadParam(MethodArgumentTypeMismatchException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Format de paramètre invalide : " + ex.getMessage());
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<?> handleMissingParam(MissingServletRequestParameterException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Paramètre requis manquant : " + ex.getParameterName());
  }

  // Tu pourras ajouter d'autres handlers ici plus tard
}
