-- ============================================================
-- FIELDZ - Migration Flyway V2 : Donnees de test
-- ============================================================
-- ATTENTION : A utiliser uniquement en DEV/STAGING
-- Ne pas executer en production !
-- ============================================================

-- ============================================================
-- 1. CLUBS (3 clubs de padel)
-- ============================================================
-- Mot de passe : "Test123!" encode avec BCrypt
-- $2a$10$N9qo8uLOickgx2ZMRZoMye est un hash BCrypt valide

INSERT INTO utilisateur (dtype, role, type_role, nom, email, mot_de_passe, ville, adresse, profil_complet, failed_login_attempts)
VALUES
    ('Club', 'CLUB', 'CLUB', 'Padel Club Paris', 'club.paris@fieldz.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     'Paris', '15 Rue du Sport, 75015 Paris', true, 0),

    ('Club', 'CLUB', 'CLUB', 'Marseille Padel Center', 'club.marseille@fieldz.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     'Marseille', '42 Avenue du Prado, 13008 Marseille', true, 0),

    ('Club', 'CLUB', 'CLUB', 'Lyon Padel Academy', 'club.lyon@fieldz.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     'Lyon', '8 Rue de la Part-Dieu, 69003 Lyon', true, 0);

-- Sports des clubs
INSERT INTO club_sports (club_id, sport)
SELECT id, 'PADEL' FROM utilisateur WHERE email = 'club.paris@fieldz.com'
UNION ALL
SELECT id, 'TENNIS' FROM utilisateur WHERE email = 'club.paris@fieldz.com'
UNION ALL
SELECT id, 'PADEL' FROM utilisateur WHERE email = 'club.marseille@fieldz.com'
UNION ALL
SELECT id, 'PADEL' FROM utilisateur WHERE email = 'club.lyon@fieldz.com'
UNION ALL
SELECT id, 'SQUASH' FROM utilisateur WHERE email = 'club.lyon@fieldz.com';

-- ============================================================
-- 2. JOUEURS (5 joueurs)
-- ============================================================

INSERT INTO utilisateur (dtype, role, type_role, nom, prenom, email, mot_de_passe, telephone, profil_complet, failed_login_attempts)
VALUES
    ('Joueur', 'JOUEUR', 'JOUEUR', 'Dupont', 'Jean', 'jean.dupont@test.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     '0612345678', true, 0),

    ('Joueur', 'JOUEUR', 'JOUEUR', 'Martin', 'Marie', 'marie.martin@test.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     '0623456789', true, 0),

    ('Joueur', 'JOUEUR', 'JOUEUR', 'Bernard', 'Pierre', 'pierre.bernard@test.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     '0634567890', true, 0),

    ('Joueur', 'JOUEUR', 'JOUEUR', 'Petit', 'Sophie', 'sophie.petit@test.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     '0645678901', false, 0),

    ('Joueur', 'JOUEUR', 'JOUEUR', 'Robert', 'Lucas', 'lucas.robert@test.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5HzGW3K7yqDLl5nZ9K8N8c.AYG3Ey',
     '0656789012', true, 0);

-- ============================================================
-- 3. TERRAINS (8 terrains repartis sur les 3 clubs)
-- ============================================================

-- Terrains Paris (club_id = 1)
INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Court A - Indoor', 'SYNTHETIQUE', 'Paris', 'PADEL', id
FROM utilisateur WHERE email = 'club.paris@fieldz.com';

INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Court B - Indoor', 'SYNTHETIQUE', 'Paris', 'PADEL', id
FROM utilisateur WHERE email = 'club.paris@fieldz.com';

INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Court Tennis 1', 'TERRE_BATTUE', 'Paris', 'TENNIS', id
FROM utilisateur WHERE email = 'club.paris@fieldz.com';

-- Terrains Marseille (club_id = 2)
INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Padel Outdoor 1', 'GAZON_SYNTHETIQUE', 'Marseille', 'PADEL', id
FROM utilisateur WHERE email = 'club.marseille@fieldz.com';

INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Padel Outdoor 2', 'GAZON_SYNTHETIQUE', 'Marseille', 'PADEL', id
FROM utilisateur WHERE email = 'club.marseille@fieldz.com';

-- Terrains Lyon (club_id = 3)
INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Padel Premium', 'SYNTHETIQUE', 'Lyon', 'PADEL', id
FROM utilisateur WHERE email = 'club.lyon@fieldz.com';

INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Padel Standard', 'BETON', 'Lyon', 'PADEL', id
FROM utilisateur WHERE email = 'club.lyon@fieldz.com';

INSERT INTO terrain (nom_terrain, type_surface, ville, sport, club_id)
SELECT 'Squash Court', 'PARQUET', 'Lyon', 'SQUASH', id
FROM utilisateur WHERE email = 'club.lyon@fieldz.com';

-- ============================================================
-- 4. CRENEAUX (Prochains 7 jours, 10h-22h)
-- ============================================================

-- Creneaux pour les 7 prochains jours
-- Genere des creneaux de 1h30 entre 10h et 22h

INSERT INTO creneau (date_debut, date_fin, prix, statut, disponible, terrain_id)
SELECT
    CURRENT_DATE + (d || ' days')::INTERVAL + (h || ' hours')::INTERVAL AS date_debut,
    CURRENT_DATE + (d || ' days')::INTERVAL + ((h + 1) || ' hours 30 minutes')::INTERVAL AS date_fin,
    CASE
        WHEN h >= 18 THEN 45.00  -- Tarif soiree
        WHEN EXTRACT(DOW FROM CURRENT_DATE + d) IN (0, 6) THEN 40.00  -- Weekend
        ELSE 35.00  -- Tarif journee
    END AS prix,
    'LIBRE' AS statut,
    true AS disponible,
    t.id AS terrain_id
FROM
    generate_series(0, 6) AS d,
    generate_series(10, 20, 2) AS h,
    terrain t
WHERE t.sport = 'PADEL';

-- ============================================================
-- 5. RESERVATIONS (quelques reservations de test)
-- ============================================================

-- Reservation confirmee (Jean Dupont)
INSERT INTO reservation (joueur_id, creneau_id, date_reservation, statut)
SELECT
    (SELECT id FROM utilisateur WHERE email = 'jean.dupont@test.com'),
    (SELECT id FROM creneau WHERE disponible = true ORDER BY id LIMIT 1),
    CURRENT_TIMESTAMP,
    'CONFIRMEE';

-- Marquer le creneau comme reserve
UPDATE creneau SET statut = 'RESERVE', disponible = false
WHERE id = (SELECT creneau_id FROM reservation WHERE statut = 'CONFIRMEE' ORDER BY id LIMIT 1);

-- Reservation en attente (Marie Martin)
INSERT INTO reservation (joueur_id, creneau_id, date_reservation, statut)
SELECT
    (SELECT id FROM utilisateur WHERE email = 'marie.martin@test.com'),
    (SELECT id FROM creneau WHERE disponible = true ORDER BY id LIMIT 1 OFFSET 1),
    CURRENT_TIMESTAMP,
    'EN_ATTENTE';

-- Reservation annulee (Pierre Bernard)
INSERT INTO reservation (joueur_id, creneau_id, date_reservation, statut, date_annulation, motif_annulation)
SELECT
    (SELECT id FROM utilisateur WHERE email = 'pierre.bernard@test.com'),
    (SELECT id FROM creneau WHERE disponible = true ORDER BY id LIMIT 1 OFFSET 2),
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    'ANNULEE',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    'Indisponibilite de derniere minute';

-- ============================================================
-- 6. NOTIFICATIONS (exemples)
-- ============================================================

INSERT INTO notification (destinataire_id, type, message, lue, reservation_id)
SELECT
    (SELECT id FROM utilisateur WHERE email = 'jean.dupont@test.com'),
    'CONFIRMATION_RESERVATION',
    'Votre reservation a ete confirmee !',
    false,
    (SELECT id FROM reservation WHERE statut = 'CONFIRMEE' LIMIT 1);

INSERT INTO notification (destinataire_id, type, message, lue)
SELECT
    (SELECT id FROM utilisateur WHERE email = 'club.paris@fieldz.com'),
    'NOUVELLE_RESERVATION',
    'Une nouvelle reservation a ete effectuee sur votre terrain.',
    true;

-- ============================================================
-- RESUME DES DONNEES DE TEST
-- ============================================================
-- Clubs : 3 (Paris, Marseille, Lyon)
-- Joueurs : 5
-- Terrains : 8
-- Creneaux : ~200+ (7 jours x terrains padel)
-- Reservations : 3 (confirmee, en attente, annulee)
--
-- Comptes de test :
-- Email: club.paris@fieldz.com / Mot de passe: Test123!
-- Email: jean.dupont@test.com / Mot de passe: Test123!
-- ============================================================
