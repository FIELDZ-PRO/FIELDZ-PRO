package com.fieldz.controller;

import com.fieldz.dto.NotificationDto;
import com.fieldz.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/mine")
    public List<NotificationDto> getMyNotifications(Authentication auth) {
        return service.getMyNotifications(auth);
    }

    @PutMapping("/{id}/read")
    public void marquerCommeLue(@PathVariable Long id, Authentication auth) {
        service.marquerCommeLue(id, auth);
    }
}
