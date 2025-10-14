package com.fieldz.controller;

import com.fieldz.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {

    private final EmailService emailService;

    @PostMapping("/club-partnership")
    public ResponseEntity<?> envoyerDemandePartenariat(@RequestBody DemandePartenariatRequest request) {
        try {
            String sujet = "🤝 Nouvelle demande de partenariat - " + request.getNomClub();
            
            String contenu = String.format("""
                Nouvelle demande de partenariat club :
                
                📋 Informations du club :
                - Nom du club : %s
                - Ville : %s
                
                👤 Responsable :
                - Nom : %s
                - Email : %s
                - Téléphone : %s
                
                🏟️ Types de terrains :
                %s
                
                💬 Message :
                %s
                """,
                request.getNomClub(),
                request.getVille(),
                request.getNomResponsable(),
                request.getEmail(),
                request.getTelephone(),
                request.getTerrains().isEmpty() ? "Non spécifié" : String.join(", ", request.getTerrains()),
                request.getMessage() != null && !request.getMessage().isBlank() ? request.getMessage() : "Aucun message"
            );

            emailService.envoyerEmail("yacineallam00@gmail.com", sujet, contenu);
            
            log.info("✅ Email de demande de partenariat envoyé : {}", request.getNomClub());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Demande envoyée avec succès ! Nous vous contacterons sous 24h."
            ));
            
        } catch (Exception e) {
            log.error("❌ Erreur lors de l'envoi de la demande de partenariat", e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Erreur lors de l'envoi. Veuillez réessayer."
            ));
        }
    }
}

// DTO pour la requête
class DemandePartenariatRequest {
    private String nomClub;
    private String ville;
    private String nomResponsable;
    private String email;
    private String telephone;
    private List<String> terrains;
    private String message;

    // Getters et Setters
    public String getNomClub() { return nomClub; }
    public void setNomClub(String nomClub) { this.nomClub = nomClub; }
    
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    
    public String getNomResponsable() { return nomResponsable; }
    public void setNomResponsable(String nomResponsable) { this.nomResponsable = nomResponsable; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public List<String> getTerrains() { return terrains; }
    public void setTerrains(List<String> terrains) { this.terrains = terrains; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}