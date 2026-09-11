-- ============================================================================
-- NOVA ONDERHOUD (demo) - Voorvoegsel aanvraagnummers (migratie 5)
-- Uitvoeren na 0004_team.sql via de SQL Editor.
--
-- Historische migratie: wijzigt het voorvoegsel van nieuwe aanvraagnummers. De teller
-- per jaar loopt gewoon door; bestaande nummers veranderen niet. Migratie 6 zet het
-- voorvoegsel daarna op NOVA.
-- ============================================================================

alter table public.quote_requests
  alter column quote_number set default public.next_quote_number('AIO');
