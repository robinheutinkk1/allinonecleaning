-- ============================================================================
-- ALL IN ONE CLEANING - Dashboard (migratie 2)
-- Uitvoeren na 0001_init.sql via de Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Reviews (beheerd in het dashboard, getoond op de site)
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  author      text not null,
  rating      int not null check (rating between 1 and 5),
  text        text not null,
  source      text not null default 'Google',
  review_date date,
  published   boolean not null default true,
  featured    boolean not null default false,
  sort_order  int not null default 0
);

create index if not exists reviews_published_idx on public.reviews (published, sort_order);

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

drop policy if exists "reviews: public read published" on public.reviews;
create policy "reviews: public read published"
  on public.reviews for select
  to anon, authenticated
  using (published = true);

drop policy if exists "reviews: authenticated manage" on public.reviews;
create policy "reviews: authenticated manage"
  on public.reviews for all
  to authenticated
  using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Site-instellingen (één rij, id = 1). Overschrijft placeholders in config/site.ts.
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id              int primary key default 1 check (id = 1),
  updated_at      timestamptz not null default now(),
  phone           text,
  email           text,
  whatsapp        text,
  street          text,
  postal_code     text,
  city            text,
  kvk             text,
  btw             text,
  opening_hours   jsonb,          -- [{ "days": "Ma-Vr", "hours": "08:00-18:00" }]
  work_areas      text[],         -- ["Enschede", "Hengelo"]
  social_instagram text,
  social_facebook  text,
  social_linkedin  text,
  social_google    text,
  google_rating    numeric(2,1),
  google_review_count int,
  google_reviews_url  text,
  stats            jsonb,         -- [{ "label": "Jaar ervaring", "value": "10+" }]
  hero_video_enabled boolean not null default true,
  notification_email text
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "site_settings: authenticated update" on public.site_settings;
create policy "site_settings: authenticated update"
  on public.site_settings for update
  to authenticated
  using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Activiteitenlog per aanvraag (statuswijzigingen, notities, toewijzingen)
-- ----------------------------------------------------------------------------
create table if not exists public.quote_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  quote_id    uuid not null references public.quote_requests(id) on delete cascade,
  type        text not null,        -- status_change | note | assign | email | created
  actor       text,                 -- e-mailadres van de medewerker
  payload     jsonb not null default '{}'::jsonb
);

create index if not exists quote_events_quote_idx on public.quote_events (quote_id, created_at desc);

alter table public.quote_events enable row level security;

drop policy if exists "quote_events: authenticated read" on public.quote_events;
create policy "quote_events: authenticated read"
  on public.quote_events for select
  to authenticated
  using (true);

drop policy if exists "quote_events: authenticated insert" on public.quote_events;
create policy "quote_events: authenticated insert"
  on public.quote_events for insert
  to authenticated
  with check (true);

-- Contactberichten: status wijzigen vanuit dashboard
drop policy if exists "contact_messages: authenticated update" on public.contact_messages;
create policy "contact_messages: authenticated update"
  on public.contact_messages for update
  to authenticated
  using (true) with check (true);

-- Aanvragen: verwijderen vanuit dashboard (AVG-verzoeken)
drop policy if exists "quote_requests: authenticated delete" on public.quote_requests;
create policy "quote_requests: authenticated delete"
  on public.quote_requests for delete
  to authenticated
  using (true);

-- Offertefoto's verwijderen (bij verwijderen van een aanvraag)
drop policy if exists "quote-uploads: authenticated delete" on storage.objects;
create policy "quote-uploads: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'quote-uploads');
