-- ============================================================================
-- NOVA ONDERHOUD (demo) - Google-reviews (migratie 3)
-- Uitvoeren na 0002_admin.sql via de Supabase SQL Editor.
--
-- Reviews die via de Google Places API worden opgehaald krijgen een vast
-- Google-id, zodat ze bij elke verversing worden bijgewerkt in plaats van
-- dubbel opgeslagen. De link naar het profiel van de schrijver is verplicht
-- volgens de voorwaarden van Google (naamsvermelding).
-- ============================================================================

alter table public.reviews add column if not exists google_review_id text;
alter table public.reviews add column if not exists author_url text;

create unique index if not exists reviews_google_review_id_idx
  on public.reviews (google_review_id)
  where google_review_id is not null;

alter table public.site_settings add column if not exists google_synced_at timestamptz;
alter table public.site_settings add column if not exists google_place_name text;
