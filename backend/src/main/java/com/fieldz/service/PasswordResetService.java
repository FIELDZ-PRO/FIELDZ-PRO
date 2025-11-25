package com.fieldz.service;

import com.fieldz.model.PasswordResetToken;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.PasswordResetTokenRepository;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    /**
     * Génère un nouveau token de réinitialisation (un seul actif à la fois)
     */
    @Transactional
    public String generateResetToken(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Aucun utilisateur avec cet email."));

        // Supprime tout ancien token actif pour éviter les doublons
        tokenRepository.deleteByUtilisateurId(utilisateur.getId());

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .expirationDate(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .utilisateur(utilisateur)
                .build();

        tokenRepository.save(resetToken);

        // 🔗 Construction du lien (via variable d'env ou fallback IP LAN)
        String frontBase = System.getenv("FRONT_BASE_URL");
        if (frontBase == null || frontBase.isBlank()) {
            frontBase = "http://10.188.124.180:5173/";
        }
        String resetUrl = frontBase + "/reset-password?token=" + token;

        // ✉️ Envoi de l’email
        emailService.sendPasswordResetEmail(utilisateur.getEmail(), token);

        // Log utile en dev
        System.out.println("Lien de réinitialisation : " + resetUrl);

        return token;
    }

    /**
     * Réinitialise le mot de passe si le token est valide
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token invalide"));

        // Vérifications
        if (resetToken.isUsed()) {
            throw new IllegalStateException("Token déjà utilisé");
        }
        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expiré");
        }

        // Met à jour le mot de passe utilisateur
        Utilisateur utilisateur = resetToken.getUtilisateur();
        utilisateur.setMotDePasse(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(utilisateur);

        // Marque le token comme utilisé et supprime les anciens
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        tokenRepository.deleteByUtilisateurId(utilisateur.getId());

        // Envoi d'un email de confirmation
        emailService.sendPasswordChangeConfirmation(utilisateur.getEmail());
    }
}
