package com.fieldz.service;

import com.fieldz.model.OtpCode;
import com.fieldz.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpCodeRepository otpCodeRepository;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    /**
     * Generate a random 6-digit OTP code
     */
    private String generateOtpCode() {
        int code = 100000 + random.nextInt(900000); // 6-digit number
        return String.valueOf(code);
    }

    /**
     * Create and send a new OTP code to the user's email
     */
    @Transactional
    public void sendOtp(String email) {
        String code = generateOtpCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        OtpCode otpCode = OtpCode.builder()
                .email(email)
                .code(code)
                .expiresAt(expiresAt)
                .attempts(0)
                .verified(false)
                .build();

        otpCodeRepository.save(otpCode);

        // Send email with OTP
        emailService.sendOtpEmail(email, code);

        log.info("OTP sent to email: {} (expires at: {})", email, expiresAt);
    }

    /**
     * Resend OTP - creates a new code
     */
    @Transactional
    public void resendOtp(String email) {
        sendOtp(email); // Simply send a new OTP
        log.info("OTP resent to email: {}", email);
    }

    /**
     * Verify OTP code
     * Returns true if valid, false otherwise
     */
    @Transactional
    public boolean verifyOtp(String email, String code) {
        // Find all active OTP codes for this email
        List<OtpCode> activeCodes = otpCodeRepository
                .findByEmailAndVerifiedFalseAndExpiresAtAfter(email, LocalDateTime.now());

        if (activeCodes.isEmpty()) {
            log.warn("No active OTP found for email: {}", email);
            return false;
        }

        // Check if the provided code matches any active OTP
        for (OtpCode otpCode : activeCodes) {
            if (otpCode.getCode().equals(code)) {
                // Check if max attempts exceeded
                if (otpCode.getAttempts() >= MAX_ATTEMPTS) {
                    log.warn("Max attempts exceeded for OTP: {} (email: {})", otpCode.getId(), email);
                    return false;
                }

                // Code matches - mark as verified
                otpCode.setVerified(true);
                otpCodeRepository.save(otpCode);
                log.info("OTP verified successfully for email: {}", email);
                return true;
            } else {
                // Wrong code - increment attempts
                otpCode.setAttempts(otpCode.getAttempts() + 1);
                otpCodeRepository.save(otpCode);
                log.warn("Invalid OTP attempt for email: {} (attempts: {})", email, otpCode.getAttempts());
            }
        }

        return false;
    }

    /**
     * Check if email has a verified OTP
     */
    public boolean isEmailVerified(String email) {
        return otpCodeRepository.findByEmailAndCode(email, null)
                .stream()
                .anyMatch(OtpCode::getVerified);
    }

    /**
     * Clean up expired OTP codes (can be scheduled)
     */
    @Transactional
    public void cleanupExpiredOtps() {
        otpCodeRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Expired OTP codes cleaned up");
    }
}
