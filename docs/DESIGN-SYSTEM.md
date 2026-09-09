# Design system - All in One Vastgoedonderhoud

## 1. Logo-analyse (basis van alles)

Het aangeleverde logo bevat:

| Element | Wat het uitstraalt | Vertaling naar de site |
| --- | --- | --- |
| Wordmark **ALL IN ONE VASTGOEDONDERHOUD** in zware, donker-navy sans | Betrouwbaar, stevig, no-nonsense | Koppen in Plus Jakarta Sans 700/800, navy-900, strakke tracking |
| Tagline **VASTGOEDONDERHOUD** in goud, uppercase, gespatieerd | Specialisme, helderheid | Eyebrow-stijl: uppercase, tracking 0.18em, gold-600 |
| Lichtblauwe cirkel met sterretjes/glans | Schoon, fris, water | Goud-tinten, zachte radiale gradients (`bg-water`), glow-shadow |
| Waterdruppels bij de borstel | Reiniging, beweging | Druppel-motief in placeholders, slider-handle, subtiele highlights |
| Gele handschoenen | Vakmanschap, klein warm accent | `sun-400` alleen voor sterren in reviews (spaarzaam) |
| Vriendelijke, geïllustreerde vakman | Persoonlijk, toegankelijk, lokaal | Menselijke copy ("Laat ons meekijken"), ronde vormen, geen corporate toon |

## 2. Kleuren (Tailwind tokens in `app/globals.css`)

| Token | Hex | Gebruik |
| --- | --- | --- |
| `navy-950` | #0a1120 | Footer, hero-basis |
| `navy-900` | #111c30 | Primaire donkere kleur: koppen, donkere secties, secondary button |
| `navy-800` | #182741 | Body-tekst |
| `navy-500` | #3d5a84 | Secundaire tekst |
| `navy-100/50` | #e1e8f0 / #f2f5f9 | Randen, lichte achtergronden |
| `goud-500` | #229bd2 | **Primaire CTA**, links, actieve states |
| `gold-600` | #157cb0 | Hover van CTA, eyebrow-tekst |
| `goud-300` | #7fcbee | Accent op donker (tagline in navbar/footer, gradient in hero-kop) |
| `goud-100/50` | #d7eefa / #eef8fd | Zachte highlights, iconachtergronden, water-gradients |
| `sun-400` | #f7c948 | Sterren (reviews). Verder niet gebruiken. |
| wit | #ffffff | Basis |

Vaste combinaties: **wit + navy-900 + goud-500** met navy-50/goud-50 als rustvlakken.
Contrast: goud-500 op wit ≥ 3:1 voor grote tekst/knoppen; body-tekst navy-800 op wit > 12:1.

## 3. Typografie

- **Display**: Plus Jakarta Sans 600-800 (`--font-display`) - koppen, knoppen, stapnummers. Tracking -0.02em.
- **Body**: Inter (`--font-sans`) - alle lopende tekst, formulieren. 15-18px, leading 1.6.
- Beide via `next/font/google`, self-hosted, `display: swap`.
- Schaal: H1 40/60/72px · H2 30/36/44px · H3 20-24px · body 16-18px · eyebrow 12px uppercase 0.18em.

## 4. Vorm & diepte

- Radii: cards `rounded-3xl` (28px), grote panelen `rounded-4xl` (36px), knoppen/pills `rounded-full`.
- Schaduwen: `shadow-soft` (rust), `shadow-lift` (hover/prominent), `shadow-glow` (goud, succes-state).
- Water-thema: `bg-water` (lichte radiale blauwtinten), `bg-navy-water` (donker met goud-glow), `bg-grid-faint` (fijn raster op donker).
- Beweging: fade-up bij scrollen (Framer `whileInView`), hover-lift op cards (-4px), image-zoom 1.06, icon-tilt. Alles via `--ease-out-expo`. `prefers-reduced-motion` → alleen korte opacity-fades (MotionConfig).

## 5. Componenten

| Component | Bestand | Notities |
| --- | --- | --- |
| Button | `components/ui/Button.tsx` | primary (goud), secondary (navy), ghost, white, outline-white; werkt als `<a>` bij `href` |
| Logo | `components/ui/Logo.tsx` | Leest `/images/logo.png`; tekstdeel verbergt op < 480px |
| SectionHeading | `components/ui/SectionHeading.tsx` | eyebrow + titel + beschrijving, light/inverted |
| Field/TextInput/TextArea/Checkbox | `components/ui/Field.tsx` | Fout- en hint-states, aria-describedby |
| Reveal/StaggerGroup/StaggerItem | `components/ui/Reveal.tsx` | Scroll-animaties |
| Navbar | `components/layout/Navbar.tsx` | Transparant op home → solid na 24px scroll; mobiel fullscreen menu |
| StickyMobileCTA | `components/layout/StickyMobileCTA.tsx` | [Bel direct] alleen bij bekend nummer |
| Hero | `components/sections/Hero.tsx` | Poster + doorlopende achtergrondvideo (desktop én mobiel, herstart zichzelf na blokkade of pauze) |
| BeforeAfterSlider | `components/before-after/BeforeAfterSlider.tsx` | Pointer + touch + keyboard, `role="slider"`, clip-path |
| ServiceCard | `components/services/ServiceCard.tsx` | Hover-lift, uitklapbare voordelen |
| QuoteWizard | `components/quote/QuoteWizard.tsx` | 10 stappen, conditioneel, concept in sessionStorage, client-only |
| PhotoUploader | `components/quote/PhotoUploader.tsx` | Drag & drop, XHR-progress, thumbnails, retry, verwijderen |

## 6. Sitemap

```
/                         Home (hero, trust, intro, before/after, diensten, werkwijze, werkgebied, FAQ, CTA)
/diensten                 Overzicht
/gevelreiniging           Pillar-pagina (SEO: "gevelreiniging Enschede")
/diensten/dakpanreiniging
/diensten/trespa-reiniging
/diensten/zonnepanelen-reiniging
/before-after             Galerij met filter
/over-ons
/contact                  Formulier + gegevens
/offerte-aanvragen        Wizard (?dienst=gevel|dak|trespa|zonnepanelen|anders voor prefill)
/privacy  /cookies
/sitemap.xml  /robots.txt
```

Bewust géén losse plaatsnaam-pagina's (Hengelo, Oldenzaal, …) zolang het werkgebied niet bevestigd is -
een SEO-pagina zonder unieke inhoud schaadt meer dan hij oplevert.

## 7. UX-flow offertewizard

```
1 Dienst  →  2 Pand  →  3 Oppervlak (afhankelijk van dienst)  →  4 Omvang (+ optioneel m²)
→  5 Vervuiling (multi, afhankelijk van dienst)  →  6 Foto's (optioneel, max 8)
→  7 Locatie  →  8 Planning  →  9 Contact  →  10 Controle + privacy-akkoord  →  Verzenden
→  Succes: aanvraagnummer AIC-JJJJ-NNNN
```

- Validatie per stap (client) én volledig (server, zelfde zod-regels).
- Terugspringen naar de juiste stap bij serverfouten.
- Concept wordt in sessionStorage bewaard (zonder foto's) - ververst de gebruiker, dan gaat niets verloren.
- Dubbele submissions worden geblokkeerd; verzenden wacht tot alle uploads klaar zijn.
- Analytics-events op elke stap → funnel-analyse.
