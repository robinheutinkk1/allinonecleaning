# Verbeterpunten & wat later kan worden toegevoegd

## Direct na livegang (kleine moeite, veel effect)

1. **Echte foto's per dienst** - de placeholders op /diensten zijn het zwakste visuele punt.
2. **Meer before/after-projecten** van gevel, trespa en zonnepanelen (nu alleen dak). De galerijfilter
   verschijnt automatisch zodra er projecten van ≥ 2 diensten zijn.
3. **Google Reviews** toevoegen via `/admin/reviews` → reviewsectie verschijnt op home en over-ons.
4. **Contactgegevens** invullen via `/admin/instellingen` (telefoon, e-mail, adres, KvK, openingstijden).
5. **Vercel Analytics of Plausible** aanzetten → funnel-inzicht: waar haken bezoekers af in de wizard?

## Fase 2 - Dashboard (gereed)

Beschikbaar op `/admin`: aanvragen (filters, detail met foto's via signed URLs, status, notities,
toewijzen, activiteitenlog, CSV-export), berichten, projecten (upload naar `project-images`),
reviews en site-instellingen. Zie `docs/DEPLOYMENT.md` 1b.

Mogelijke uitbreidingen:

- Diensten en FAQ beheren vanuit het dashboard (nu nog in `config/`)
- Offerte-pdf en "offerte verstuurd"-mail rechtstreeks vanuit de aanvraag
- Magic-link login of 2FA via Supabase Auth
- Meerdere gebruikers met rollen (nu: iedereen in `ADMIN_EMAILS` is beheerder)

## Fase 3 - Conversie & marketing

- **WhatsApp-knop** (sticky) zodra het nummer bekend is (`siteConfig.whatsapp`).
- **Adres-autocomplete** (postcode + huisnummer → straat/plaats) via een Nederlandse postcode-API.
- **Follow-up mails**: herinnering aan de klant na X dagen zonder reactie (Resend + cron in Vercel).
- **Seizoenscampagnes**: landingspagina's "Dakreiniging voorjaar" met UTM-tracking (wordt al opgeslagen).
- **Lokale SEO-pagina's** per plaats - alleen zodra het werkgebied bevestigd is én er per plaats echte
  projecten/foto's zijn om de pagina uniek te maken.
- **Schema.org `AggregateRating`** staat klaar: vul Google-beoordeling en aantal in bij `/admin/instellingen`.

## Technische verbeterpunten

- Rate limiting is in-memory (per serverless-instantie). Voor harde limieten: Vercel Firewall of
  Upstash Ratelimit (drop-in in `lib/utils/request.ts`).
- `lib/supabase/types.ts` handmatig → genereren met `supabase gen types typescript` bij schemawijzigingen.
- Opruimen van "verweesde" uploads (bezoeker uploadt foto's maar verstuurt niet): Supabase Edge Function of
  cron die objecten in `quote-uploads` ouder dan 7 dagen zonder bijbehorende aanvraag verwijdert.
- E2E-tests (Playwright) voor de wizardflow opnemen in CI.
- Hero-video pas plaatsen na een Lighthouse-check (LCP moet de poster blijven).
