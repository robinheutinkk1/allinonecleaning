# Roadmap - van demo naar klantwebsite

## Wat de demo laat zien

- Publieke website van een fictief onderhoudsbedrijf (NOVA Onderhoud): hero met video, diensten,
  voor/na-slider, werkwijze, voorbeeldreviews, werkgebied, FAQ en een offerteaanvraag in 10 stappen
  met foto-upload.
- `/beheer`: TagPoint Demo-beheeromgeving met voorbeeldgegevens (dashboard, website, diensten,
  projecten, before & after, reviews, offerte-aanvragen, media, instellingen). Wijzigingen worden
  niet bewaard.
- `/admin`: het werkende dashboard op de database, zoals een klant het krijgt (aanvragen met foto's,
  statussen, notities, toewijzen, CSV-export, berichten, projecten, reviews, instellingen).

## Bij een echte klantwebsite

1. **Bedrijfsgegevens** in `config/site.ts` (naam, slogan, contact, werkgebied) en het logo opnieuw
   genereren of vervangen (`scripts/generate-logo.mjs` of eigen bestanden in `public/brand`).
2. **Eigen foto's** op de bestaande paden in `public/images` (zelfde bestandsnamen).
3. `DEMO_USE_DATABASE_CONTENT=true` zetten zodat instellingen, reviews en projecten uit `/admin`
   leidend worden; `/beheer` en de TagPoint-credit in de footer verwijderen of uitzetten.
4. **Reviews**: invoeren via `/admin/reviews` en het label "Voorbeeldreviews" in
   `config/reviews.ts` aanpassen.
5. **Analytics** (Vercel Analytics of Plausible) aanzetten voor funnel-inzicht in de wizard.

## Mogelijke uitbreidingen

- Diensten, FAQ en pagina-teksten beheren vanuit het dashboard (nu in `config/`).
- Offerte-pdf en "offerte verstuurd"-mail rechtstreeks vanuit de aanvraag.
- Magic-link login of 2FA; meerdere gebruikers met rollen.
- WhatsApp-knop (sticky) zodra het nummer bekend is (`siteConfig.whatsapp`).
- Adres-autocomplete (postcode + huisnummer) via een Nederlandse postcode-API.
- Follow-up mails na X dagen zonder reactie (geplande taak).
- Automatisch reviews ophalen uit een reviewplatform.
- Seizoenscampagnes met landingspagina's en UTM-tracking (UTM wordt al opgeslagen).

## Technische verbeterpunten

- Rate limiting is in-memory (per serverless-instantie). Voor harde limieten: firewall of Upstash Ratelimit.
- `lib/supabase/types.ts` handmatig → genereren bij schemawijzigingen.
- Opruimen van verweesde uploads (foto's zonder bijbehorende aanvraag, ouder dan 7 dagen).
- E2E-tests (Playwright) voor de wizardflow in CI.
