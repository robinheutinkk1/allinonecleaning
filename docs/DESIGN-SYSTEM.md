# Design system - NOVA Onderhoud (TagPoint demo)

## 1. Merk

NOVA Onderhoud is een fictief onderhoudsbedrijf. Het merk is bewust rustig en professioneel:
donker navy als basis, goud als accent, veel wit en lichtgrijs als rustvlakken.

| Element | Uitstraling | Vertaling naar de site |
| --- | --- | --- |
| Woordmerk **NOVA** (Plus Jakarta Sans ExtraBold) met **ONDERHOUD** gespatieerd eronder | Modern, stevig, helder | Koppen in Plus Jakarta Sans 700/800, navy-900, strakke tracking |
| Beeldmerk: gouden tegel met dakvorm en basislijn | Pand, onderhoud, zorg | Favicon, app-iconen, TagPoint-wordmark in het beheer |
| Goud als accent | Kwaliteit, warmte | Primaire CTA, eyebrow-tekst, iconen, actieve states |

Het logo is inline SVG (`components/ui/Logo.tsx` + `logo-paths.ts`), gegenereerd door
`scripts/generate-logo.mjs`. Bitmapvarianten voor e-mail en deelafbeeldingen staan in `public/brand`.

## 2. Kleuren (Tailwind tokens in `app/globals.css`)

| Token | Hex | Gebruik |
| --- | --- | --- |
| `navy-950` | #0a1120 | Footer, hero-basis, beheer-sidebar |
| `navy-900` | #111c30 | Koppen, donkere secties, secondary button |
| `navy-800` | #182741 | Body-tekst |
| `navy-500` | #3d5a84 | Secundaire tekst |
| `navy-100/50` | #e1e8f0 / #f2f5f9 | Randen, lichte achtergronden |
| `gold-500` | #d9a23a | **Primaire CTA**, beeldmerk, actieve states |
| `gold-600/700` | donkerder goud | Hover van CTA, eyebrow-tekst op licht |
| `gold-300` | #ecc76a | Accent op donker (hero-kop gradient, eyebrow op navy) |
| `gold-100/50` | zacht goud | Iconachtergronden, highlights |
| `sun-400` | #f7c948 | Sterren (reviews). Verder niet gebruiken. |
| wit | #ffffff | Basis |

Vaste combinaties: **wit + navy-900 + gold-500** met navy-50/gold-50 als rustvlakken.

## 3. Typografie

- **Display**: Plus Jakarta Sans 600-800 (`--font-display`) - koppen, knoppen, stapnummers. Tracking -0.02em.
- **Body**: Inter (`--font-sans`) - lopende tekst, formulieren. 15-18px, leading 1.6.
- Beide via `next/font/google`, self-hosted, `display: swap`.
- Schaal: H1 40/60/72px · H2 30/36/44px · H3 20-24px · body 16-18px · eyebrow 12px uppercase 0.18em.

## 4. Vorm en diepte

- Radii: cards `rounded-3xl` (28px), grote panelen `rounded-4xl` (36px), knoppen/pills `rounded-full`.
- Schaduwen: `shadow-soft` (rust), `shadow-lift` (hover/prominent), `shadow-glow` (goud).
- Achtergronden: `bg-water` (licht met zachte radiale gloed), `bg-navy-water` (donker met goud-glow), `bg-grid-faint` (fijn raster op donker).
- Beweging: fade-up bij scrollen (Framer `whileInView`), hover-lift op cards, image-zoom 1.06, icon-tilt.
  `prefers-reduced-motion` → alleen korte opacity-fades (MotionConfig).

## 5. Componenten

| Component | Bestand | Notities |
| --- | --- | --- |
| Button | `components/ui/Button.tsx` | primary (goud), secondary (navy), ghost, outline-white; werkt als `<a>` bij `href` |
| Logo | `components/ui/Logo.tsx` | Inline SVG; `inverted` voor donkere vlakken, `variant="mark"` voor alleen het beeldmerk |
| SectionHeading | `components/ui/SectionHeading.tsx` | eyebrow + titel + beschrijving, light/inverted |
| Field/TextInput/TextArea/Checkbox | `components/ui/Field.tsx` | Fout- en hint-states, aria-describedby |
| Reveal/StaggerGroup/StaggerItem | `components/ui/Reveal.tsx` | Scroll-animaties |
| Navbar | `components/layout/Navbar.tsx` | Transparant op home → solid na 24px scroll; mobiel fullscreen menu |
| StickyMobileCTA | `components/layout/StickyMobileCTA.tsx` | [Bel direct] + [Offerte aanvragen] op telefoon |
| Hero | `components/sections/Hero.tsx` | Poster + doorlopende achtergrondvideo |
| BeforeAfterSlider | `components/before-after/BeforeAfterSlider.tsx` | Pointer + touch + keyboard, `role="slider"`, clip-path |
| ServiceCard | `components/services/ServiceCard.tsx` | Hover-lift, uitklapbare voordelen |
| QuoteWizard | `components/quote/QuoteWizard.tsx` | 10 stappen, conditioneel, concept in sessionStorage, client-only |
| PhotoUploader | `components/quote/PhotoUploader.tsx` | Drag & drop, XHR-progress, thumbnails, retry, verwijderen |
| DemoShell / DemoDrawer | `components/demo-admin/` | Beheeromgeving: sidebar (desktop), menu + tabbalk (telefoon), zijpaneel voor bewerken |

## 6. Sitemap

```
/                         Home (hero, trust, intro, ons werk, diensten, werkwijze, reviews, werkgebied, FAQ, CTA)
/diensten                 Overzicht
/diensten/<slug>          gevelreiniging, dakreiniging, zonnepanelen-reinigen, terras-en-bestrating,
                          schilderwerk, houtrotherstel, periodiek-onderhoud, renovatie
/ons-werk                 Voor/na-galerij met filter
/werkwijze                Proces, afspraken, FAQ
/over-ons
/contact                  Formulier + gegevens
/offerte-aanvragen        Wizard (?dienst=gevel|dak|zonnepanelen|bestrating|schilderwerk|houtrot|onderhoud|renovatie|anders)
/privacy  /cookies
/beheer                   TagPoint Demo-beheeromgeving
/admin                    Dashboard op de database
/sitemap.xml  /robots.txt
```

## 7. UX-flow offerteaanvraag

```
1 Wat moet er gebeuren  →  2 Pand  →  3 Oppervlak (afhankelijk van dienst)  →  4 Omvang (+ optioneel m²)
→  5 Situatie (multi, afhankelijk van dienst)  →  6 Foto's (optioneel, max 8)
→  7 Locatie  →  8 Planning  →  9 Contact  →  10 Controle + privacy-akkoord  →  Verzenden
→  Succes: aanvraagnummer NOVA-JJJJ-NNNN
```

- Validatie per stap (client) én volledig (server, zelfde zod-regels).
- Concept wordt in sessionStorage bewaard (zonder foto's).
- Dubbele submissions worden geblokkeerd; verzenden wacht tot alle uploads klaar zijn.
- Analytics-events op elke stap → funnel-analyse.
