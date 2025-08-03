package com.fieldz.scheduler;

import com.fieldz.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationService notificationService;

    // Toutes les 5 minutes
    @Scheduled(fixedRate = 300000)
    public void runRappels() {
        log.info("🔄 Vérification des rappels 2h avant...");
        notificationService.envoyerRappels2hAvant();
    }
}
