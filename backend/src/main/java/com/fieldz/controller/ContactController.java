package com.fieldz.controller;

import com.fieldz.dto.ContactRequestDto;
import com.fieldz.model.ContactRequest;
import com.fieldz.service.ContactRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactRequestService service;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ContactRequestDto dto) {
        ContactRequest saved = service.createAndNotify(dto);
        return ResponseEntity.status(201).body(new IdResponse(saved.getId()));
    }

    /** petite réponse JSON {"id": 123} */
    private record IdResponse(Long id) {}
}
