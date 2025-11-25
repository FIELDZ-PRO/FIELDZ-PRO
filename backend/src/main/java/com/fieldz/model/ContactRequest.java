package com.fieldz.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "contact_requests")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nom du club tel que saisi dans le formulaire */
    @Column(nullable = false)
    private String nomClub;

    /** Ville du club */
    @Column(nullable = false)
    private String ville;

    /** Nom du responsable */
    @Column(nullable = false)
    private String nomResponsable;

    /** Email de contact */
    @Column(nullable = false)
    private String email;

    /** Téléphone de contact (chaîne pour conserver le format) */
    @Column(nullable = false)
    private String telephone;

    /** Sports cochés dans le formulaire */
    @ElementCollection(targetClass = Sport.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "contact_request_sports", joinColumns = @JoinColumn(name = "contact_request_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "sport", nullable = false)
    private Set<Sport> sports;

    /** Message libre (optionnel) */
    @Column(columnDefinition = "TEXT")
    private String message;

    /** Pour usage futur (tri/filtrage) */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Statut simple pour suivi interne (optionnel) */
    @Column(nullable = false)
    private String statut; // e.g. "NEW", "SEEN", "CONTACTED"
}
