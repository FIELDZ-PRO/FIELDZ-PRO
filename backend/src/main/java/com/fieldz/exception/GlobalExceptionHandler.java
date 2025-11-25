package com.fieldz.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  // === Utilitaires de réponse JSON ===
  private ResponseEntity<Map<String,Object>> json(HttpStatus status, String message) {
    return ResponseEntity.status(status).body(Map.of(
            "status", status.value(),
            "message", message == null ? "Erreur" : message
    ));
  }

  // === Handlers spécifiques existants ===
  @ExceptionHandler(EmailDejaUtiliseException.class)
  public ResponseEntity<?> handleEmailDejaUtiliseException(EmailDejaUtiliseException ex) {
    return json(HttpStatus.CONFLICT, ex.getMessage()); // 409 Conflict
  }

  @ExceptionHandler(AuthentificationException.class)
  public ResponseEntity<?> handleAuthException(AuthentificationException ex) {
    String msg = ex.getMessage();
    if (msg != null && msg.startsWith("Compte bloqué")) {
      return json(HttpStatus.LOCKED, msg); // 423
    }
    // Toutes les autres erreurs d'authentification retournent 401
    return json(HttpStatus.UNAUTHORIZED, msg); // 401
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<?> handleNotFound(EntityNotFoundException ex) {
    return json(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<?> handleBadParam(MethodArgumentTypeMismatchException ex) {
    return json(HttpStatus.BAD_REQUEST, "Format de paramètre invalide : " + ex.getMessage());
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<?> handleMissingParam(MissingServletRequestParameterException ex) {
    return json(HttpStatus.BAD_REQUEST, "Paramètre requis manquant : " + ex.getParameterName());
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<?> handleIllegalState(IllegalStateException ex) {
    return json(HttpStatus.BAD_REQUEST, ex.getMessage());
  }

  @ExceptionHandler(ReservationDejaAnnuleeException.class)
  public ResponseEntity<?> handleReservationDejaAnnulee(ReservationDejaAnnuleeException ex) {
    return json(HttpStatus.BAD_REQUEST, ex.getMessage());
  }

  @ExceptionHandler(ReservationIntrouvableException.class)
  public ResponseEntity<?> handleReservationIntrouvable(ReservationIntrouvableException ex) {
    return json(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler(AnnulationNonAutoriseeException.class)
  public ResponseEntity<?> handleAnnulationNonAutorisee(AnnulationNonAutoriseeException ex) {
    return json(HttpStatus.FORBIDDEN, ex.getMessage());
  }

  @ExceptionHandler(CreneauDejaReserveException.class)
  public ResponseEntity<?> handleCreneauDejaReserve(CreneauDejaReserveException ex) {
    return json(HttpStatus.CONFLICT, ex.getMessage());
  }

  // === Spring Security exceptions ===
  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
    return json(HttpStatus.FORBIDDEN, "Acces refuse"); // 403
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<?> handleSpringAuthException(AuthenticationException ex) {
    return json(HttpStatus.UNAUTHORIZED, "Non authentifie"); // 401
  }

  // === (NOUVEAU) Respecte le status d'origine (ex: 429) ===
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String,Object>> handleRSE(ResponseStatusException ex) {
    HttpStatus status = (HttpStatus) ex.getStatusCode();
    return ResponseEntity.status(status).body(Map.of(
            "status", status.value(),
            "message", ex.getReason() != null ? ex.getReason() : "Erreur"
    ));
  }

  // (Optionnel) si tu utilises la validation @Valid et veux un retour détaillé
  @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,Object>> handleValidation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
    var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> Map.of("field", fe.getField(), "defaultMessage", fe.getDefaultMessage()))
            .toList();
    return ResponseEntity.badRequest().body(Map.of(
            "status", 400,
            "message", "Validation error",
            "errors", errors
    ));
  }

  // (Optionnel) si tu envoies des mails, mappe 502 proprement
  @ExceptionHandler({ MailException.class, jakarta.mail.MessagingException.class })
  public ResponseEntity<Map<String,Object>> handleMail(Exception ex) {
    return json(HttpStatus.BAD_GATEWAY, "Impossible d’envoyer l’email pour le moment");
  }

  // === Catch-all final (garde-le en dernier) ===
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String,Object>> handleGlobalException(Exception ex) {
    // Gerer AuthentificationException ici aussi (au cas ou le handler specifique ne fonctionne pas)
    if (ex instanceof AuthentificationException) {
      String msg = ex.getMessage();
      if (msg != null && msg.startsWith("Compte bloqué")) {
        return json(HttpStatus.LOCKED, msg);
      }
      return json(HttpStatus.UNAUTHORIZED, msg);
    }

    // Verifier si c'est une RuntimeException avec message utile
    String msg = ex.getMessage();
    if (msg != null) {
      // Gestion des erreurs d'acces par type de role incorrect
      if (msg.contains("n'est pas un club") || msg.contains("n'est pas un joueur")) {
        return json(HttpStatus.FORBIDDEN, msg);
      }
      // Entite introuvable ou non trouvee
      if (msg.contains("introuvable") || msg.contains("non trouvé")) {
        return json(HttpStatus.NOT_FOUND, msg);
      }
      // Erreurs d'authentification par message
      if (msg.contains("Mot de passe incorrect") || msg.contains("Utilisateur non trouvé")) {
        return json(HttpStatus.UNAUTHORIZED, msg);
      }
    }
    return json(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne");
  }
}
