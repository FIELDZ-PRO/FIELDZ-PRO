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
  public ResponseEntity<String> handleAuthException(AuthentificationException ex) {
    String msg = ex.getMessage();
    if (msg.startsWith("Mot de passe")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg); // 401
    } else if (msg.startsWith("Compte bloqué")) {
      return ResponseEntity.status(HttpStatus.LOCKED).body(msg); // 423
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur inattendue");
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

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<String> handleIllegalState(IllegalStateException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
  }

  @ExceptionHandler(ReservationDejaAnnuleeException.class)
  public ResponseEntity<String> handleReservationDejaAnnulee(ReservationDejaAnnuleeException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleGlobalException(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Erreur serveur : " + ex.getMessage());
  }

  @ExceptionHandler(ReservationIntrouvableException.class)
  public ResponseEntity<String> handleReservationIntrouvable(ReservationIntrouvableException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }

  @ExceptionHandler(AnnulationNonAutoriseeException.class)
  public ResponseEntity<String> handleAnnulationNonAutorisee(AnnulationNonAutoriseeException ex) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
  }

  @ExceptionHandler(CreneauDejaReserveException.class)
  public ResponseEntity<String> handleCreneauDejaReserve(CreneauDejaReserveException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
  }


}
