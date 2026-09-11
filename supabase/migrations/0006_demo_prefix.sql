-- ============================================================================
-- NOVA ONDERHOUD (demo) - Aanvraagnummers (migratie 6)
-- Uitvoeren na 0005_rebrand.sql via de SQL Editor.
--
-- Nieuwe aanvraagnummers krijgen het voorvoegsel NOVA. De teller per jaar loopt
-- gewoon door; bestaande nummers veranderen niet.
-- ============================================================================

alter table public.quote_requests
  alter column quote_number set default public.next_quote_number('NOVA');
