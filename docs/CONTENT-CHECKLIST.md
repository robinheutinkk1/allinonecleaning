# Content-checklist - wat nog ingevuld/aangeleverd moet worden

Alles hieronder is bewust **niet verzonnen**. De site werkt nu met placeholders; vul aan en de
site past zich automatisch aan.

## A. Foto's

De originele uploads staan in `assets/originals/` (niet publiek). `node scripts/process-photos.mjs`
splitst de VOOR/NA-collages, snijdt de labels weg en zet alles op de juiste paden in `public/images/`.

| # | Bestand in `public/images/` | Status | Prioriteit |
| --- | --- | --- | --- |
| 1 | `logo.png` | ✅ Echt logo geplaatst (512×512) | - |
| 2 | `hero/hero-poster.jpg` | ✅ Werkfoto gevelreiniging (16:9 uitsnede). Liever een scherpere foto van ≥ 1920px breed? Vervang het bestand. | Verbeteren |
| 3 | `projects/gevelreiniging-1-voor/na.jpg` | ✅ Bungalow gele baksteen | - |
| 4 | `projects/gevelreiniging-2-voor/na.jpg` | ✅ Woning lichte gevelsteen | - |
| 5 | `projects/dakpanreiniging-1…4-voor/na.jpg` | ✅ Vier dakprojecten | - |
| 6 | `over-ons/bedrijfsbus.jpg` | ✅ Bus voor woning | - |
| 7 | `services/gevelreiniging.jpg` | ✅ Werkfoto (vakman op gevel) | - |
| 8 | `services/dakpanreiniging.jpg` | ✅ "Na"-foto woning met dakkapel | - |
| 9 | `services/trespa-reiniging.jpg` | ⬜ Placeholder - werkfoto trespa/gevelbekleding nodig | **Belangrijk** |
| 10 | `services/zonnepanelen-reiniging.jpg` | ⬜ Placeholder - werkfoto zonnepanelen nodig | **Belangrijk** |
| 11 | `og-image.jpg` | ⬜ Placeholder (1200×630) - liever een echte foto met logo | Optioneel |
| 12 | Teamfoto / eigenaar | ⬜ Voor /over-ons (vervang het placeholderblok in `app/over-ons/page.tsx`) | Optioneel |
| 13 | Before/after van trespa en zonnepanelen | ⬜ Voeg toe in `config/projects.ts` of later via Supabase `projects` | Aanbevolen |

Tips voor nieuwe foto's: maak "voor" en "na" vanuit hetzelfde standpunt en zonder VOOR/NA-tekst
in beeld (de slider voegt de labels zelf toe). Minimaal 1600px breed, JPG. Nieuwe originelen in
`assets/originals/` zetten, bestandsnaam toevoegen aan `scripts/process-photos.mjs` en het script draaien.

## B. Bedrijfsinformatie (`config/site.ts`)

Bron voor de ingevulde gegevens: de huidige website allinone-cleaning.nl (via zoekresultaten;
de site en de gedeelde Google-link waren vanuit de bouwomgeving niet direct bereikbaar).
Controleer de overgenomen gegevens voor livegang.

| Veld | Nu | Nodig |
| --- | --- | --- |
| `phone` | ✅ `06 58947413` (bron: allinone-cleaning.nl) | Controleren of dit nummer klopt |
| `method` | ✅ Lage druk + biologisch afbreekbare middelen, geen hogedruk/stoom | Controleren |
| `audiences` | ✅ Particulieren, bedrijven, instellingen, VvE's | Controleren |
| `email` | `null` | E-mailadres |
| `whatsapp` | `null` | Optioneel WhatsApp-nummer |
| `address` | alleen "Enschede" | Straat + postcode (mag leeg blijven bij werken vanuit huis) |
| `kvk`, `btw` | `null` | KvK-nummer (verplicht in footer/privacy voor een bedrijf) |
| `openingHours` | `null` | Bijv. `[{ days: "Ma-Vr", hours: "08:00-18:00" }]` |
| `workAreas` | Enschede + omgeving | Bevestigde plaatsen (Hengelo, Oldenzaal, Haaksbergen, …) |
| `socialLinks` | `null` | Instagram / Facebook / Google Business Profile URL |
| `url` | placeholder-domein | Definitieve domeinnaam |
| `trustItems` | 4 feitelijke claims | Aanvullen met USP's als die bevestigd zijn |
| `stats` | `null` (sectie verborgen) | Alleen echte cijfers (jaar ervaring, projecten) |

## C. Diensten (`config/services.ts`)

- Vijf diensten op de site: **gevelreiniging, dakpanreiniging (incl. dakgoten), trespa, zonnepanelen,
  bestrating/terras**. De eerste vier staan op de bus; bestrating, terras en dakgoten komen van allinone-cleaning.nl.
- Op de oude site staan ook glasbewassing en opleveringsschoonmaak. Die zijn bewust niet als dienst
  opgenomen (focus op gevel en dak); "Ramen / glasbewassing" is wel kiesbaar onder "Anders" in de wizard.
- Werkfoto voor bestrating ontbreekt nog: `public/images/services/bestrating-reiniging.jpg` is een placeholder.
- Controleer de teksten per dienst op juistheid (methodes, wat wel/niet kan).

## D. Reviews (`config/reviews.ts`)

- Alleen echte reviews. Tot die tijd wordt de reviewsectie **niet** getoond.
- `googleRating` invullen met het echte gemiddelde + aantal uit Google Business Profile.

## E. Projecten (`config/projects.ts`)

- `location` staat nu op "Regio Enschede" - vervang door de echte plaats per project (bijv. "Enschede-Zuid", "Hengelo").
- Controleer titels/omschrijvingen van de drie dakprojecten.

## F. Juridisch

- `app/privacy/page.tsx`: bewaartermijn, KvK, contactadres, datum → laten controleren.
- `app/cookies/page.tsx`: bijwerken zodra analytics wordt toegevoegd (cookiebanner nodig bij GA4).

## G. Certificeringen / garanties / keurmerken

- Nog niets bekend → niets getoond. Aanleveren indien aanwezig (VCA, verzekering, garantie).
