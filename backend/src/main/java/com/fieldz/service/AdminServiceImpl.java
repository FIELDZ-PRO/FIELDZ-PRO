package com.fieldz.service;

import com.fieldz.auth.RegisterRequest;
import com.fieldz.dto.AdminStatsDto;
import com.fieldz.dto.ClubAdminDto;
import com.fieldz.dto.CreateClubRequest;
import com.fieldz.dto.JoueurAdminDto;
import com.fieldz.mapper.AdminMapper;
import com.fieldz.model.Club;
import com.fieldz.model.Joueur;
import com.fieldz.model.Role;
import com.fieldz.model.Utilisateur;
import com.fieldz.model.Sport;
import com.fieldz.repository.ReservationRepository;
import com.fieldz.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(UtilisateurRepository utilisateurRepository,
                            ReservationRepository reservationRepository,
                            PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.reservationRepository = reservationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================== STATS ==================
    @Override
public AdminStatsDto getStats() {
    // Total actuel
    long totalClubs = utilisateurRepository.findAll().stream()
            .filter(u -> u.getTypeRole() == Role.CLUB)
            .count();

    long totalJoueurs = utilisateurRepository.findAll().stream()
            .filter(u -> u.getTypeRole() == Role.JOUEUR)
            .count();

    // Réservations de la semaine
    LocalDateTime debutSemaine = LocalDateTime.now()
            .truncatedTo(ChronoUnit.DAYS)
            .minusDays(7);

    long reservationsHebdo = reservationRepository.findAll().stream()
            .filter(r -> r.getDateReservation() != null && r.getDateReservation().isAfter(debutSemaine))
            .count();

    // ========== NOUVEAU : CALCUL DE CROISSANCE ==========
    
    // Début du mois en cours
    LocalDateTime debutMoisActuel = LocalDateTime.now()
            .withDayOfMonth(1)
            .withHour(0)
            .withMinute(0)
            .withSecond(0)
            .withNano(0);

    // Clubs créés ce mois
    long clubsCeMois = utilisateurRepository.findAll().stream()
            .filter(u -> u.getTypeRole() == Role.CLUB)
            .filter(u -> u.getDateInscription() != null && u.getDateInscription().isAfter(debutMoisActuel))
            .count();

    // Joueurs inscrits ce mois
    long joueursCeMois = utilisateurRepository.findAll().stream()
            .filter(u -> u.getTypeRole() == Role.JOUEUR)
            .filter(u -> u.getDateInscription() != null && u.getDateInscription().isAfter(debutMoisActuel))
            .count();

    // Calcul des pourcentages
    double croissanceClubs = calculerPourcentageCroissance(totalClubs, clubsCeMois);
    double croissanceJoueurs = calculerPourcentageCroissance(totalJoueurs, joueursCeMois);

    // ⬇️ MODIFIER CE RETURN POUR INCLURE LES 2 NOUVELLES VALEURS
    return new AdminStatsDto(
            totalClubs, 
            totalJoueurs, 
            reservationsHebdo,
            croissanceClubs,      // NOUVEAU
            croissanceJoueurs     // NOUVEAU
    );
}

    // ================== CLUBS ==================
    @Override
    public List<ClubAdminDto> getAllClubs() {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getTypeRole() == Role.CLUB)
                .filter(u -> u instanceof Club)
                .map(u -> AdminMapper.toClubAdminDto((Club) u, u))
                .collect(Collectors.toList());
    }

    @Override
    public List<ClubAdminDto> searchClubs(String query) {
        String q = query.toLowerCase(Locale.ROOT);
        return getAllClubs().stream()
                .filter(c ->
                        (c.getNom() != null && c.getNom().toLowerCase(Locale.ROOT).contains(q)) ||
                                (c.getVille() != null && c.getVille().toLowerCase(Locale.ROOT).contains(q)) ||
                                (c.getAdresse() != null && c.getAdresse().toLowerCase(Locale.ROOT).contains(q))
                )
                .collect(Collectors.toList());
    }

    @Override
    public ClubAdminDto getClubDetails(Long clubId) {
        Utilisateur u = utilisateurRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club non trouvé"));
        if (!(u instanceof Club club)) {
            throw new RuntimeException("L'utilisateur n'est pas un club");
        }
        return AdminMapper.toClubAdminDto(club, u);
    }

    @Override
    @Transactional
    public ClubAdminDto createClub(CreateClubRequest request) {
        if (request.getEmailResponsable() == null || request.getEmailResponsable().isBlank()) {
            throw new RuntimeException("Email responsable requis");
        }
        if (utilisateurRepository.findByEmail(request.getEmailResponsable()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        if (request.getNom() == null || request.getNom().isBlank()) {
            throw new RuntimeException("Le nom du club est requis");
        }

        // Génération d'un mot de passe provisoire basé sur le nom du club
        String rawPassword = generatePassword(request.getNom());

        Club club = new Club();
        club.setNom(request.getNom()); // <-- uniquement "nom"
        club.setEmail(request.getEmailResponsable());
        club.setMotDePasse(passwordEncoder.encode(rawPassword));
        club.setTypeRole(Role.CLUB);
        club.setAdresse(request.getAdresse());
        club.setTelephone(request.getTelephone());
        club.setVille(request.getVille());
        club.setDateInscription(LocalDateTime.now());
        club.setProfilComplet(false);

        // Map du champ libre "sport" -> Set<Sport> (optionnel)
        if (request.getSport() != null && !request.getSport().isBlank()) {
            String val = request.getSport().trim().toUpperCase(Locale.ROOT).replace(' ', '_');
            try {
                club.setSports(Set.of(Sport.valueOf(val))); // ex: "PADEL", "FOOT_5"
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Sport inconnu: " + request.getSport());
            }
        }

        Club saved = utilisateurRepository.save(club);

        ClubAdminDto dto = AdminMapper.toClubAdminDto(saved, saved);
        dto.setPassword(rawPassword); // exposé UNIQUEMENT à la création
        return dto;
    }

    // ================== JOUEURS ==================
    @Override
    public List<JoueurAdminDto> getAllJoueurs() {
        return utilisateurRepository.findAll().stream()
                .filter(u -> u.getTypeRole() == Role.JOUEUR)
                .filter(u -> u instanceof Joueur)
                .map(u -> AdminMapper.toJoueurAdminDto((Joueur) u))
                .collect(Collectors.toList());
    }

    @Override
    public List<JoueurAdminDto> searchJoueurs(String query) {
        String q = query.toLowerCase(Locale.ROOT);
        return getAllJoueurs().stream()
                .filter(j ->
                        (j.getNom() != null && j.getNom().toLowerCase(Locale.ROOT).contains(q)) ||
                                (j.getPrenom() != null && j.getPrenom().toLowerCase(Locale.ROOT).contains(q)) ||
                                (j.getEmail() != null && j.getEmail().toLowerCase(Locale.ROOT).contains(q))
                )
                .collect(Collectors.toList());
    }

    @Override
    public JoueurAdminDto getJoueurDetails(Long joueurId) {
        Utilisateur u = utilisateurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        if (!(u instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur");
        }
        return AdminMapper.toJoueurAdminDto(joueur);
    }

    @Override
    @Transactional
    public JoueurAdminDto toggleJoueurStatus(Long joueurId) {
        Utilisateur u = utilisateurRepository.findById(joueurId)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé"));
        if (!(u instanceof Joueur joueur)) {
            throw new RuntimeException("L'utilisateur n'est pas un joueur");
        }

        if (joueur.getAccountBlockedUntil() != null &&
                joueur.getAccountBlockedUntil().isAfter(LocalDateTime.now())) {
            // Déblocage
            joueur.setAccountBlockedUntil(null);
            joueur.setFailedLoginAttempts(0);
        } else {
            // Blocage "long"
            joueur.setAccountBlockedUntil(LocalDateTime.now().plusYears(100));
        }

        utilisateurRepository.save(joueur);
        return AdminMapper.toJoueurAdminDto(joueur);
    }

    // ================== UTILS ==================
    private String generatePassword(String nom) {
        String clean = nom.toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", "")
                .replaceAll("[^a-z0-9]", "");
        return clean + "2025";
    }
    /**
    * Calcule le pourcentage de croissance
    */
    private double calculerPourcentageCroissance(long total, long nouveaux) {
    if (total == 0 || nouveaux == 0) return 0.0;
    return Math.round((nouveaux * 100.0 / total) * 10.0) / 10.0;
    }
    @Override
    @Transactional
    public JoueurAdminDto createJoueur(RegisterRequest request) {
        // Validation
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email requis");
        }
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        if (request.getNom() == null || request.getNom().isBlank()) {
            throw new RuntimeException("Le nom est requis");
        }
        if (request.getMotDePasse() == null || request.getMotDePasse().isBlank()) {
            throw new RuntimeException("Le mot de passe est requis");
        }
    
        // Séparer le nom complet en prénom et nom
        String nomComplet = request.getNom().trim();
        String[] parts = nomComplet.split(" ", 2); // Split au premier espace
        String prenom = parts.length > 1 ? parts[0] : nomComplet;
        String nom = parts.length > 1 ? parts[1] : "";
    
        // Créer le joueur
        Joueur joueur = new Joueur();
        joueur.setNom(nom);
        joueur.setPrenom(prenom);
        joueur.setEmail(request.getEmail());
        joueur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        joueur.setTypeRole(Role.JOUEUR);
        joueur.setDateInscription(LocalDateTime.now());
        joueur.setProfilComplet(false);
        joueur.setFailedLoginAttempts(0);
    
        Joueur saved = utilisateurRepository.save(joueur);
    
        return AdminMapper.toJoueurAdminDto(saved);
    }
}   