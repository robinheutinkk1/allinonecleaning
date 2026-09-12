# NOVA Onderhoud - TagPoint demo-website

Demo-website van **TagPoint** voor het fictieve onderhoudsbedrijf **NOVA Onderhoud**
("Professioneel onderhoud voor woning en bedrijf"). De site laat zien hoe een bedrijfswebsite
met online offerte-intake en beheeromgeving eruit kan zien.
Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · Supabase · Resend · Vercel.

Alle bedrijfsgegevens, reviews, projecten en beelden zijn voorbeeldgegevens. Er wordt niets
gepresenteerd als echt: telefoonnummer, e-mailadres, locaties, klantnamen en foto's zijn fictief
of geïllustreerd.

De site is gebouwd rond één conversieflow:

```
Landing → Vertrouwen → Ons werk (voor/na) → "Dit resultaat ook voor uw pand?" → Offerteaanvraag (10 stappen, met foto-upload)
→ Aanvraag in de database + e-mail → Aanvraagnummer voor de klant
```

## Snel starten

```bash
npm install
cp .env.example .env.local     # optioneel: database + e-mail (zie docs/DEPLOYMENT.md)
npm run dev                    # http://localhost:3000
```

Zonder database/e-mail werkt de site volledig met de demo-inhoud uit `config/`; de
offertewizard en het contactformulier loggen dan naar de console en geven een
test-aanvraagnummer (`NOVA-2026-T1234`) terug.

```bash
npm run lint                         # ESLint
npm run build                        # productie-build (incl. type-check)
node scripts/generate-logo.mjs       # logo-set (inline SVG-paden, PNG's, favicon, app-iconen)
node scripts/generate-demo-images.mjs  # neutrale demo-illustraties (diensten, over ons)
```

## Twee beheeromgevingen

| Route | Wat | Login |
| --- | --- | --- |
| `/beheer` | **TagPoint Demo**: beheeromgeving met voorbeeldgegevens (dashboard, website, diensten, projecten, before & after, reviews, offerte-aanvragen, media, instellingen). Wijzigingen worden niet bewaard. | `/beheer/login`, demogegevens staan ingevuld |
| `/admin` | Werkend dashboard op de database: echte offerteaanvragen, contactberichten, projecten, reviews en instellingen. | `/login`, Supabase Auth + `ADMIN_EMAILS` |

De publieke site toont standaard de demo-inhoud uit `config/` (contactgegevens, reviews, projecten).
Zet `DEMO_USE_DATABASE_CONTENT=true` om de inhoud uit `/admin` leidend te maken, zoals bij een
echte klantwebsite.

## Projectstructuur

