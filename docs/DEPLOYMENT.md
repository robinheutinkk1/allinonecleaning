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
4. Log in op `https://<domein>/admin/login`.

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

3. Deploy. Koppel het domein (Settings → Domains) en zet `www` als primary met redirect.
4. Aanbevolen: **Vercel Firewall** (rate limiting op `/api/*`) en **Vercel Analytics** aanzetten
   (`lib/analytics.ts` pusht events automatisch naar `window.va` als het script aanwezig is).

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
