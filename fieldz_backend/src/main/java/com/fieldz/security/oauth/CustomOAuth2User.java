package com.fieldz.security.oauth;

import com.fieldz.model.Utilisateur;
import lombok.Getter;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;


@Getter
public class CustomOAuth2User implements OAuth2User {

    private final Utilisateur utilisateur;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(Utilisateur utilisateur, Map<String, Object> attributes) {
        this.utilisateur = utilisateur;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return utilisateur.getAuthorities();
    }


    @Override
    public String getName() {
        return utilisateur.getEmail();
    }
}
