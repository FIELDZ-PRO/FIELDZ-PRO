package com.fieldz.auth;

import com.fieldz.exception.AuthentificationException;
import com.fieldz.exception.EmailDejaUtiliseException;
import com.fieldz.model.Joueur;
import com.fieldz.model.Club;
import com.fieldz.model.Role;
import com.fieldz.model.Utilisateur;
import com.fieldz.repository.UtilisateurRepository;
import com.fieldz.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailDejaUtiliseException(request.getEmail());
        }

        Role enumRole = Role.valueOf(request.getRole().toUpperCase());
        Utilisateur user;

        if (enumRole == Role.JOUEUR) {
            user = Joueur.builder()
                    .nom(request.getNom())
                    .email(request.getEmail())
                    .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                    .typeRole(Role.JOUEUR)
                    .build();
        } else {
            user = Club.builder()
                    .nom(request.getNom())
                    .email(request.getEmail())
                    .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                    .typeRole(Role.CLUB)
                    .adresse(request.getAdresse())
                    .build();
        }

        utilisateurRepository.save(user);

        // ⬇️ Nouveau : subject = email, claim = role
        String jwt = jwtService.generateToken(
                user.getEmail(),
                Map.of("role", user.getTypeRole().name())
        );
        return AuthenticationResponse.builder().token(jwt).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthentificationException("Utilisateur non trouvé"));

        // Compte temporairement bloqué ?
        if (user.getAccountBlockedUntil() != null &&
                user.getAccountBlockedUntil().isAfter(LocalDateTime.now())) {
            throw new AuthentificationException("Compte bloqué jusqu’à " + user.getAccountBlockedUntil());
        }

        // Vérification manuelle du mot de passe
        if (!passwordEncoder.matches(request.getMotDePasse(), user.getMotDePasse())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);

            if (attempts >= 3) {
                user.setAccountBlockedUntil(LocalDateTime.now().plusMinutes(10));
                user.setFailedLoginAttempts(0);
            }

            utilisateurRepository.save(user);
            throw new AuthentificationException("Mot de passe incorrect");
        }

        // Succès → reset des compteurs
        user.setFailedLoginAttempts(0);
        user.setAccountBlockedUntil(null);
        utilisateurRepository.save(user);

        // ⬇️ Nouveau : subject = email, claim = role
        String jwt = jwtService.generateToken(
                user.getEmail(),
                Map.of("role", user.getTypeRole().name())
        );
        return AuthenticationResponse.builder().token(jwt).build();
    }
}
