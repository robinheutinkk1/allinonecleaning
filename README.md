# All in One Cleaning - website & digitale offerte-intake

Productie-ready website voor **All in One Cleaning Enschede** ("Uw gevelspecialist"):
Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · Supabase · Resend · Vercel.

De site is gebouwd rond één conversieflow:

```
Landing → Vertrouwen → Before/After → "Dit wilt u ook?" → Offertewizard (10 stappen, met foto-upload)
→ Aanvraag in Supabase + e-mail naar All in One Cleaning → Aanvraagnummer voor de klant
```

## Snel starten

```bash
npm install
cp .env.example .env.local     # vul Supabase + Resend in (zie docs/DEPLOYMENT.md)
npm run dev                    # http://localhost:3000
```

Zonder Supabase/Resend werkt de site volledig met statische fallback-data; de
offertewizard en het contactformulier loggen dan naar de console en geven een
test-aanvraagnummer (`AIC-2026-T1234`) terug. In productie zijn de env-variabelen verplicht.

```bash
npm run lint       # ESLint
npm run build      # productie-build (incl. type-check)
node scripts/generate-placeholders.mjs   # placeholder-afbeeldingen (alleen ontbrekende)
```

## Projectstructuur

```
app/
  layout.tsx                 root layout: fonts en metadata
  (site)/layout.tsx          publieke site: instellingen-provider, navbar, footer, sticky CTA, LocalBusiness JSON-LD
  (site)/page.tsx            homepage
  (site)/diensten/           overzicht + [slug] (dakpanreiniging, trespa, zonnepanelen, bestrating)
  (site)/gevelreiniging/     pillar-pagina "gevelreiniging Enschede"
  (site)/before-after/       projectgalerij met sliders
  (site)/over-ons/  contact/  offerte-aanvragen/  privacy/  cookies/  not-found.tsx
  admin/                     dashboard (Supabase Auth): overzicht, aanvragen (+ detail, CSV-export),
                             berichten, projecten, reviews, instellingen, login
  api/quote                  POST: offerteaanvraag → Supabase + mails
  api/contact                POST: contactbericht → Supabase + mail
  api/upload                 POST/DELETE: foto-upload naar privé-bucket (sharp: EXIF strip, webp)
  api/health                 GET: controleert Supabase/Resend/Google-configuratie zonder geheimen te tonen
  api/cron/google-reviews    GET (Vercel Cron, CRON_SECRET): dagelijkse verversing van Google-reviews
  sitemap.ts  robots.ts
proxy.ts                     beschermt /admin (sessie verversen, redirect naar login, noindex)
components/
  admin/      Shell, LoginForm, QuoteActions, PhotoGallery, QuoteFilters, ProjectForm, ReviewManager, SettingsForm, ui
  layout/     Navbar, Footer, StickyMobileCTA, PageHeader
  sections/   Hero, TrustBar, Intro, ProcessSteps, ReviewsSection, StatsSection, LocationSection, FAQ, CTASection
  services/   ServiceCard, ServiceGrid, ServiceDetail
  before-after/ BeforeAfterSlider, BeforeAfterShowcase, ProjectCard, ProjectGallery
  quote/      QuoteWizard, QuoteWizardLoader, OptionCard, ProgressBar, PhotoUploader, QuoteSuccess
  forms/      ContactForm
  ui/         Button, Logo, SectionHeading, Field (inputs), Reveal (motion), ServiceIcon, JsonLd
  providers/  MotionProvider (reduced motion), SiteSettingsProvider (instellingen uit het dashboard)
config/
  site.ts       bedrijfsgegevens, navigatie, CTA's, trust-claims, statistieken  ← HIER placeholders invullen
  services.ts   diensten (bron: belettering bedrijfsbus)
  quote.ts      alle wizard-opties + conditionele logica + uploadlimieten
  projects.ts   statische before/after-fallback (3 aangeleverde projecten)
  faq.ts  reviews.ts
lib/
  admin/        auth (ADMIN_EMAILS), queries, server actions, statussen
  google/       Places API (New): beoordeling + reviews ophalen, synchronisatie naar Supabase
  supabase/     server clients (service role / anon), ssr (cookie-sessie), env, types
  validation/   zod-schema's (quote, contact) - client én server
  email/        Resend-templates (notificatie + klantbevestiging)
  utils/        request (rate limit, IP-hash), quote-number, cn
  settings.ts   site-instellingen uit Supabase (dashboard) met config-fallback, gecachet
  reviews.ts    reviews uit Supabase met config-fallback
  projects.ts   projecten uit Supabase met fallback
  seo.ts        metadata-helper + JSON-LD (LocalBusiness, Service, Breadcrumb, FAQ)
  analytics.ts  events: quote_started, quote_step_completed, quote_photo_uploaded, quote_submitted, contact_submitted
supabase/migrations/0001_init.sql   tabellen, RLS, storage buckets + policies
supabase/migrations/0002_admin.sql  reviews, site_settings, quote_events + beheerder-policies (dashboard)
supabase/migrations/0003_google_reviews.sql  Google-id en profiel-link per review, laatste verversing
vercel.json                         dagelijkse cron: /api/cron/google-reviews
assets/originals/                   originele aangeleverde foto's (niet publiek geserveerd)
scripts/process-photos.mjs          splitst VOOR/NA-collages, snijdt labels weg, vult public/images
scripts/generate-placeholders.mjs   placeholder-afbeeldingen voor paden waar nog geen foto voor is
docs/
  DESIGN-SYSTEM.md      kleuren, typografie, componenten, UX-flow
  DEPLOYMENT.md         Supabase + Resend + Vercel stap voor stap, env vars, livegang-checklist
  CONTENT-CHECKLIST.md  benodigde foto's en bedrijfsinformatie
  HIGGSFIELD-PROMPT.md  kant-en-klare prompt voor de hero-video
  ROADMAP.md            verbeterpunten en wat later kan worden toegevoegd
```

## Belangrijkste principes

- **Geen verzonnen content.** Telefoon, e-mail, adres, reviews, statistieken en certificaten zijn
  `null`/placeholders in `config/site.ts` en `config/reviews.ts`; de UI verbergt of markeert ze.
- **Geen automatische prijs.** De wizard verzamelt informatie; All in One Cleaning beoordeelt en belt.
- **Privacy by design.** Offertefoto's gaan naar een privé-bucket, EXIF wordt gestript, IP's worden
  gehasht, alles wordt server-side gevalideerd (zod), rate limiting en honeypot op alle formulieren.
- **Foto's vervangen = bestand vervangen.** Alle afbeeldingen staan op vaste paden in `public/images`
  (zie `docs/CONTENT-CHECKLIST.md`). Geen code-aanpassing nodig.
- **Dashboard op `/admin`.** Aanvragen (statussen `new → reviewing → contacted → quoted → won/lost/cancelled`,
  notities, toewijzen, foto's, CSV), berichten, projecten, reviews en site-instellingen. Inloggen met
  Supabase Auth; alleen adressen in `ADMIN_EMAILS`. Zie `docs/DEPLOYMENT.md` 1b.
