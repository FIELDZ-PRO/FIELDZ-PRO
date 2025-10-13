package com.fieldz.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fieldz.service.PasswordResetService;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String token = passwordResetService.generateResetToken(request.getEmail());

        // Affiche le lien dans la console (pour tests)
        System.out.println("Lien de réinitialisation : http://10.188.124.180:5173//reset-password?token=" + token);

        return ResponseEntity.ok("Un lien de réinitialisation a été généré.");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );
        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
