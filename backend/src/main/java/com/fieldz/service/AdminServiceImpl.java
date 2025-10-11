package com.fieldz.service;

import com.fieldz.dto.*;
import com.fieldz.mapper.AdminMapper;
import com.fieldz.model.*;
import com.fieldz.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {
    
    private final UtilisateurRepository utilisateurRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AdminServiceImpl(
            UtilisateurRepository utilisateurRepository,
            ReservationRepository reservationRepository,
            PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.reservationRepository = reservationRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public AdminStatsDto getStats() {
        // Compter les clubs
        Long totalClubs = utilisateurRepository.findAll().stream()
                .filter(u -> u.getTypeRole() == Role.CLUB)
                .count();
        
        // Compter les joueurs
        Long totalJoueurs = utilisateurRepository.findAll().stream()
                .filter(u -> u.getTypeRole() == Role.JOUEUR)
                .count();
        
        // Compter les réservations de la semaine
        LocalDateTime debutSemaine = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS).minusDays(7);
        Long reservationsHebdo = reservationRepository.findAll().stream()
                .filter(r -> r.getDateReservation() != null && 
                           r.getDateReservation().isAfter(debutSemaine))
                .count();
        
        return new AdminStatsDto(totalClubs, totalJoueurs, reservationsHebdo);
    }
    
    @Override
    public List<ClubAdminDto> getAllClubs() {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getTypeRole() == Role.CLUB)
                .filter(u -> u instanceof Club)
                .map(u -> {
                    Club club = (Club) u;
                    return AdminMapper.toClubAdminDto(club, u);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ClubAdminDto> searchClubs(String query) {
        String lowerQuery = query.toLowerCase();
        return getAllClubs().stream()
                .filter(club -> 
                    (club.getNomClub() != null && club.getNomClub().toLowerCase().contains(lowerQuery)) ||
                    (club.getVille() != null && club.getVille().toLowerCase().contains(lowerQuery)) ||
                    (club.getAdresse() != null && club.getAdresse().toLowerCase().contains(lowerQuery))
                )
                .collect(Collectors.toList());
    }
    
    @Override
    public ClubAdminDto getClubDetails(Long clubId) {
        Utilisateur utilisateur = utilisateurRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club non trouvé"));
        
        if (!(utilisateur instanceof Club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club");
        }
        
        Club club = (Club) utilisateur;
        return AdminMapper.toClubAdminDto(club, utilisateur);
    }
    
    @Override
    @Transactional
    public ClubAdminDto createClub(CreateClubRequest request) {
        // Vérifier si l'email existe déjà
        if (utilisateurRepository.findByEmail(request.getEmailResponsable()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        
        // Générer les identifiants
        String login = request.getEmailResponsable();
        String password = generatePassword(request.getNomClub());
        
        // Créer le club
        Club club = new Club();
        club.setNom(request.getNomResponsable());
        club.setNomClub(request.getNomClub());
        club.setEmail(request.getEmailResponsable());
        club.setMotDePasse(passwordEncoder.encode(password));
        club.setTypeRole(Role.CLUB);
        club.setAdresse(request.getAdresse());
        club.setTelephone(request.getTelephone());
        club.setDateInscription(LocalDateTime.now());
        club.setProfilComplet(false);
        
        // Sauvegarder
        Club savedClub = (Club) utilisateurRepository.save(club);
        
        // Retourner le DTO avec le mot de passe en clair (uniquement à la création)
        ClubAdminDto dto = AdminMapper.toClubAdminDto(savedClub, savedClub);
        dto.setPassword(password); // Mot de passe temporaire à communiquer au club
        
        return dto;
    }
    
    @Override
    public List<JoueurAdminDto> getAllJoueurs() {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getTypeRole() == Role.JOUEUR)
                .filter(u -> u instanceof Joueur)
                .map(u -> {
                    Joueur joueur = (Joueur) u;
                    return AdminMapper.toJoueurAdminDto(joueur);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public List<JoueurAdminDto> searchJoueurs(String query) {
        String lowerQuery = query.toLowerCase();
        return getAllJoueurs().stream()
                .filter(joueur -> 
                    (joueur.getNom() != null && joueur.getNom().toLowerCase().contains(lowerQuery)) ||
                    (joueur.getPrenom() != null && joueur.getPrenom().toLowerCase().contains(lowerQuery)) ||
                    (joueur.getEmail() != null && joueur.getEmail().toLowerCase().contains(lowerQuery))
                )
                .collect(Collectors.toList());
    }
    
    @Override
    public JoueurAdminDto getJoueurDetails(Long joueurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        
        if (!(utilisateur instanceof Joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur");
        }
        
        Joueur joueur = (Joueur) utilisateur;
        return AdminMapper.toJoueurAdminDto(joueur);
    }
    
    @Override
    @Transactional
    public JoueurAdminDto toggleJoueurStatus(Long joueurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        
        if (!(utilisateur instanceof Joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur");
        }
        
        Joueur joueur = (Joueur) utilisateur;
        
        // Toggle du statut actif (vous pouvez ajouter un champ 'actif' dans Joueur si nécessaire)
        // Pour l'instant, on utilise le système de blocage de compte
        if (joueur.getAccountBlockedUntil() != null && 
            joueur.getAccountBlockedUntil().isAfter(LocalDateTime.now())) {
            // Débloquer le compte
            joueur.setAccountBlockedUntil(null);
            joueur.setFailedLoginAttempts(0);
        } else {
            // Bloquer le compte (blocage permanent)
            joueur.setAccountBlockedUntil(LocalDateTime.now().plusYears(100));
        }
        
        utilisateurRepository.save(joueur);
        return AdminMapper.toJoueurAdminDto(joueur);
    }
    
    // Méthode utilitaire pour générer un mot de passe
    private String generatePassword(String nomClub) {
        String cleanName = nomClub.toLowerCase()
                .replaceAll("\\s+", "")
                .replaceAll("[^a-z0-9]", "");
        return cleanName + "2025";
    }
}