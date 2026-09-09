-- ============================================================================
-- ALL IN ONE CLEANING - Team (migratie 4)
-- Uitvoeren na 0003_google_reviews.sql via de Supabase SQL Editor.
--
-- Lijst met collega's voor de toewijzing van aanvragen in het dashboard.
-- Beheerd via Instellingen → Team. Inloggen blijft via Supabase Auth + ADMIN_EMAILS.
-- ============================================================================

alter table public.site_settings add column if not exists team jsonb;  -- [{ "name": "Jan", "email": "jan@…" }]
