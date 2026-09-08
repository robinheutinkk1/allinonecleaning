# Verbeterpunten & wat later kan worden toegevoegd

## Direct na livegang (kleine moeite, veel effect)

1. **Echte foto's per dienst** — de placeholders op /diensten zijn het zwakste visuele punt.
2. **Meer before/after-projecten** van gevel, trespa en zonnepanelen (nu alleen dak). De galerijfilter
   verschijnt automatisch zodra er projecten van ≥ 2 diensten zijn.
3. **Google Reviews** invullen in `config/reviews.ts` → reviewsectie verschijnt op home en over-ons.
4. **Telefoonnummer** invullen → "Bel direct" in navbar, sticky balk, CTA's en succesvenster.
5. **Vercel Analytics of Plausible** aanzetten → funnel-inzicht: waar haken bezoekers af in de wizard?

## Fase 2 — Dashboard (architectuur is voorbereid)

Alles wat een dashboard nodig heeft staat al in de database:
`status`, `admin_notes`, `assigned_to`, `photo_paths`, RLS-policies voor `authenticated`.

Voorstel: route `/admin` (Supabase Auth, e-mail + wachtwoord of magic link), met:

- Lijst aanvragen (filter op status, dienst, datum), kaartweergave zoals in de master-prompt
- Detail: alle velden, foto's via **signed URLs** (`storage.from('quote-uploads').createSignedUrl(path, 3600)`), status wijzigen, notities, toewijzen
- Projectenbeheer: before/after uploaden naar `project-images`, publiceren/uitlichten, sorteren
- Reviews en diensten beheren (dan uit config → database)
- `ADMIN_URL` invullen → "Bekijk aanvraag"-knop in de notificatiemail werkt direct

## Fase 3 — Conversie & marketing

- **WhatsApp-knop** (sticky) zodra het nummer bekend is (`siteConfig.whatsapp`).
- **Adres-autocomplete** (postcode + huisnummer → straat/plaats) via een Nederlandse postcode-API.
- **Follow-up mails**: herinnering aan de klant na X dagen zonder reactie (Resend + cron in Vercel).
- **Seizoenscampagnes**: landingspagina's "Dakreiniging voorjaar" met UTM-tracking (wordt al opgeslagen).
- **Lokale SEO-pagina's** per plaats — alleen zodra het werkgebied bevestigd is én er per plaats echte
  projecten/foto's zijn om de pagina uniek te maken.
- **Schema.org `AggregateRating`** toevoegen zodra er echte Google-reviews zijn.

## Technische verbeterpunten

- Rate limiting is in-memory (per serverless-instantie). Voor harde limieten: Vercel Firewall of
  Upstash Ratelimit (drop-in in `lib/utils/request.ts`).
- `lib/supabase/types.ts` handmatig → genereren met `supabase gen types typescript` bij schemawijzigingen.
- Opruimen van "verweesde" uploads (bezoeker uploadt foto's maar verstuurt niet): Supabase Edge Function of
  cron die objecten in `quote-uploads` ouder dan 7 dagen zonder bijbehorende aanvraag verwijdert.
- E2E-tests (Playwright) voor de wizardflow opnemen in CI.
- Hero-video pas plaatsen na een Lighthouse-check (LCP moet de poster blijven).
