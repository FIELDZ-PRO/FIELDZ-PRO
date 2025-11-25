package com.fieldz.service;


import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String token) {
        // Pour test en local sur PC
        // String resetLink = "http://localhost:5173/reset-password?token=" + token;
        // Pour tester en local sur le réseaux
        String resetLink = "http://192.168.100.16:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("contact.fieldz@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Réinitialisation de votre mot de passe");
        message.setText(
                "Bonjour,\n\n" +
                        "Vous avez demandé une réinitialisation de mot de passe.\n" +
                        "Cliquez sur ce lien pour continuer : " + resetLink +
                        "\n\n⚠️ Ce lien est valable pendant 30 minutes." +
                        "\n\nCordialement,\nL'équipe FIELDZ");

        mailSender.send(message);
    }

    public void sendPasswordChangeConfirmation(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("contact.fieldz@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Votre mot de passe a été modifié");
        message.setText(
                "Bonjour,\n\nVotre mot de passe a bien été modifié. Si ce n'était pas vous, veuillez contacter notre support immédiatement.\n\nCordialement,\nL'équipe FIELDZ");

        mailSender.send(message);
    }

    public void envoyerEmail(String toEmail, String sujet, String contenu) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("contact.fieldz@gmail.com");
        message.setTo(toEmail);
        message.setSubject(sujet);
        message.setText(contenu);

        mailSender.send(message);
    }

    /** ✅ Envoi HTML (utilisé par ContactRequestService) */
    public void sendHtml(String toEmail, String subject, String html) {
        sendHtml(toEmail, subject, html, null);
    }

    /** Envoi HTML avec Reply-To (utile pour répondre directement au responsable) */
    public void sendHtml(String toEmail, String subject, String html, String replyTo) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, "UTF-8");
            helper.setFrom("contact.fieldz@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(html, true); // HTML
            if (replyTo != null && !replyTo.isBlank()) {
                helper.setReplyTo(replyTo);
            }
            mailSender.send(mime);
        } catch (Exception e) {
            throw new RuntimeException("Erreur d'envoi d'email HTML : " + e.getMessage(), e);
        }
    }
}
