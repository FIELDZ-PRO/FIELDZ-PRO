-- ============================================================
-- FIELDZ - Migration Flyway V1 : Schema initial
-- ============================================================
-- Base de donnees : PostgreSQL
-- Date : 2024
-- Description : Creation de toutes les tables du schema FIELDZ
-- ============================================================

-- ============================================================
-- 1. TABLE UTILISATEUR (heritage SINGLE_TABLE)
-- ============================================================
-- Strategie : SINGLE_TABLE avec discriminateur 'dtype'
-- Contient : Joueur, Club, Admin
-- ============================================================

CREATE TABLE utilisateur (
    id BIGSERIAL PRIMARY KEY,

    -- Discriminateur JPA (type d'utilisateur)
    dtype VARCHAR(31) NOT NULL,

    -- Champs communs a tous les utilisateurs
    role VARCHAR(50),
    type_role VARCHAR(50),
    nom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    account_blocked_until TIMESTAMP,
    profil_complet BOOLEAN DEFAULT false,

    -- Champs specifiques au Joueur
    prenom VARCHAR(255),
    telephone VARCHAR(50),
    description TEXT,
    photo_profil_url VARCHAR(500),

    -- Champs specifiques au Club
    ville VARCHAR(255),
    adresse VARCHAR(500),
    banniere_url VARCHAR(500),
    politique TEXT,

    -- Contraintes
    CONSTRAINT uk_utilisateur_email UNIQUE (email)
);

-- Index pour les recherches frequentes
CREATE INDEX idx_utilisateur_email ON utilisateur(email);
CREATE INDEX idx_utilisateur_dtype ON utilisateur(dtype);
CREATE INDEX idx_utilisateur_type_role ON utilisateur(type_role);

-- ============================================================
-- 2. TABLE CLUB_SPORTS (ElementCollection)
-- ============================================================
-- Sports proposes par un club (relation Many-to-Many implicite)
-- ============================================================

CREATE TABLE club_sports (
    club_id BIGINT NOT NULL,
    sport VARCHAR(50) NOT NULL,

    PRIMARY KEY (club_id, sport),
    CONSTRAINT fk_club_sports_club
        FOREIGN KEY (club_id)
        REFERENCES utilisateur(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_club_sports_club_id ON club_sports(club_id);

-- ============================================================
-- 3. TABLE CLUB_IMAGES
-- ============================================================
-- Images des clubs
-- ============================================================

CREATE TABLE club_images (
    id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    club_id BIGINT NOT NULL,
    upload_date TIMESTAMP,
    display_order INTEGER,

    CONSTRAINT fk_club_images_club
        FOREIGN KEY (club_id)
        REFERENCES utilisateur(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_club_images_club_id ON club_images(club_id);

-- ============================================================
-- 4. TABLE TERRAIN
-- ============================================================
-- Terrains de sport appartenant aux clubs
-- ============================================================

CREATE TABLE terrain (
    id BIGSERIAL PRIMARY KEY,
    nom_terrain VARCHAR(255) NOT NULL,
    type_surface VARCHAR(100),
    ville VARCHAR(255),
    sport VARCHAR(50),
    photo VARCHAR(500),
    club_id BIGINT,
    politique_club TEXT,

    CONSTRAINT fk_terrain_club
        FOREIGN KEY (club_id)
        REFERENCES utilisateur(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_terrain_club_id ON terrain(club_id);
CREATE INDEX idx_terrain_ville ON terrain(ville);
CREATE INDEX idx_terrain_sport ON terrain(sport);

-- ============================================================
-- 4. TABLE CRENEAU
-- ============================================================
-- Creneaux horaires disponibles sur les terrains
-- ============================================================

CREATE TABLE creneau (
    id BIGSERIAL PRIMARY KEY,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    prix DOUBLE PRECISION,
    statut VARCHAR(50) DEFAULT 'LIBRE',
    disponible BOOLEAN DEFAULT true,
    terrain_id BIGINT,

    CONSTRAINT fk_creneau_terrain
        FOREIGN KEY (terrain_id)
        REFERENCES terrain(id)
        ON DELETE CASCADE,

    -- Contrainte : date_fin > date_debut
    CONSTRAINT chk_creneau_dates CHECK (date_fin > date_debut)
);

CREATE INDEX idx_creneau_terrain_id ON creneau(terrain_id);
CREATE INDEX idx_creneau_date_debut ON creneau(date_debut);
CREATE INDEX idx_creneau_statut ON creneau(statut);
CREATE INDEX idx_creneau_terrain_date ON creneau(terrain_id, date_debut);

-- ============================================================
-- 5. TABLE RESERVATION
-- ============================================================
-- Reservations effectuees par les joueurs
-- ============================================================

CREATE TABLE reservation (
    id BIGSERIAL PRIMARY KEY,
    joueur_id BIGINT,
    creneau_id BIGINT,
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) NOT NULL,
    date_annulation TIMESTAMP,
    motif_annulation VARCHAR(500),
    nom_reservant VARCHAR(255),

    CONSTRAINT fk_reservation_joueur
        FOREIGN KEY (joueur_id)
        REFERENCES utilisateur(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_reservation_creneau
        FOREIGN KEY (creneau_id)
        REFERENCES creneau(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_reservation_joueur_id ON reservation(joueur_id);
CREATE INDEX idx_reservation_creneau_id ON reservation(creneau_id);
CREATE INDEX idx_reservation_statut ON reservation(statut);
CREATE INDEX idx_reservation_date ON reservation(date_reservation);

-- ============================================================
-- 6. TABLE NOTIFICATION
-- ============================================================
-- Notifications envoyees aux utilisateurs
-- ============================================================

CREATE TABLE notification (
    id BIGSERIAL PRIMARY KEY,
    destinataire_id BIGINT,
    type VARCHAR(50) NOT NULL,
    message TEXT,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lue BOOLEAN DEFAULT false,
    reservation_id BIGINT,

    CONSTRAINT fk_notification_destinataire
        FOREIGN KEY (destinataire_id)
        REFERENCES utilisateur(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservation(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_notification_destinataire ON notification(destinataire_id);
CREATE INDEX idx_notification_lue ON notification(lue);
CREATE INDEX idx_notification_type ON notification(type);

-- ============================================================
-- 7. TABLE REFRESH_TOKENS
-- ============================================================
-- Tokens de rafraichissement JWT
-- ============================================================

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    user_agent VARCHAR(500),
    ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_refresh_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_rt_user ON refresh_tokens(user_id);
CREATE INDEX idx_rt_tokenhash ON refresh_tokens(token_hash);
CREATE INDEX idx_rt_expires_at ON refresh_tokens(expires_at);

-- ============================================================
-- 8. TABLE PASSWORD_RESET_TOKEN
-- ============================================================
-- Tokens de reinitialisation de mot de passe
-- ============================================================

CREATE TABLE password_reset_token (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    utilisateur_id BIGINT,

    CONSTRAINT uk_password_reset_token UNIQUE (token),

    CONSTRAINT fk_password_reset_utilisateur
        FOREIGN KEY (utilisateur_id)
        REFERENCES utilisateur(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_token ON password_reset_token(token);
CREATE INDEX idx_password_reset_user ON password_reset_token(utilisateur_id);

-- ============================================================
-- 9. TABLE CONTACT_REQUESTS
-- ============================================================
-- Demandes de contact des clubs potentiels
-- ============================================================

CREATE TABLE contact_requests (
    id BIGSERIAL PRIMARY KEY,
    nom_club VARCHAR(255) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    nom_responsable VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'NEW'
);

CREATE INDEX idx_contact_requests_statut ON contact_requests(statut);
CREATE INDEX idx_contact_requests_email ON contact_requests(email);

-- ============================================================
-- 10. TABLE CONTACT_REQUEST_SPORTS (ElementCollection)
-- ============================================================
-- Sports proposes dans les demandes de contact
-- ============================================================

CREATE TABLE contact_request_sports (
    contact_request_id BIGINT NOT NULL,
    sport VARCHAR(50) NOT NULL,

    PRIMARY KEY (contact_request_id, sport),

    CONSTRAINT fk_contact_request_sports
        FOREIGN KEY (contact_request_id)
        REFERENCES contact_requests(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 11. TABLE NOTIFICATION_ENVOYEE
-- ============================================================
-- Historique des notifications envoyees (evite les doublons)
-- ============================================================

CREATE TABLE notification_envoyee (
    id BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT,
    type VARCHAR(50) NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_envoyee_reservation ON notification_envoyee(reservation_id);
CREATE INDEX idx_notification_envoyee_type ON notification_envoyee(type);

-- ============================================================
-- COMMENTAIRES SUR LES TABLES
-- ============================================================

COMMENT ON TABLE utilisateur IS 'Table principale des utilisateurs (Joueur, Club, Admin) avec heritage SINGLE_TABLE';
COMMENT ON TABLE terrain IS 'Terrains de sport appartenant aux clubs';
COMMENT ON TABLE creneau IS 'Creneaux horaires disponibles pour la reservation';
COMMENT ON TABLE reservation IS 'Reservations de creneaux par les joueurs';
COMMENT ON TABLE notification IS 'Notifications envoyees aux utilisateurs';
COMMENT ON TABLE refresh_tokens IS 'Tokens JWT de rafraichissement';
COMMENT ON TABLE password_reset_token IS 'Tokens de reinitialisation de mot de passe';
COMMENT ON TABLE contact_requests IS 'Demandes de contact des clubs potentiels';
