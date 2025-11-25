package com.fieldz.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

// Service de Cloud qui gère les upload cela peut servir plus tard.

// CHECK : Pendant les tests juste voir si les images persistent et qu'on peut les récupérer 2-3 jours après par exemple

@Service
public class CloudService {

    private final Cloudinary cloudinary;

    public CloudService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "clubs_images"));
        return uploadResult.get("secure_url").toString(); // ✅ Permanent URL
    }

    public String uploadClubImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "clubs_images"));
        return uploadResult.get("secure_url").toString(); // ✅ Permanent URL
    }

    public void deleteImage(String imageUrl) throws IOException {
        // Extraire le public_id de l'URL Cloudinary
        String publicId = extractPublicId(imageUrl);
        if (publicId != null) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    private String extractPublicId(String imageUrl) {
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }
        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length > 1) {
                String pathAfterUpload = parts[1];
                // Retirer la version (v123456789/) si présente
                if (pathAfterUpload.contains("/")) {
                    String[] pathParts = pathAfterUpload.split("/", 2);
                    if (pathParts.length > 1) {
                        String publicIdWithExtension = pathParts[1];
                        // Retirer l'extension
                        int lastDot = publicIdWithExtension.lastIndexOf('.');
                        return lastDot > 0 ? publicIdWithExtension.substring(0, lastDot) : publicIdWithExtension;
                    }
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}
