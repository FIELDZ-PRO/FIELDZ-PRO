package com.fieldz.security.oauth;

import com.fieldz.model.Utilisateur;
import com.fieldz.model.Role;
import com.fieldz.model.Joueur;
import com.fieldz.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.UUID;


import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String email = oAuth2User.getAttribute("email");
        String nom = oAuth2User.getAttribute("name");

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseGet(() -> {
                    Joueur newJoueur = Joueur.builder()
                            .email(email)
                            .nom(nom)
                            .typeRole(Role.JOUEUR)
                            .profilComplet(false)
                            .motDePasse(UUID.randomUUID().toString()) // ✅ chaîne unique à chaque user Google
                            .build();
                    return utilisateurRepository.save(newJoueur);
                });

        return new CustomOAuth2User(utilisateur, oAuth2User.getAttributes());
    }

}
