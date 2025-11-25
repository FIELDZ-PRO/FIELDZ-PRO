package com.fieldz.security.jwt;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class KeyLoader {

    private static String readAll(InputStream is) throws Exception {
        byte[] bytes = is.readAllBytes();
        // supprime BOM UTF-8 éventuel
        String txt = new String(bytes, StandardCharsets.UTF_8);
        if (txt.startsWith("\uFEFF")) txt = txt.substring(1);
        return txt;
    }

    private static String loadPemText(String path) throws Exception {
        // 1) classpath
        try {
            var r = new ClassPathResource(path);
            if (r.exists()) {
                try (InputStream is = r.getInputStream()) {
                    System.out.println("[KeyLoader] Loaded from classpath: " + path);
                    return readAll(is);
                }
            } else {
                System.out.println("[KeyLoader] Not found on classpath: " + path);
            }
        } catch (Exception e) {
            System.out.println("[KeyLoader] Classpath read error for " + path + ": " + e.getMessage());
        }
        // 2) filesystem (chemin absolu/relatif)
        try {
            var r = new FileSystemResource(path);
            if (r.exists()) {
                try (InputStream is = r.getInputStream()) {
                    System.out.println("[KeyLoader] Loaded from filesystem: " + r.getFile().getAbsolutePath());
                    return readAll(is);
                }
            } else {
                System.out.println("[KeyLoader] Not found on filesystem: " + path);
            }
        } catch (Exception e) {
            System.out.println("[KeyLoader] Filesystem read error for " + path + ": " + e.getMessage());
        }
        throw new IllegalStateException("PEM not found: " + path + " (classpath nor filesystem)");
    }

    public static PrivateKey loadPrivateKeyPem(String cpPath) {
        try {
            String pem = loadPemText(cpPath)
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");
            byte[] der = Base64.getDecoder().decode(pem);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(der);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(keySpec);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du chargement de la clé privée : " + cpPath, e);
        }
    }

    public static PublicKey loadPublicKeyPem(String cpPath) {
        try {
            String pem = loadPemText(cpPath)
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");
            byte[] der = Base64.getDecoder().decode(pem);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(der);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePublic(keySpec);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du chargement de la clé publique : " + cpPath, e);
        }
    }
}
