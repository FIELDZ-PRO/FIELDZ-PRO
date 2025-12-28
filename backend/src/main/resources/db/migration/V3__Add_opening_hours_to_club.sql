-- ============================================================
-- Migration V3: Add opening and closing hours to utilisateur table
-- ============================================================
-- Description: Add heureOuverture and heureFermeture fields for clubs
-- Date: 2025-12-09
-- ============================================================

ALTER TABLE utilisateur ADD COLUMN IF NOT EXISTS heure_ouverture TIME;
ALTER TABLE utilisateur ADD COLUMN IF NOT EXISTS heure_fermeture TIME;

COMMENT ON COLUMN utilisateur.heure_ouverture IS 'Opening time for clubs (e.g., 08:00:00)';
COMMENT ON COLUMN utilisateur.heure_fermeture IS 'Closing time for clubs (e.g., 22:00:00)';
