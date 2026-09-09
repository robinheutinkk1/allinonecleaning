-- ============================================================================
-- ALL IN ONE VASTGOEDONDERHOUD - Merkomzetting (migratie 5)
-- Uitvoeren na 0004_team.sql via de SQL Editor.
--
-- Nieuwe aanvraagnummers krijgen het voorvoegsel AIO (All In One) in plaats van
-- AIC. De teller per jaar loopt gewoon door, dus na AIC-2026-0007 volgt
-- AIO-2026-0008. Bestaande nummers veranderen niet.
-- ============================================================================

alter table public.quote_requests
  alter column quote_number set default public.next_quote_number('AIO');
