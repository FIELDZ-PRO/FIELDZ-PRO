-- ============================================================
-- FIELDZ - Migration Flyway V2 : Ajout table club_images
-- ============================================================

CREATE TABLE IF NOT EXISTS club_images (
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

CREATE INDEX IF NOT EXISTS idx_club_images_club_id ON club_images(club_id);
