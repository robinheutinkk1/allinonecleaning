-- ============================================================================
-- NOVA ONDERHOUD (demo) - Complete database-setup in één keer
--
-- Voor een NIEUW (leeg) databaseproject: plak dit hele bestand in de SQL Editor
-- en voer het uit. Het bevat migraties 0001 t/m 0006 in de juiste volgorde en is
-- veilig om opnieuw uit te voeren (alles is "if not exists" / "or replace").
--
-- Heeft u de migraties 0001 t/m 0005 al eerder uitgevoerd? Dan is alleen
-- supabase/migrations/0006_demo_prefix.sql nodig.
-- ============================================================================


-- >>>>>>>>>> 0001_init.sql <<<<<<<<<<

-- ============================================================================
-- NOVA ONDERHOUD (demo) - Databaseschema
-- Uitvoeren via Supabase SQL Editor of `supabase db push`.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enum: status van een offerteaanvraag (eenvoudig uitbreidbaar met ALTER TYPE)
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'quote_status') then
    create type public.quote_status as enum (
      'new', 'reviewing', 'contacted', 'quoted', 'won', 'lost', 'cancelled'
    );
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- Aanvraagnummers: <VOORVOEGSEL>-2026-0001 (teller per jaar, atomisch; voorvoegsel via migratie 5/6)
-- ----------------------------------------------------------------------------
create table if not exists public.quote_counters (
  year        int primary key,
  last_number int not null default 0
);

create or replace function public.next_quote_number(prefix text default 'AIC')
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  y int := extract(year from now())::int;
  n int;
begin
  insert into public.quote_counters (year, last_number)
  values (y, 1)
  on conflict (year) do update
    set last_number = public.quote_counters.last_number + 1
  returning last_number into n;

  return format('%s-%s-%s', prefix, y, lpad(n::text, 4, '0'));
end;
$$;

-- ----------------------------------------------------------------------------
-- Tabel: quote_requests (offerteaanvragen uit de wizard)
-- ----------------------------------------------------------------------------
create table if not exists public.quote_requests (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  quote_number        text not null unique default public.next_quote_number('AIC'),
  status              public.quote_status not null default 'new',

  customer_name       text not null,
  phone               text not null,
  email               text not null,

  address             text,
  postal_code         text not null,
  house_number        text not null,
  city                text not null,

  service             text not null,
  service_other       text,
  property_type       text not null,
  surface_type        text not null,
  surface_other       text,

  estimated_size      text not null,
  estimated_m2        numeric,
  contamination_types text[] not null default '{}',
  contamination_other text,

  desired_period      text not null,
  desired_date        date,

  message             text,
  photo_paths         text[] not null default '{}',

  source              text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,

  admin_notes         text,
  assigned_to         text,

  privacy_accepted_at timestamptz not null,
  ip_hash             text,
  user_agent          text
);

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx on public.quote_requests (status);

-- ----------------------------------------------------------------------------
-- Tabel: contact_messages (eenvoudig contactformulier)
-- ----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  status      text not null default 'new',
  ip_hash     text
);

-- ----------------------------------------------------------------------------
-- Tabel: projects (before/after-galerij)
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  title           text not null,
  slug            text not null unique,
  description     text,
  result          text,
  service         text not null,
  location        text,
  before_image    text not null,  -- volledige URL of pad in bucket project-images
  after_image     text not null,
  before_alt      text,
  after_alt       text,
  gallery_images  text[],
  published       boolean not null default false,
  featured        boolean not null default false,
  sort_order      int not null default 0
);

create index if not exists projects_published_idx on public.projects (published, sort_order);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quote_requests_set_updated_at on public.quote_requests;
create trigger quote_requests_set_updated_at
  before update on public.quote_requests
  for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.quote_requests  enable row level security;
alter table public.contact_messages enable row level security;
alter table public.projects         enable row level security;
alter table public.quote_counters   enable row level security;

-- Offerteaanvragen en contactberichten: GEEN publieke toegang.
-- Schrijven gebeurt uitsluitend server-side via de service role (route handlers).
-- Lezen later via een ingelogd dashboard (authenticated) - voorbeeld:
drop policy if exists "quote_requests: authenticated read" on public.quote_requests;
create policy "quote_requests: authenticated read"
  on public.quote_requests for select
  to authenticated
  using (true);

drop policy if exists "quote_requests: authenticated update" on public.quote_requests;
create policy "quote_requests: authenticated update"
  on public.quote_requests for update
  to authenticated
  using (true) with check (true);

drop policy if exists "contact_messages: authenticated read" on public.contact_messages;
create policy "contact_messages: authenticated read"
  on public.contact_messages for select
  to authenticated
  using (true);

-- Projecten: gepubliceerde projecten zijn publiek leesbaar (anon).
drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published"
  on public.projects for select
  to anon, authenticated
  using (published = true);

drop policy if exists "projects: authenticated manage" on public.projects;
create policy "projects: authenticated manage"
  on public.projects for all
  to authenticated
  using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Storage buckets
--   quote-uploads  → PRIVÉ. Alleen service role schrijft; lezen via signed URLs.
--   project-images → PUBLIEK. Alleen authenticated (dashboard) schrijft.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quote-uploads', 'quote-uploads', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies
-- quote-uploads: geen anon-toegang. Authenticated (dashboard) mag lezen.
drop policy if exists "quote-uploads: authenticated read" on storage.objects;
create policy "quote-uploads: authenticated read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'quote-uploads');

-- project-images: iedereen mag lezen, alleen authenticated mag beheren.
drop policy if exists "project-images: public read" on storage.objects;
create policy "project-images: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

drop policy if exists "project-images: authenticated insert" on storage.objects;
create policy "project-images: authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

drop policy if exists "project-images: authenticated update" on storage.objects;
create policy "project-images: authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images');

drop policy if exists "project-images: authenticated delete" on storage.objects;
create policy "project-images: authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

-- >>>>>>>>>> 0002_admin.sql <<<<<<<<<<

-- ============================================================================
-- NOVA ONDERHOUD (demo) - Dashboard (migratie 2)
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
  work_areas      text[],         -- ["Hengelo", "Borne"]
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

-- >>>>>>>>>> 0003_google_reviews.sql <<<<<<<<<<

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

-- >>>>>>>>>> 0004_team.sql <<<<<<<<<<

-- ============================================================================
-- NOVA ONDERHOUD (demo) - Team (migratie 4)
-- Uitvoeren na 0003_google_reviews.sql via de Supabase SQL Editor.
--
-- Lijst met collega's voor de toewijzing van aanvragen in het dashboard.
-- Beheerd via Instellingen → Team. Inloggen blijft via Supabase Auth + ADMIN_EMAILS.
-- ============================================================================

alter table public.site_settings add column if not exists team jsonb;  -- [{ "name": "Jan", "email": "jan@…" }]

-- >>>>>>>>>> 0005_rebrand.sql <<<<<<<<<<

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

-- >>>>>>>>>> 0006_demo_prefix.sql <<<<<<<<<<

-- ============================================================================
-- NOVA ONDERHOUD (demo) - Aanvraagnummers (migratie 6)
-- Uitvoeren na 0005_rebrand.sql via de SQL Editor.
--
-- Nieuwe aanvraagnummers krijgen het voorvoegsel NOVA. De teller per jaar loopt
-- gewoon door; bestaande nummers veranderen niet.
-- ============================================================================

alter table public.quote_requests
  alter column quote_number set default public.next_quote_number('NOVA');
