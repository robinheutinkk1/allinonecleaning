# Higgsfield hero-video — kant-en-klare prompt

## Gegenereerde varianten (8 sep 2026, Seedance 2.5, 1080p, 8 s, 16:9, geen audio)

Twee varianten zijn met onderstaande prompt gegenereerd in het Higgsfield-account (72 credits):

| Variant | Job-ID | Download |
| --- | --- | --- |
| A | `5657d9f3-c371-4ed6-b45d-d67b43d4468e` | https://d8j0ntlcm91z4.cloudfront.net/user_3IPQTipuci80tqMBohnShvKQrg2/hf_20260908_213538_5657d9f3-c371-4ed6-b45d-d67b43d4468e.mp4 |
| B | `eb5001a8-099c-4bd5-ad37-858e83879447` | https://d8j0ntlcm91z4.cloudfront.net/user_3IPQTipuci80tqMBohnShvKQrg2/hf_20260908_213538_eb5001a8-099c-4bd5-ad37-858e83879447.mp4 |

De video's konden vanuit de bouwomgeving niet worden gedownload (netwerkbeleid), dus ze zijn
**nog niet in de repo geplaatst en nog niet beoordeeld**. Stappen om te plaatsen:

1. Bekijk beide varianten in Higgsfield (Generations) en check op: realistisch water, geen vervormde
   stenen, geen "explosie"-effect, geen tekst/artefacten. Twijfel → poster gebruiken, geen video.
2. Comprimeer de gekozen variant (ffmpeg, doel ≤ 2,5 MB):
   `ffmpeg -i hero.mp4 -an -vf "scale=1920:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart public/videos/hero.mp4`
3. Poster uit het eerste frame: `ffmpeg -i public/videos/hero.mp4 -frames:v 1 -q:v 3 public/images/hero/hero-poster.jpg`
4. `.env`: `NEXT_PUBLIC_HERO_VIDEO_SRC=/videos/hero.mp4` → de hero speelt de video op desktop, poster op mobiel.

## Advies: wel of geen video?

**Ja, mits goed.** Een 6–8 seconden loop van een vervuilde gevel die schoon wordt is exact de
boodschap van de site ("Kijk naar het verschil") en werkt op desktop als rustige achtergrond achter
de hero-tekst. Voorwaarden:

- Alleen op **desktop** (≥ 768px). Op mobiel wordt automatisch de statische poster gebruikt
  (`components/sections/Hero.tsx`) — data en batterij.
- **Nooit** als "echt project" presenteren. De video is sfeerbeeld; de before/after-sectie
  toont echte foto's.
- Bestandsgrootte ≤ 2,5 MB (H.264 MP4, 1920×1080, 24 fps, geen audio). Anders: niet gebruiken.
- Kwaliteitscheck: geen vervormde apparatuur, geen mensen in beeld, geen "explosie"-effect.
  Twijfel? Poster gebruiken. De site verliest niets.

Activeren: video op `public/videos/hero.mp4`, poster op `public/images/hero/hero-poster.jpg`
(eerste frame van de video, 1920×1080), en in `.env`: `NEXT_PUBLIC_HERO_VIDEO_SRC=/videos/hero.mp4`.

## Prompt (image-to-video of text-to-video)

```
Photorealistic premium commercial shot for a professional Dutch exterior-cleaning company.
Static tripod camera, slow subtle push-in. Close-up of a weathered Dutch red-brick residential
facade with realistic grey grime, green algae streaks and moss in the mortar joints. Soft overcast
Dutch daylight, natural shadows, realistic brick texture and mortar detail.

From the left edge, a fine professional low-pressure cleaning water stream sweeps slowly across
the wall. Where the water passes, the grime and green algae dissolve naturally and progressively,
revealing clean warm red brick and pale mortar underneath. Realistic water physics: fine mist,
small droplets running down the brick, subtle reflections on the wet surface, no foam.

In the final seconds the camera slowly pulls back a little to reveal a larger clean section of
the facade next to the remaining dirty section — a clear, calm before/after contrast.

Look: high-end commercial photography, natural colours, shallow depth of field, calm and
trustworthy, clean and fresh. No people, no hands, no equipment fully in frame — only the water
stream entering from the edge. No text, no logos.
```

**Aspect ratio**: 16:9 (1920×1080). Optioneel een 9:16-variant voor social, niet voor de site.
**Duur**: 6–8 seconden, naadloos te loopen (laatste frame ≈ eerste frame is niet nodig; de site
loopt met een zachte overlay, een harde cut valt nauwelijks op achter de donkere overlay).
**Camera**: static tripod, slow push-in 5–10%, geen pans/tilts, geen handheld.
**Motion strength**: laag–gemiddeld (rustig water, geen snelle bewegingen).
**Seed/variaties**: genereer 3–4 varianten, kies degene met het meest realistische water.

### Negative prompt / vermijden

```
distorted people, extra fingers, unrealistic hands, warped pressure washer, floating objects,
unrealistic architecture, melting bricks, fantasy effects, glowing water, excessive camera
movement, handheld shake, cartoon look, plastic textures, fake looking water, foam, soap bubbles,
AI artifacts, text, watermark, logo, distorted text, lens flare, oversaturated colours, HDR look,
sudden transformation, explosion, sparkles
```

### Eindkaart (optioneel, buiten de video om)

De afsluiting "ALL IN ONE CLEANING — UW GEVELSPECIALIST" wordt **niet** in de video gebakken
(tekstdistorsie-risico). De hero-tekst en het logo staan al als HTML over de video.

## Gebruik op desktop

- `<video autoplay muted loop playsinline preload="metadata" poster="…">` achter een navy-overlay
  (gradient van 95% → 20%) zodat de witte tekst en de aqua-CTA altijd leesbaar blijven.
- Lighthouse-check na plaatsing: LCP moet de poster (`priority`) blijven, niet de video.

## Gebruik op mobiel

- Video wordt niet geladen (`hidden md:block`); de poster is de hero-afbeelding.
- Kies daarom een poster-frame dat er ook zonder beweging goed uitziet (halve gevel schoon,
  halve gevel vuil is ideaal: het before/after-idee in één beeld).

## Alternatieve prompt: dakpannen (past bij de aangeleverde projectfoto's)

```
Photorealistic commercial close-up of a Dutch clay-tiled roof (orange-red tiles) covered with moss
and dark green algae. Overcast daylight. A gentle professional cleaning stream sweeps across the
tiles from the top; moss and algae lift away naturally, revealing the clean warm orange tiles.
Realistic water droplets running along the tile ridges, subtle wet reflections. Static camera with
a slow push-in. No people, no equipment in frame, no text.
```
