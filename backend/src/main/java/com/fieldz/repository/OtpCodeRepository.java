package com.fieldz.repository;

import com.fieldz.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    /**
     * Find all active (non-verified, non-expired) OTP codes for an email
     */
    List<OtpCode> findByEmailAndVerifiedFalseAndExpiresAtAfter(String email, LocalDateTime now);

    /**
     * Find a specific OTP code by email and code value
     */
    Optional<OtpCode> findByEmailAndCode(String email, String code);

    /**
     * Delete expired OTP codes (for cleanup)
     */
    void deleteByExpiresAtBefore(LocalDateTime now);
}
