# Deployment - Supabase, Resend, Vercel

## 1. Supabase

1. Maak een project aan op https://supabase.com (regio: **EU | Frankfurt** i.v.m. AVG).
2. Open **SQL Editor** → plak de inhoud van `supabase/migrations/0001_init.sql` → Run.
   Dit maakt aan:
   - tabellen `quote_requests`, `contact_messages`, `projects`, `quote_counters`
   - enum `quote_status` (`new, reviewing, contacted, quoted, won, lost, cancelled`)
   - functie `next_quote_number('AIC')` → `AIC-2026-0001` (atomische teller per jaar)
   - RLS: geen publieke toegang tot aanvragen; gepubliceerde projecten publiek leesbaar
   - storage buckets `quote-uploads` (**privé**, 10 MB, jpg/png/webp) en `project-images` (**publiek**)
3. Open opnieuw **SQL Editor** → plak de inhoud van `supabase/migrations/0002_admin.sql` → Run.
   Dit maakt aan (nodig voor het dashboard):
   - tabellen `reviews`, `site_settings` (één rij met contactgegevens, openingstijden, werkgebied, statistieken)
     en `quote_events` (activiteitenlog per aanvraag)
   - extra RLS-policies voor ingelogde beheerders (berichten bijwerken, aanvragen en foto's verwijderen)
4. **Project Settings → API**: kopieer `Project URL`, `anon public` key en `service_role` key.

### Storage-structuur

```
quote-uploads/<upload-sessie 32 hex>/<uuid>.webp     ← offertefoto's, alleen via service role + signed URLs
project-images/<slug>/voor.jpg, na.jpg               ← publieke before/after-foto's voor de galerij
```

Deze twee lopen nooit door elkaar: de site schrijft uitsluitend naar `quote-uploads`; de galerij
leest uitsluitend `project-images` (of `/public/images/projects` als fallback).

### Foto's van een aanvraag bekijken

Via het dashboard: `/admin/aanvragen/<nummer>` toont de foto's met tijdelijke (1 uur geldige)
signed URLs. Zonder dashboard: Supabase → Storage → `quote-uploads` → map met de sessie-hash;
de paden staan in de kolom `photo_paths` van de aanvraag.

### Projecten en reviews beheren

Via het dashboard (`/admin/projecten`, `/admin/reviews`): voor/na-foto's uploaden (worden
automatisch verkleind en naar `project-images/<slug>/` geschreven), publiceren, uitlichten,
sorteren. Wijzigingen staan direct op de site. Handmatig kan het ook via `Table Editor → projects`
(`before_image`/`after_image` = pad in bucket `project-images` of volledige URL, `published = true`).

## 1b. Dashboard (`/admin`)

Het dashboard draait op dezelfde site, onder `/admin`, en gebruikt Supabase Auth
(e-mail + wachtwoord). Alleen adressen in `ADMIN_EMAILS` mogen inloggen.

1. Supabase → **Authentication → Users → Add user → Create new user**: e-mailadres + wachtwoord,
   vink **Auto Confirm User** aan.
2. Supabase → **Authentication → Sign In / Providers → Email**: zet **Allow new users to sign up** uit
   (anders kan iedereen een account maken; ze komen zonder `ADMIN_EMAILS` overigens niet binnen).
3. Vercel → **Environment Variables**: `ADMIN_EMAILS=<het e-mailadres uit stap 1>` (meerdere adressen
   scheiden met een komma). Redeploy.
4. Log in op `https://<domein>/login` (ook bereikbaar via "Inloggen voor medewerkers" in de footer;
   `/admin` zonder sessie stuurt automatisch door naar `/login`).

Onderdelen:

