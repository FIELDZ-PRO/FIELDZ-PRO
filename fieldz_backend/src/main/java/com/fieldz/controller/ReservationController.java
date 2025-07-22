package com.fieldz.controller;

import com.fieldz.dto.ReservationDto;
import com.fieldz.model.Reservation;
import com.fieldz.service.ReservationService;
import com.fieldz.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/creneau/{creneauId}")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<ReservationDto> reserver(@PathVariable Long creneauId, Authentication authentication) {
        Reservation reservation = reservationService.reserver(creneauId, authentication);
        return ResponseEntity.ok(ReservationMapper.toDto(reservation));
    }

    @GetMapping("/reservations")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<List<ReservationDto>> getReservationsDuClub(Authentication authentication) {
        List<Reservation> reservations = reservationService.getReservationsDuClub(authentication);
        List<ReservationDto> dtos = reservations.stream().map(ReservationMapper::toDto).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/mes")
    @PreAuthorize("hasRole('JOUEUR')")
    public ResponseEntity<List<ReservationDto>> mesReservations(Authentication authentication) {
        List<Reservation> reservations = reservationService.mesReservations(authentication);
        List<ReservationDto> dtos = reservations.stream()
                .map(ReservationMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{reservationId}")
    @PreAuthorize("hasAnyRole('JOUEUR', 'CLUB')")
    public ResponseEntity<String> annulerReservation(@PathVariable Long reservationId, Authentication authentication) {
        return ResponseEntity.ok(reservationService.annulerReservation(reservationId, authentication));
    }

    @PutMapping("/reservations/{id}/annuler")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<String> annulerReservationParClub(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(reservationService.annulerReservationParClub(id, authentication));
    }

    @GetMapping("/reservations/date")
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<List<ReservationDto>> getReservationsParDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate parsedDate,
            Authentication authentication) {
        List<Reservation> reservations = reservationService.getReservationsParDate(parsedDate, authentication);
        List<ReservationDto> dtos = reservations.stream().map(ReservationMapper::toDto).toList();
        return ResponseEntity.ok(dtos);
    }
}
