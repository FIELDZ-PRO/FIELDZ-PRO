package com.fieldz.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fieldz.service.CloudService;

import lombok.RequiredArgsConstructor;

// Ici j'ai créer Un endpoint spécialement pour les updload d'images cela te renvoie directement un lien pour l'image sauvgarder

@RestController
@RequestMapping("/api/upload-cloud")
@RequiredArgsConstructor
public class CloudController {

    @Autowired
    private final CloudService cloudService;

    @PostMapping
    @PreAuthorize("hasRole('CLUB')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Upload de l'image a cloudinary service
            String imageUrl = cloudService.uploadFile(file);

            // Retour de l'image à cloudinary service
            return ResponseEntity.ok(Map.of("url", imageUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

}
