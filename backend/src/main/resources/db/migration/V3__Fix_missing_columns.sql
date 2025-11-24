-- ============================================================
-- FIELDZ - Migration Flyway V3 : Corrections schema
-- ============================================================
-- Corrige les colonnes manquantes et les types incorrects
-- ============================================================

-- 1. Ajouter colonne 'photo' à terrain (manquante dans V1)
ALTER TABLE terrain ADD COLUMN IF NOT EXISTS photo VARCHAR(500);

-- 2. Corriger le type de 'prix' dans creneau (DECIMAL → DOUBLE PRECISION)
ALTER TABLE creneau ALTER COLUMN prix TYPE DOUBLE PRECISION;

-- 3. Ajouter colonne 'nom_reservant' à reservation (manquante dans V1)
ALTER TABLE reservation ADD COLUMN IF NOT EXISTS nom_reservant VARCHAR(255);
