package com.fieldz.service;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        // Uses frontend URL from configuration (env var FRONTEND_URL or application.yml)
        String resetLink = frontendUrl + "/reset-password?token=" + token;

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

    /** Send OTP verification code email */
    public void sendOtpEmail(String toEmail, String code) {
        String html = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; letter-spacing: 8px; margin: 30px 0; padding: 20px; background-color: #fff; border: 2px dashed #4CAF50; border-radius: 5px; }
                    .warning { color: #ff6b6b; font-size: 14px; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>⚽ FIELDZ - Vérification Email</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour,</h2>
                        <p>Merci de vous être inscrit sur FIELDZ ! Pour finaliser votre inscription, veuillez utiliser le code de vérification ci-dessous :</p>
                        <div class="otp-code">%s</div>
                        <p><strong>Ce code est valable pendant 5 minutes.</strong></p>
                        <p>Vous disposez de 5 tentatives maximum pour entrer le bon code.</p>
                        <p class="warning">⚠️ Si vous n'avez pas demandé ce code, ignorez cet email.</p>
                    </div>
                    <div class="footer">
                        <p>Cordialement,<br>L'équipe FIELDZ</p>
                    </div>
                </div>
            </body>
            </html>
            """, code);

        sendHtml(toEmail, "FIELDZ - Code de vérification", html);
    }
}
