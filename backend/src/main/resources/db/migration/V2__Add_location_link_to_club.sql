-- ============================================================
-- Migration V2: Add location_link column to utilisateur table
-- ============================================================
-- Description: Add locationLink field for clubs to store Google Maps links
-- Date: 2025-12-07
-- ============================================================

ALTER TABLE utilisateur ADD COLUMN IF NOT EXISTS location_link VARCHAR(1000);

COMMENT ON COLUMN utilisateur.location_link IS 'Google Maps link or other location URL for clubs';