| Pagina | Wat kun je er doen |
| --- | --- |
| `/admin` | KPI's (nieuwe aanvragen, laatste 7/30 dagen, gewonnen, open berichten), laatste aanvragen, verdeling per status en dienst |
| `/admin/aanvragen` | zoeken, filteren op status/dienst, paginering, **Exporteer CSV** (Excel, `;`-gescheiden) |
| `/admin/aanvragen/<id>` | alle wizard-antwoorden, foto's (signed URLs, klik = groot), status wijzigen, toewijzen, notities, activiteitenlog, bellen/WhatsApp/e-mail-knoppen, foto's of aanvraag verwijderen |
| `/admin/berichten` | contactberichten: nieuw → gelezen → beantwoord → archief, verwijderen |
| `/admin/projecten` | before/after-projecten: aanmaken, uploaden, publiceren, uitlichten, sorteren, verwijderen |
| `/admin/reviews` | reviews toevoegen/bewerken (naam, sterren, tekst, bron, datum), publiceren, uitlichten |
| `/admin/instellingen` | telefoon, e-mail, WhatsApp, adres, KvK/btw, openingstijden, werkgebied, social links, Google-beoordeling, statistieken, hero-video aan/uit, notificatie-adres |

Alles wat je in **Instellingen** invult, neemt de publieke site over (navbar, footer, sticky balk,
CTA's, contactpagina, LocalBusiness-structured data). Lege velden blijven verborgen: de site
toont nooit verzonnen gegevens.

### Collega's toevoegen

Een collega heeft twee dingen nodig: een loginaccount en een plek in de teamlijst.

1. **Account**: Supabase → Authentication → Users → Add user (e-mail + wachtwoord, Auto Confirm aan).
2. **Toegang**: voeg het e-mailadres toe aan `ADMIN_EMAILS` in Vercel, kommagescheiden
   (`jan@bedrijf.nl,piet@bedrijf.nl`). Redeploy. Zonder dit kan het account wel inloggen bij
   Supabase, maar komt het niet in het dashboard.
3. **Teamlijst**: Dashboard → Instellingen → Team, per regel `Naam | e-mailadres`. Vanaf dan is
   "Toegewezen aan" bij een aanvraag een keuzelijst met deze namen, staat er een knop
   "Aan mij toewijzen" (op basis van het e-mailadres) en kan de aanvragenlijst per collega gefilterd
   worden. Voer je migratie `0004_team.sql` niet uit, dan blijft toewijzen een vrij tekstveld.

Iedereen in `ADMIN_EMAILS` heeft dezelfde rechten (rollen zijn er nog niet, zie ROADMAP).
Collega verwijderen: e-mailadres uit `ADMIN_EMAILS` halen en redeployen; het account in Supabase
mag blijven bestaan of verwijderd worden.

Beveiliging: `/admin` heeft `noindex`, de proxy (`proxy.ts`) stuurt bezoekers zonder sessie naar
de loginpagina, en elke server action controleert opnieuw of het account in `ADMIN_EMAILS` staat.
Alle database-acties in het dashboard lopen via de service-role key op de server; de browser krijgt
nooit een geheime sleutel.

## 2. Resend (e-mail)

1. Account op https://resend.com → **Domains** → voeg het bedrijfsdomein toe en zet de DNS-records
   (SPF/DKIM). Zonder geverifieerd domein kun je alleen testen met `onboarding@resend.dev`.
2. **API Keys** → nieuwe key → `RESEND_API_KEY`.
3. Zet `EMAIL_FROM` op een adres van het geverifieerde domein en `QUOTE_NOTIFICATION_EMAIL` op het
   adres waar aanvragen binnen moeten komen.

Wat wordt verstuurd:

| Trigger | Naar | Onderwerp |
| --- | --- | --- |
| Nieuwe offerteaanvraag | `QUOTE_NOTIFICATION_EMAIL` | `Nieuwe offerteaanvraag AIC-2026-0001` |
| Nieuwe offerteaanvraag | klant | `Uw offerteaanvraag bij All in One Cleaning` (uit te zetten met `SEND_CUSTOMER_CONFIRMATION=false`) |
| Contactformulier | `QUOTE_NOTIFICATION_EMAIL` | `Nieuw bericht via de website van <naam>` |

Mailfouten blokkeren nooit een aanvraag: de aanvraag staat al in Supabase, de fout wordt gelogd.

## 3. Vercel

1. Importeer de GitHub-repo in Vercel (framework: Next.js, geen extra instellingen nodig).
2. **Settings → Environment Variables** (Production + Preview):

| Variabele | Verplicht | Waar |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ja | definitieve domeinnaam, bijv. `https://www.allinonecleaning-enschede.nl` |
| `NEXT_PUBLIC_SUPABASE_URL` | ja | Supabase → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ja | Supabase → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ja (server-only) | Supabase → API |
| `RESEND_API_KEY` | ja | Resend |
| `EMAIL_FROM` | ja | `All in One Cleaning <offerte@…>` |
| `QUOTE_NOTIFICATION_EMAIL` | ja | mailbox van het bedrijf |
| `SEND_CUSTOMER_CONFIRMATION` | nee | `true`/`false` |
| `IP_HASH_SALT` | aanbevolen | lange willekeurige string |
| `ADMIN_EMAILS` | ja (dashboard) | e-mailadressen die op `/admin` mogen inloggen, kommagescheiden |
| `ADMIN_URL` | nee | dashboard-URL voor de "Bekijk aanvraag"-link in de mail, standaard `<site>/admin` |
| `NEXT_PUBLIC_HERO_VIDEO_SRC` | nee | `/videos/hero.mp4` zodra de video goedgekeurd is |
| `GOOGLE_PLACES_API_KEY` | nee | Google Cloud, zie 3b |
| `GOOGLE_PLACE_ID` | nee | Place ID van het bedrijf, zie 3b |
| `CRON_SECRET` | nee | lange willekeurige string, activeert de dagelijkse verversing van Google-reviews |

3. Deploy. Koppel het domein (Settings → Domains) en zet `www` als primary met redirect.
4. Aanbevolen: **Vercel Firewall** (rate limiting op `/api/*`) en **Vercel Analytics** aanzetten
   (`lib/analytics.ts` pusht events automatisch naar `window.va` als het script aanwezig is).

## 3b. Google-reviews automatisch ophalen (optioneel)

Zonder deze koppeling voert u reviews handmatig in via `/admin/reviews` en het gemiddelde bij
`/admin/instellingen`. Met de koppeling haalt de site de beoordeling, het aantal reviews en de
reviews die Google vrijgeeft (maximaal 5, Google bepaalt welke) rechtstreeks uit Google.

1. Supabase → **SQL Editor**: voer `supabase/migrations/0003_google_reviews.sql` uit.
2. https://console.cloud.google.com → project aanmaken → **APIs & Services → Library** →
   **Places API (New)** inschakelen. Google vraagt een betaalkaart; een paar aanroepen per dag
   vallen ruim binnen het gratis maandelijkse tegoed.
3. **APIs & Services → Credentials → Create credentials → API key**. Klik daarna op de sleutel →
   **API restrictions → Restrict key → Places API (New)**. Dit is `GOOGLE_PLACES_API_KEY`.
4. Place ID opzoeken: https://developers.google.com/maps/documentation/places/web-service/place-id
   (Place ID Finder), zoek op "All in One Cleaning Enschede". De code begint met `ChIJ`.
   Dit is `GOOGLE_PLACE_ID`.
5. Vercel → Environment Variables: `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` en (voor de
   dagelijkse verversing) `CRON_SECRET` met een lange willekeurige string. Redeploy.
6. Controleer `https://<domein>/api/health`: `googlePlaces` moet groen zijn ("Sleutel en Place ID
   werken"). Deze controle is gratis (alleen het veld `id`).
7. Dashboard → **Reviews** → **Google-reviews ophalen**.

Werking:

- Nieuwe reviews worden direct gepubliceerd. Verbergen kan met het oog-icoon; verwijderen kan niet,
  want Google levert ze bij de volgende verversing opnieuw.
- Bekende reviews krijgen bij verversing de actuele tekst en score; gepubliceerd, uitgelicht en
  volgorde blijven zoals in het dashboard ingesteld. Reviews zonder tekst worden overgeslagen.
- Gemiddelde, aantal en Google-link gaan automatisch naar Instellingen (ook gebruikt in de
  `AggregateRating` structured data).
- Vercel Cron (`vercel.json`) roept elke nacht om 05:00 UTC `/api/cron/google-reviews` aan.
  Vercel stuurt `CRON_SECRET` zelf mee als `Authorization: Bearer …`. Zonder `CRON_SECRET` werkt
  alleen de knop in het dashboard. Google staat toe dat opgehaalde gegevens maximaal 30 dagen
  bewaard worden; met de dagelijkse verversing zit u daar ruim onder.
- Op de site linkt de naam van de schrijver naar het Google-profiel (naamsvermelding is een
  voorwaarde van Google).

## 4. Lokaal ontwikkelen

```bash
cp .env.example .env.local   # vul minimaal de Supabase-keys in om de echte flow te testen
npm run dev
```

Zonder keys: wizard en contactformulier werken in "dev-fallback" (log naar console, testnummer
`AIC-2026-Txxxx`, uploads worden niet opgeslagen). In productie geven de API's dan een nette
503-melding aan de bezoeker.

## 5. Livegang-checklist

- [ ] Echte logo en foto's geplaatst (`docs/CONTENT-CHECKLIST.md` A)
- [ ] `config/site.ts` ingevuld: telefoon, e-mail, KvK, werkgebied, domein
- [ ] Diensten en teksten gecontroleerd door All in One Cleaning
- [ ] Supabase-migraties `0001_init.sql` én `0002_admin.sql` uitgevoerd, buckets aanwezig, `quote-uploads` staat op **niet publiek**
- [ ] Dashboard: beheerder aangemaakt in Supabase Auth, `ADMIN_EMAILS` in Vercel, publieke sign-up uit, ingelogd op `/admin`
- [ ] Instellingen in het dashboard ingevuld (telefoon, e-mail, adres, KvK, openingstijden, werkgebied)
- [ ] Optioneel: migratie `0003_google_reviews.sql`, Google-sleutel en Place ID in Vercel, `googlePlaces` groen in `/api/health`
- [ ] Resend-domein geverifieerd, testmail ontvangen
- [ ] Alle env-variabelen in Vercel (Production én Preview)
- [ ] Testaanvraag gedaan op de productie-URL: rij in `quote_requests`, foto's in bucket, 2 mails ontvangen
- [ ] Testbericht via /contact: rij in `contact_messages`, mail ontvangen
- [ ] Privacyverklaring gecontroleerd (bewaartermijn, KvK, datum)
- [ ] Domein gekoppeld, https actief, `NEXT_PUBLIC_SITE_URL` klopt (canonical/sitemap)
- [ ] Google Search Console: sitemap `https://<domein>/sitemap.xml` ingediend
- [ ] Google Business Profile gekoppeld aan de website-URL
- [ ] Lighthouse mobiel ≥ 90 op Performance/Accessibility/SEO
- [ ] Sticky mobiele balk gecontroleerd op een echte telefoon (iOS Safari + Android Chrome)
- [ ] Foto-upload getest vanaf een telefoon (camera + galerij, HEIC-foto's worden door iOS als JPG aangeleverd bij "Meest compatibel"; anders melding "alleen JPG/PNG/WEBP")

## 6. Beveiliging - samenvatting

- Service-role key alleen in route handlers (`import "server-only"`), nooit in de client.
- Alle invoer server-side gevalideerd met zod (identieke regels als client).
- Uploads: magic-bytes check, max 10 MB, max 8 per aanvraag, hercodering met sharp (EXIF/GPS weg), privé-bucket.
- Rate limiting per IP (5 aanvragen / 15 min, 40 uploads / 10 min) + honeypot-veld.
- IP-adressen worden alleen gehasht opgeslagen (`ip_hash`).
- Security headers in `next.config.ts` (nosniff, frame-deny, referrer-policy, permissions-policy).
- RLS aan op alle tabellen; anon heeft alleen leesrechten op gepubliceerde projecten.
