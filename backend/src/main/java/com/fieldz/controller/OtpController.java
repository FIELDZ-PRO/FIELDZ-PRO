package com.fieldz.controller;

import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;
import com.fieldz.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;
    private final UtilisateurRepository utilisateurRepository;

    /**
     * Send OTP code to email
     * POST /api/otp/send
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email est requis"));
        }

        // Check if user exists
        Utilisateur user = utilisateurRepository.findByEmail(email).orElse(null);
        //if (user == null) {
        //    return ResponseEntity.badRequest()
        //            .body(Map.of("message", "Aucun compte trouvé avec cet email"));
        //}

        // Check if already verified
        //if (user.isEmailVerified()) {
        //    return ResponseEntity.badRequest()
        //            .body(Map.of("message", "Cet email est déjà vérifié"));
        //}

        try {
            otpService.sendOtp(email);
            log.info("OTP sent successfully to: {}", email);
            return ResponseEntity.ok(Map.of(
                    "message", "Code de vérification envoyé à votre email",
                    "email", email
            ));
        } catch (Exception e) {
            log.error("Error sending OTP to {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Erreur lors de l'envoi du code"));
        }
    }

    /**
     * Resend OTP code
     * POST /api/otp/resend
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/resend")
    public ResponseEntity<Map<String, String>> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email est requis"));
        }

        try {
            otpService.resendOtp(email);
            log.info("OTP resent successfully to: {}", email);
            return ResponseEntity.ok(Map.of(
                    "message", "Un nouveau code a été envoyé à votre email"
            ));
        } catch (Exception e) {
            log.error("Error resending OTP to {}: {}", email, e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Erreur lors de l'envoi du code"));
        }
    }

    /**
     * Verify OTP code
     * POST /api/otp/verify
     * Body: { "email": "user@example.com", "code": "123456" }
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email est requis"));
        }

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Code est requis"));
        }

        // Verify the OTP code
        boolean isValid = otpService.verifyOtp(email, code);

        if (isValid) {
            // Mark email as verified in Utilisateur
            Utilisateur user = utilisateurRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setEmailVerified(true);
                utilisateurRepository.save(user);
                log.info("Email verified successfully for: {}", email);
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Email vérifié avec succès !",
                    "verified", "true"
            ));
        } else {
            log.warn("Invalid OTP verification attempt for: {}", email);
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message", "Code invalide ou expiré",
                            "verified", "false"
                    ));
        }
    }
}
