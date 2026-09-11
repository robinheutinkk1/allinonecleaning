# Hero-video

De homepage gebruikt een korte, neutrale sfeervideo (AI-gegenereerd) van een gevel die schoon wordt.
Er is geen bedrijf, logo of persoon herkenbaar; de video is sfeerbeeld en wordt nergens als echt
project gepresenteerd.

- Bestand: `public/videos/hero.mp4` (H.264 High, 1920×1080, 24 fps, geen audio, ±1,6 MB, faststart).
  De laatste 0,8 s vloeit over in de eerste 0,8 s zodat de loop niet hard springt.
- Poster: `public/images/hero/hero-poster.jpg` (frame op 4,3 s: half vuil, half schoon).
- Origineel (HEVC 10-bit): `assets/originals/hero-higgsfield-variant-b.mp4` (niet publiek geserveerd).
- Uitschakelen: `NEXT_PUBLIC_HERO_VIDEO_SRC=""` of in het dashboard bij Instellingen.

## Gedrag op de site

`components/sections/Hero.tsx` toont de poster altijd en start de video op desktop én mobiel
(gedempt, loop, geen controls). Bij databesparing of een 2G-verbinding wordt de video niet geladen.
Als autoplay geblokkeerd wordt, blijft de poster staan en probeert de site het opnieuw bij de eerste
aanraking of scroll.

## Opnieuw omzetten vanuit een origineel (ffmpeg ≥ 4.0)

```
ffmpeg -i origineel.mp4 -filter_complex "[0:v]format=yuv420p,split=3[m][t][h];[m]trim=0:7.2,setpts=PTS-STARTPTS[main];[t]trim=7.2:8,setpts=PTS-STARTPTS[tail];[h]trim=0:0.8,setpts=PTS-STARTPTS[head];[tail][head]blend=all_expr='A*(1-min(T/0.8\,1))+B*min(T/0.8\,1)'[x];[main][x]concat=n=2:v=1:a=0[v]" -map "[v]" -an -c:v libx264 -profile:v high -preset slow -crf 29 -movflags +faststart -r 24 public/videos/hero.mp4
ffmpeg -ss 4.3 -i origineel.mp4 -frames:v 1 -vf "scale=1920:1080" -q:v 3 public/images/hero/hero-poster.jpg
```

## Prompt om een nieuwe variant te genereren (image-to-video of text-to-video)

```
Photorealistic premium commercial shot for a professional exterior-maintenance company.
Static tripod camera, slow subtle push-in. Close-up of a weathered red-brick residential
facade with realistic grey grime, green algae streaks and moss in the mortar joints. Soft overcast
daylight, natural shadows, realistic brick texture and mortar detail.

From the left edge, a fine professional low-pressure cleaning water stream sweeps slowly across
the wall. Where the water passes, the grime and green algae dissolve naturally and progressively,
revealing clean warm red brick and pale mortar underneath. Realistic water physics: fine mist,
small droplets running down the brick, subtle reflections on the wet surface, no foam.

In the final seconds the camera slowly pulls back a little to reveal a larger clean section of
the facade next to the remaining dirty section - a clear, calm before/after contrast.

Look: high-end commercial photography, natural colours, shallow depth of field, calm and
trustworthy, clean and fresh. No people, no hands, no equipment fully in frame - only the water
stream entering from the edge. No text, no logos.
```

Aspect ratio 16:9, duur 6-8 seconden, static tripod met lichte push-in, lage motion strength.

Vermijden: distorted people, warped equipment, floating objects, melting bricks, fantasy effects,
glowing water, excessive camera movement, cartoon look, foam, text, watermark, logo, lens flare,
oversaturated colours, sudden transformation.

Voorwaarden voor plaatsing: bestandsgrootte ≤ 2,5 MB, geen personen of logo's in beeld, en na
plaatsing een Lighthouse-check (de LCP moet de poster blijven, niet de video).
