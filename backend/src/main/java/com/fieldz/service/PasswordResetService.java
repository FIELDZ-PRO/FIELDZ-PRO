package com.fieldz.service;

import com.fieldz.model.PasswordResetToken;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.PasswordResetTokenRepository;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;


    public String generateResetToken(String email) {
        Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Aucun utilisateur avec cet email.");
        }

        Utilisateur utilisateur = userOpt.get();
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .expirationDate(LocalDateTime.now().plusMinutes(30))
                .utilisateur(utilisateur)
                .used(false)
                .build();


        tokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(email, token);

        return token;
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token invalide"));

        if (resetToken.isUsed() || resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expiré ou déjà utilisé");
        }

        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(utilisateur);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Email de confirmation
        emailService.sendPasswordChangeConfirmation(utilisateur.getEmail());
    }


}
