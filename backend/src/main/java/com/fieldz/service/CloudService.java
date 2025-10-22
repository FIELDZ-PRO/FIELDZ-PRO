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
                "folder", "clubs_banners"));
        return uploadResult.get("secure_url").toString(); // ✅ Permanent URL
    }
}
