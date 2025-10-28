package com.fieldz.service;


// DTO et Mapper
import com.fieldz.dto.NotificationDto;
import com.fieldz.mapper.NotificationMapper;

// Model
import com.fieldz.model.Notification;
import com.fieldz.model.Utilisateur;
import com.fieldz.model.Reservation;
import com.fieldz.model.TypeNotification;

// Repository
import com.fieldz.repository.NotificationRepository;
import com.fieldz.repository.UtilisateurRepository;

// Spring Security
import org.springframework.security.core.Authentication;

// Java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.fieldz.model.*;
import com.fieldz.repository.NotificationEnvoyeeRepository;
import com.fieldz.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final EmailService emailService;
    private final ReservationRepository reservationRepository;
    private final NotificationEnvoyeeRepository notificationEnvoyeeRepository;

    private final com.fieldz.repository.NotificationRepository notificationRepository;
    private final com.fieldz.mapper.NotificationMapper notificationMapper;


    private final UtilisateurRepository utilisateurRepository;

    private String formatDate(LocalDateTime dateTime) {
        return dateTime.toLocalDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    private String formatHeure(LocalDateTime dateTime) {
        return dateTime.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));
    }



    public void envoyerEmailAnnulationCreneau(String destinataire, Creneau creneau) {
        String sujet = "Créneau annulé par le club";
        String contenu = String.format(
                """
                Bonjour,
    
                Le créneau prévu le %s à %s a été annulé par le club %s.
    
                Terrain : %s
    
                Nous vous prions de nous excuser pour la gêne occasionnée.
    
                L'équipe FIELDZ
                """,
                creneau.getDateDebut().toLocalDate(),
                creneau.getDateDebut().toLocalTime() + " - " + creneau.getDateFin().toLocalTime(),
                creneau.getTerrain().getClub().getNom(),
                creneau.getTerrain().getNomTerrain()
        );

        emailService.envoyerEmail(destinataire, sujet, contenu);
    }



    public void envoyerEmailConfirmationReservation(String destinataire, Creneau creneau) {
        String sujet = "✅ Confirmation de réservation FIELDZ";
        String contenu = String.format(
                """
                Bonjour,
    
                Votre réservation a été confirmée avec succès.
    
                🗓️ Date : %s
                🕒 Heure : %s - %s
                🏟️ Terrain : %s (Club : %s)
    
                Merci d'utiliser FIELDZ, et à bientôt sur le terrain !
    
                Sportivement,
                L'équipe FIELDZ
                """,
                creneau.getDateDebut().toLocalDate(),
                creneau.getDateDebut().toLocalTime(),
                creneau.getDateFin().toLocalTime(),
                creneau.getTerrain().getNomTerrain(),
                creneau.getTerrain().getClub().getNom()
        );

        emailService.envoyerEmail(destinataire, sujet, contenu);
    }


    public void envoyerRappels2hAvant() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime target = now.plusHours(2);

        // 🔎 Ne récupère que les réservations valides pour un rappel
        List<Reservation> reservations =
                reservationRepository.findUpcomingWithCreneauBetween(now, target, Statut.RESERVE);

        for (Reservation r : reservations) {
            // Anti-doublon
            boolean dejaEnvoye = notificationEnvoyeeRepository
                    .findByReservationIdAndType(r.getId(), "RAPPEL_2H")
                    .isPresent();
            if (dejaEnvoye) continue;

            // Sécurité supplémentaire (au cas où)
            Creneau c = r.getCreneau();
            if (c == null) continue;

            Joueur joueur = r.getJoueur();

            String sujet = "⏰ Rappel : Créneau à venir bientôt";
            String contenu = String.format("""
                Bonjour %s,

                Ceci est un rappel : vous avez une réservation dans moins de 2h.

                📅 Date : %s
                🕓 Heure : %s - %s
                🏟️ Terrain : %s (Club : %s)

                À tout de suite sur le terrain !
                L'équipe FIELDZ
                """,
                    joueur != null ? joueur.getPrenom() : "",
                    c.getDateDebut().toLocalDate(),
                    c.getDateDebut().toLocalTime(),
                    c.getDateFin().toLocalTime(),
                    c.getTerrain().getNomTerrain(),
                    c.getTerrain().getClub().getNom()
            );

            emailService.envoyerEmail(joueur.getEmail(), sujet, contenu);

            notificationEnvoyeeRepository.save(
                    new NotificationEnvoyee(null, r.getId(), "RAPPEL_2H", LocalDateTime.now())
            );

            log.info("✅ Email de rappel envoyé à {}", joueur.getEmail());
        }
    }




    // Nécessaire pour récupérer les notifs de l'utilisateur connecté
    public List<NotificationDto> getMyNotifications(Authentication auth) {
        Utilisateur u = utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return notificationRepository.findByDestinataireOrderByDateEnvoiDesc(u)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }


    // Nécessaire pour marquer une notification comme lue
    public void marquerCommeLue(Long id, Authentication auth) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        if (!notif.getDestinataire().getEmail().equals(auth.getName())) {
            throw new RuntimeException("Accès interdit");
        }

        notif.setLue(true);
        notificationRepository.save(notif);
    }

    public void envoyerEmailAuClubReservation(Club club, Joueur joueur, Creneau creneau) {
        String sujet = "📢 Nouvelle réservation FIELDZ";
        String contenu = String.format(
                """
                Bonjour %s,
    
                Un joueur vient de réserver un créneau dans votre club.
    
                👤 Joueur : %s %s
                📅 Date : %s
                🕒 Heure : %s - %s
                🏟️ Terrain : %s
    
                Connectez-vous à votre espace FIELDZ pour plus de détails.
    
                Sportivement,
                L’équipe FIELDZ
                """,
                club.getNom(),
                joueur.getPrenom(), joueur.getNom(),
                creneau.getDateDebut().toLocalDate(),
                creneau.getDateDebut().toLocalTime(),
                creneau.getDateFin().toLocalTime(),
                creneau.getTerrain().getNomTerrain()
        );

        emailService.envoyerEmail(club.getEmail(), sujet, contenu);
    }

    public void envoyerEmailAuClubAnnulation(Club club, Joueur joueur, Creneau creneau) {
        String sujet = "❌ Annulation de réservation FIELDZ";
        String contenu = String.format(
                """
                Bonjour %s,
    
                Le joueur suivant a annulé sa réservation :
    
                👤 Joueur : %s %s
                📅 Date : %s
                🕒 Heure : %s - %s
                🏟️ Terrain : %s
    
                Le créneau a été libéré automatiquement.
    
                Sportivement,
                L’équipe FIELDZ
                """,
                club.getNom(),
                joueur.getPrenom(), joueur.getNom(),
                creneau.getDateDebut().toLocalDate(),
                creneau.getDateDebut().toLocalTime(),
                creneau.getDateFin().toLocalTime(),
                creneau.getTerrain().getNomTerrain()
        );

        emailService.envoyerEmail(club.getEmail(), sujet, contenu);
    }


    public void envoyerEmailAuClubAnnulation(Utilisateur club, Joueur joueur, Creneau creneau) {
        if (club == null || joueur == null || creneau == null) return;

        String sujet = "❌ Annulation d'une réservation par un joueur";
        Club clubCast = (Club) club;
        String contenu = String.format(
                "Bonjour %s,\n\nLe joueur %s %s a annulé sa réservation...",
                clubCast.getNom(),
                joueur.getPrenom(), joueur.getNom(),
                creneau.getTerrain().getNomTerrain(),
                formatDate(creneau.getDateDebut()),
                formatHeure(creneau.getDateDebut()),
                formatHeure(creneau.getDateFin())
        );

        try {
            emailService.envoyerEmail(club.getEmail(), sujet, contenu);
        } catch (Exception e) {
            log.warn("Erreur lors de l'envoi d'un email d'annulation au club : {}", e.getMessage());
        }
    }

    public void envoyerEmailConfirmationPresence(String email, Creneau creneau) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm");
        String date = creneau.getDateDebut().format(formatter);

        String sujet = "🎾 Votre présence a été confirmée";
        String message = "Votre présence au créneau du " + date + " a été confirmée par le club.";

        emailService.envoyerEmail(email, sujet, message);
    }

    // 🔔 Notifier (in-app) + email lorsqu'une réservation est annulée par le club
    public void notifierAnnulationReservationParClub(Reservation r, String motif) {
        if (r == null || r.getJoueur() == null) return;

        // 1) Email
        try {
            if (r.getCreneau() != null) {
                envoyerEmailAnnulationCreneau(r.getJoueur().getEmail(), r.getCreneau());
            }
        } catch (Exception e) {
            log.warn("Échec envoi email annulation (club) pour réservation {}: {}", r.getId(), e.getMessage());
        }

        // 2) Notification in-app
        try {
            Notification notif = new Notification();
            notif.setDestinataire(r.getJoueur());
            notif.setType(TypeNotification.ANNULATION); // ✅ ton enum
            notif.setDateEnvoi(LocalDateTime.now());
            notif.setLue(false);

            String titre = "Réservation annulée par le club";
            String contenu;
            if (r.getCreneau() != null) {
                var c = r.getCreneau();
                contenu = String.format(
                        "Votre réservation a été annulée par le club%s\n\n" +
                                "Date : %s\nHeure : %s - %s\nTerrain : %s",
                        (motif != null && !motif.isBlank() ? " : " + motif : "."),
                        c.getDateDebut().toLocalDate(),
                        c.getDateDebut().toLocalTime(),
                        c.getDateFin().toLocalTime(),
                        c.getTerrain().getNomTerrain()
                );
            } else {
                contenu = "Votre réservation a été annulée par le club."
                        + (motif != null && !motif.isBlank() ? " Motif : " + motif : "");
            }

            // Adapte aux champs réels de ta classe Notification
            try { notif.getClass().getMethod("setTitre", String.class).invoke(notif, titre); } catch (Exception ignored) {}
            try { notif.getClass().getMethod("setContenu", String.class).invoke(notif, contenu); } catch (Exception ignored) {}
            try { notif.getClass().getMethod("setMessage", String.class).invoke(notif, contenu); } catch (Exception ignored) {}

            notificationRepository.save(notif);
        } catch (Exception e) {
            log.warn("Échec création notification in-app (annulation club) pour réservation {}: {}", r.getId(), e.getMessage());
        }
    }

    public void notifierAbsenceReservationParClub(Reservation r, String motif) {
        if (r == null || r.getJoueur() == null) return;

        final Joueur joueur = r.getJoueur();
        final Creneau c = r.getCreneau();

        // --- 1) Email au joueur
        try {
            if (c != null) {
                String sujet = "🚫 Absence constatée – FIELDZ";
                String contenu = String.format(
                        """
                        Bonjour %s,
    
                        Le club a signalé votre absence (no-show) sur la réservation suivante :
    
                        📅 Date : %s
                        🕒 Heure : %s - %s
                        🏟️ Terrain : %s (Club : %s)
                        %s
    
                        Si vous pensez qu’il s’agit d’une erreur, contactez le club au plus vite.
    
                        L’équipe FIELDZ
                        """,
                        joueur.getPrenom() != null ? joueur.getPrenom() : "",
                        formatDate(c.getDateDebut()),
                        formatHeure(c.getDateDebut()),
                        formatHeure(c.getDateFin()),
                        c.getTerrain() != null ? c.getTerrain().getNomTerrain() : "Terrain",
                        (c.getTerrain() != null && c.getTerrain().getClub() != null) ? c.getTerrain().getClub().getNom() : "Club",
                        (motif != null && !motif.isBlank()) ? ("\nMotif : " + motif) : ""
                );

                emailService.envoyerEmail(joueur.getEmail(), sujet, contenu);
            }
        } catch (Exception e) {
            log.warn("Échec envoi email ABSENCE pour réservation {}: {}", r.getId(), e.getMessage());
        }

        // --- 2) Notification in-app au joueur
        try {
            Notification notif = new Notification();
            notif.setDestinataire(joueur);
            notif.setType(TypeNotification.ABSENCE);           // 👈 nouveau type
            notif.setDateEnvoi(LocalDateTime.now());
            notif.setLue(false);

            String titre = "Absence marquée par le club";
            String contenu;
            if (c != null) {
                contenu = String.format(
                        "Le club a signalé une absence sur votre réservation.\n\nDate : %s\nHeure : %s - %s\nTerrain : %s%s",
                        formatDate(c.getDateDebut()),
                        formatHeure(c.getDateDebut()),
                        formatHeure(c.getDateFin()),
                        (c.getTerrain() != null ? c.getTerrain().getNomTerrain() : "Terrain"),
                        (motif != null && !motif.isBlank() ? "\nMotif : " + motif : "")
                );
            } else {
                contenu = "Le club a signalé une absence sur votre réservation."
                        + (motif != null && !motif.isBlank() ? " Motif : " + motif : "");
            }

            // tes entités Notification semblent variables : on garde la même technique que chez toi
            try { notif.getClass().getMethod("setTitre", String.class).invoke(notif, titre); } catch (Exception ignored) {}
            try { notif.getClass().getMethod("setContenu", String.class).invoke(notif, contenu); } catch (Exception ignored) {}
            try { notif.getClass().getMethod("setMessage", String.class).invoke(notif, contenu); } catch (Exception ignored) {}

            notificationRepository.save(notif);
        } catch (Exception e) {
            log.warn("Échec création notification in-app ABSENCE pour réservation {}: {}", r.getId(), e.getMessage());
        }
    }

    /** Overload pratique si pas de motif à fournir. */
    public void notifierAbsenceReservationParClub(Reservation r) {
        notifierAbsenceReservationParClub(r, null);
    }



}