```
app/
  layout.tsx                 root layout: fonts en metadata
  (site)/layout.tsx          publieke site: instellingen-provider, navbar, footer, sticky CTA, LocalBusiness JSON-LD
  (site)/page.tsx            homepage
  (site)/diensten/           overzicht + [slug] (8 diensten)
  (site)/ons-werk/           voor/na-galerij met sliders
  (site)/werkwijze/          proces, afspraken en FAQ
  (site)/over-ons/  contact/  offerte-aanvragen/  privacy/  cookies/  not-found.tsx
  beheer/                    TagPoint Demo-beheeromgeving (voorbeeldgegevens, demo-login)
  admin/                     dashboard op de database (Supabase Auth): overzicht, aanvragen (+ detail, CSV-export),
                             berichten, projecten, reviews, instellingen
  login/                     login voor /admin
  og/route.tsx               dynamische deelafbeelding (Open Graph)
  api/quote                  POST: offerteaanvraag → database + mails
  api/contact                POST: contactbericht → database + mail
  api/upload                 POST/DELETE: foto-upload naar privé-bucket (sharp: EXIF strip, webp)
  api/health                 GET: controleert de configuratie zonder geheimen te tonen
  sitemap.ts  robots.ts
proxy.ts                     beschermt /admin (sessie) en /beheer (demo-cookie), noindex
components/
  admin/        Shell, LoginForm, QuoteActions, PhotoGallery, QuoteFilters, ProjectForm, ReviewManager, SettingsForm, ui
  demo-admin/   Shell, Wordmark, Drawer, feedback (meldingen), WebsiteEditor, ServicesManager, ProjectsManager,
                BeforeAfterPreview, ReviewsManager, RequestsManager, MediaLibrary, SettingsForm, LoginForm, ui
  layout/       Navbar, Footer, StickyMobileCTA, PageHeader
  sections/     Hero, TrustBar, Intro, ProcessSteps, ReviewsSection, StatsSection, LocationSection, FAQ, CTASection
  services/     ServiceCard, ServiceGrid, ServiceDetail
  before-after/ BeforeAfterSlider, BeforeAfterShowcase, ProjectCard, ProjectGallery
  quote/        QuoteWizard, QuoteWizardLoader, OptionCard, ProgressBar, PhotoUploader, QuoteSuccess
  forms/        ContactForm
  ui/           Button, Logo (inline SVG) + logo-paths, SectionHeading, Field, Reveal, ServiceIcon, JsonLd
  providers/    MotionProvider (reduced motion), SiteSettingsProvider
config/
  site.ts       bedrijfsgegevens (demo), navigatie, CTA's, trust-claims, demoConfig (TagPoint)
  services.ts   8 diensten
  quote.ts      alle wizard-opties + conditionele logica + uploadlimieten
  projects.ts   4 voorbeeldprojecten (voor/na)
  reviews.ts    3 voorbeeldreviews ("Voorbeeldreviews")
  faq.ts        veelgestelde vragen
  demo-admin.ts voorbeeldgegevens voor /beheer (statistieken, aanvragen, media, instellingen)
lib/
  admin/        auth (ADMIN_EMAILS), queries, server actions, statussen
  demo-admin/   demo-sessie (cookie) en login/logout-actions voor /beheer
  supabase/     server clients, ssr (cookie-sessie), env, types
  validation/   zod-schema's (quote, contact) - client én server
  email/        e-mailtemplates (notificatie + klantbevestiging)
  utils/        request (rate limit, IP-hash), quote-number, cn
  settings.ts   site-instellingen (config, optioneel database), gecachet
  reviews.ts    reviews (config, optioneel database)
  projects.ts   projecten (config, optioneel database)
  seo.ts        metadata-helper + JSON-LD (LocalBusiness, Service, Breadcrumb, FAQ)
  analytics.ts  events: quote_started, quote_step_completed, quote_photo_uploaded, quote_submitted, contact_submitted
public/
  brand/        nova-logo.png, nova-logo-light.png, nova-mark.png (+ svg) - gegenereerd
  images/       services/, over-ons/, hero/ - geïllustreerde demo-beelden; projects/ - AI-gegenereerde voor/na-foto's van fictieve woningen
  videos/       hero.mp4 - neutrale, AI-gegenereerde sfeervideo (geen bedrijf of personen herkenbaar)
scripts/
  generate-logo.mjs         logo-set uit Plus Jakarta Sans (fontkit) + beeldmerk
  generate-demo-images.mjs  neutrale illustraties op de paden die de site verwacht
supabase/setup.sql          complete database-setup in één keer (migraties 0001 t/m 0006)
supabase/migrations/        0001 schema · 0002 dashboard · 0003 reviewvelden · 0004 team · 0005 + 0006 voorvoegsel aanvraagnummers
docs/
  DESIGN-SYSTEM.md      kleuren, typografie, componenten, sitemap
  DEPLOYMENT.md         database + e-mail + hosting stap voor stap, env vars, checklist
  HERO-VIDEO.md         hero-video: gebruik, omzetten en prompt om opnieuw te genereren
  ROADMAP.md            wat de demo kan en wat er bij een echte klantwebsite bijkomt
```

## Belangrijkste principes

- **Demo, geen echte claims.** Reviews heten "Voorbeeldreviews", projecten zijn voorbeeldprojecten,
  contactgegevens zijn demogegevens. Nergens wordt gesuggereerd dat het om een bestaand bedrijf gaat.
- **Eigen foto's plaatsen = bestand vervangen.** Alle beelden staan op vaste paden in `public/images`;
  vervang een demo-beeld door een eigen foto met dezelfde bestandsnaam en er hoeft niets in de code te veranderen.
- **Geen automatische prijs.** De wizard verzamelt informatie; het bedrijf beoordeelt en neemt contact op.
- **Privacy by design.** Offertefoto's gaan naar een privé-bucket, EXIF wordt gestript, IP's worden
  gehasht, alles wordt server-side gevalideerd (zod), rate limiting en honeypot op alle formulieren.
- **Responsive.** Sidebar wordt een menu op telefoon, tabellen worden kaarten, sliders werken met touch.
