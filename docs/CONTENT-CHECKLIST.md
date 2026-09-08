# Content-checklist — wat nog ingevuld/aangeleverd moet worden

Alles hieronder is bewust **niet verzonnen**. De site werkt nu met placeholders; vul aan en de
site past zich automatisch aan.

## A. Foto's (vervang het placeholderbestand, zelfde bestandsnaam)

| # | Bestand in `public/images/` | Wat | Prioriteit |
| --- | --- | --- | --- |
| 1 | `logo.png` | Het aangeleverde logo, vierkant (bijv. 512×512), witte of transparante achtergrond | **Essentieel** |
| 2 | `hero/hero-poster.jpg` | Hero-foto 1920×1080: gevel/dak, liefst half schoon–half vuil, of werkfoto met bus. Ook poster voor de video. | **Essentieel** |
| 3 | `projects/dakpanreiniging-1-voor.jpg` + `-na.jpg` | Aangeleverd: dakpannen close-up met mos → schoon dak woning met dakkapel | **Essentieel** |
| 4 | `projects/dakpanreiniging-2-voor.jpg` + `-na.jpg` | Aangeleverd: vrijstaande woning met hoogwerker → schoon oranje dak | **Essentieel** |
| 5 | `projects/dakpanreiniging-3-voor.jpg` + `-na.jpg` | Aangeleverd: bedrijfspand met groene aanslag → schoon dak | **Essentieel** |
| 6 | `over-ons/bedrijfsbus.jpg` | Aangeleverd: bedrijfsbus voor woning (vierkant werkt het best) | **Essentieel** |
| 7 | `services/gevelreiniging.jpg` | Werkfoto gevelreiniging (16:11) | Belangrijk |
| 8 | `services/dakpanreiniging.jpg` | Werkfoto dakpanreiniging (kan een "na"-foto zijn) | Belangrijk |
| 9 | `services/trespa-reiniging.jpg` | Werkfoto trespa/gevelbekleding | Belangrijk |
| 10 | `services/zonnepanelen-reiniging.jpg` | Werkfoto zonnepanelen | Belangrijk |
| 11 | `og-image.jpg` | Social-share afbeelding 1200×630 (mag de placeholder blijven, liever een echte foto met logo) | Optioneel |
| 12 | Teamfoto / eigenaar | Voor /over-ons (vervang het placeholderblok in `app/over-ons/page.tsx`) | Optioneel |
| 13 | Extra before/after-projecten van gevel, trespa, zonnepanelen | Voeg toe in `config/projects.ts` of later via Supabase `projects` | Optioneel, sterk aanbevolen |
| 14 | Apparatuur/werkfoto's | Sfeer, voor diensten en over-ons | Optioneel |

Tips: de before/after-slider werkt het beste als "voor" en "na" vanuit hetzelfde standpunt zijn
gemaakt (zelfde hoogte, zelfde uitsnede). Minimaal 1600px breed, JPG. De aangeleverde collages
(VOOR/NA in één afbeelding) moeten worden gesplitst in twee losse bestanden zonder het
"VOOR/NA"-label — de slider voegt de labels zelf toe.

## B. Bedrijfsinformatie (`config/site.ts`)

| Veld | Nu | Nodig |
| --- | --- | --- |
| `phone` | `null` → [TELEFOONNUMMER] verborgen | Telefoonnummer (activeert "Bel direct"-knoppen) |
| `email` | `null` | E-mailadres |
| `whatsapp` | `null` | Optioneel WhatsApp-nummer |
| `address` | alleen "Enschede" | Straat + postcode (mag leeg blijven bij werken vanuit huis) |
| `kvk`, `btw` | `null` | KvK-nummer (verplicht in footer/privacy voor een bedrijf) |
| `openingHours` | `null` | Bijv. `[{ days: "Ma–Vr", hours: "08:00-18:00" }]` |
| `workAreas` | Enschede + omgeving | Bevestigde plaatsen (Hengelo, Oldenzaal, Haaksbergen, …) |
| `socialLinks` | `null` | Instagram / Facebook / Google Business Profile URL |
| `url` | placeholder-domein | Definitieve domeinnaam |
| `trustItems` | 4 feitelijke claims | Aanvullen met USP's als die bevestigd zijn |
| `stats` | `null` (sectie verborgen) | Alleen echte cijfers (jaar ervaring, projecten) |

## C. Diensten (`config/services.ts`)

- Bevestig de vier diensten van de bus: **gevelreiniging, dakpanreiniging, trespa, zonnepanelen**.
- Zijn er méér diensten (bestrating, terras, oprit, houtwerk, dakgoten)? Toevoegen als object in
  `services` en als optie in `config/quote.ts` → `serviceOptions`.
- Controleer de teksten per dienst op juistheid (methodes, wat wel/niet kan).

## D. Reviews (`config/reviews.ts`)

- Alleen echte reviews. Tot die tijd wordt de reviewsectie **niet** getoond.
- `googleRating` invullen met het echte gemiddelde + aantal uit Google Business Profile.

## E. Projecten (`config/projects.ts`)

- `location` staat nu op "Regio Enschede" — vervang door de echte plaats per project (bijv. "Enschede-Zuid", "Hengelo").
- Controleer titels/omschrijvingen van de drie dakprojecten.

## F. Juridisch

- `app/privacy/page.tsx`: bewaartermijn, KvK, contactadres, datum → laten controleren.
- `app/cookies/page.tsx`: bijwerken zodra analytics wordt toegevoegd (cookiebanner nodig bij GA4).

## G. Certificeringen / garanties / keurmerken

- Nog niets bekend → niets getoond. Aanleveren indien aanwezig (VCA, verzekering, garantie).
