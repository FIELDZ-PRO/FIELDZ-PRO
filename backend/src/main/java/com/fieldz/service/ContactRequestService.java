package com.fieldz.service;

import com.fieldz.dto.ContactRequestDto;
import com.fieldz.model.ContactRequest;
import com.fieldz.repository.ContactRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository repository;
    private final EmailService emailService;

    // Configurables via application.properties
    @Value("${fieldz.contact.rateLimit.max:2}")
    private int maxPerWindow;

    @Value("${fieldz.contact.rateLimit.windowHours:24}")
    private int windowHours;

    @Transactional
    public ContactRequest createAndNotify(ContactRequestDto dto) {
        // normaliser l'email pour les comparaisons
        String emailNorm = dto.getEmail().trim().toLowerCase();

        // rate-limit: max N requêtes dans la fenêtre
        LocalDateTime after = LocalDateTime.now().minusHours(windowHours);
        long count = repository.countByEmailIgnoreCaseAndCreatedAtAfter(emailNorm, after);
        if (count >= maxPerWindow) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Vous avez déjà envoyé " + maxPerWindow + " demande(s) au cours des dernières " + windowHours + " heures."
            );
        }

        ContactRequest entity = ContactRequest.builder()
                .nomClub(dto.getNomClub().trim())
                .ville(dto.getVille().trim())
                .nomResponsable(dto.getNomResponsable().trim())
                .email(emailNorm) // stocker normalisé
                .telephone(dto.getTelephone().trim())
                .sports(dto.getSports())
                .message(dto.getMessage())
                .statut("NEW")
                .build();

        ContactRequest saved = repository.save(entity);

        String subject = "Nouvelle demande de contact FIELDZ — " + saved.getNomClub();
        String html = buildHtml(saved);

        // Destinataire + reply-to = l’email saisi
        String to = "contact.fieldz@gmail.com";
        emailService.sendHtml(to, subject, html, saved.getEmail());

        return saved;
    }

private String buildHtml(ContactRequest cr) {
        String sportsList = String.join(", ", cr.getSports().stream().map(Enum::name).toList());
        String msg = (cr.getMessage() == null || cr.getMessage().isBlank()) ? "<i>(Aucun message)</i>" : cr.getMessage();

        return """
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;">
                  <h2 style="margin:0 0 12px 0;">Nouvelle demande de contact</h2>
                  <p><b>Nom du club :</b> %s</p>
                  <p><b>Ville :</b> %s</p>
                  <p><b>Responsable :</b> %s</p>
                  <p><b>Email :</b> %s</p>
                  <p><b>Téléphone :</b> %s</p>
                  <p><b>Sports :</b> %s</p>
                  <p><b>Message :</b><br/>%s</p>
                  <hr/>
                  <p style="color:#666;">Reçue le %s</p>
                </div>
                """.formatted(
                escape(cr.getNomClub()),
                escape(cr.getVille()),
                escape(cr.getNomResponsable()),
                escape(cr.getEmail()),
                escape(cr.getTelephone()),
                escape(sportsList),
                msg.replace("\n", "<br/>"),
                cr.getCreatedAt() == null ? "—" : cr.getCreatedAt().toString()
        );
    }

    /** Petite échappatoire simple pour éviter l'injection HTML basique */
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&","&amp;")
                .replace("<","&lt;")
                .replace(">","&gt;")
                .replace("\"","&quot;")
                .replace("'","&#39;");
    }
}
