/**
 * Genereert placeholder-afbeeldingen op exact de paden die de site verwacht.
 *
 * Vervang de bestanden in /public/images door de echte foto's (zelfde bestandsnaam)
 * - er hoeft niets in de code te veranderen. Zie docs/CONTENT-CHECKLIST.md.
 *
 *   node scripts/generate-placeholders.mjs            # maakt alleen ontbrekende bestanden
 *   node scripts/generate-placeholders.mjs --force    # overschrijft alles
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const force = process.argv.includes("--force");
const root = path.resolve(process.cwd(), "public");

const NAVY = "#111c30";
const NAVY2 = "#213453";
const AQUA = "#229bd2";
const AQUA_LIGHT = "#7fcbee";

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function placeholderSvg({ w, h, title, subtitle, tone = "light" }) {
  const dark = tone === "dark";
  const bg1 = dark ? NAVY : "#e1e8f0";
  const bg2 = dark ? NAVY2 : "#c3d0e0";
  const fg = dark ? "#ffffff" : NAVY;
  const sub = dark ? AQUA_LIGHT : "#3d5a84";
  const fs = Math.round(Math.min(w, h) / 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="r" cx="0.15" cy="0.1" r="0.7">
      <stop offset="0" stop-color="${AQUA}" stop-opacity="0.35"/><stop offset="1" stop-color="${AQUA}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#r)"/>
  <g fill="none" stroke="${dark ? "#ffffff" : NAVY}" stroke-opacity="0.08">
    ${Array.from({ length: Math.ceil(w / 64) }, (_, i) => `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="${h}"/>`).join("")}
    ${Array.from({ length: Math.ceil(h / 64) }, (_, i) => `<line x1="0" y1="${i * 64}" x2="${w}" y2="${i * 64}"/>`).join("")}
  </g>
  <g transform="translate(${w / 2} ${h / 2 - fs * 0.9})">
    <path d="M0 -${fs * 1.4} C ${fs * 0.9} -${fs * 0.3}, ${fs * 1.1} ${fs * 0.2}, ${fs * 1.1} ${fs * 0.7} A ${fs * 1.1} ${fs * 1.1} 0 0 1 -${fs * 1.1} ${fs * 0.7} C -${fs * 1.1} ${fs * 0.2}, -${fs * 0.9} -${fs * 0.3}, 0 -${fs * 1.4} Z" fill="${AQUA}" opacity="0.9"/>
  </g>
  <text x="50%" y="${h / 2 + fs * 1.6}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${fs}" fill="${fg}" letter-spacing="1">${esc(title)}</text>
  <text x="50%" y="${h / 2 + fs * 2.6}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(fs * 0.5)}" fill="${sub}">${esc(subtitle)}</text>
</svg>`;
}

/** Placeholder-logo: rond lichtblauw beeldmerk met druppel + tekst. Vervang door het echte logo. */
function logoSvg(size) {
  const s = size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#ffffff"/>
  <circle cx="256" cy="214" r="150" fill="${AQUA_LIGHT}"/>
  <circle cx="256" cy="214" r="150" fill="url(#sh)"/>
  <defs><radialGradient id="sh" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="1" stop-color="${AQUA}" stop-opacity="0.25"/></radialGradient></defs>
  <path d="M256 110 C 300 170, 330 200, 330 240 A 74 74 0 0 1 182 240 C 182 200, 212 170, 256 110 Z" fill="${NAVY}"/>
  <path d="M232 235 a 16 16 0 0 1 16 -16" stroke="#ffffff" stroke-width="10" stroke-linecap="round" fill="none"/>
  <text x="256" y="415" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="46" fill="${NAVY}" letter-spacing="1">ALL IN ONE VASTGOEDONDERHOUD</text>
  <text x="256" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="22" fill="${AQUA}" letter-spacing="4">UW GEVELSPECIALIST</text>
</svg>`;
}

function ogSvg() {
  const w = 1200;
  const h = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient>
    <radialGradient id="r" cx="0.9" cy="0.1" r="0.7"><stop offset="0" stop-color="${AQUA}" stop-opacity="0.5"/><stop offset="1" stop-color="${AQUA}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#r)"/>
  <text x="80" y="200" font-family="Arial, sans-serif" font-size="22" fill="${AQUA_LIGHT}" letter-spacing="6">UW GEVELSPECIALIST · ENSCHEDE</text>
  <text x="80" y="300" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="#ffffff">Een gevel die weer</text>
  <text x="80" y="385" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="72" fill="${AQUA_LIGHT}">gezien mag worden.</text>
  <text x="80" y="470" font-family="Arial, sans-serif" font-size="28" fill="#c3d0e0">Gevelreiniging · Dakpanreiniging · Trespa · Zonnepanelen</text>
  <text x="80" y="560" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="30" fill="#ffffff" letter-spacing="2">ALL IN ONE VASTGOEDONDERHOUD</text>
</svg>`;
}

const files = [
  // Logo - VERVANG door het echte logo (public/images/logo.png, vierkant)
  { file: "images/logo.png", svg: logoSvg(512), format: "png" },
  { file: "images/og-image.jpg", svg: ogSvg(), format: "jpeg" },
  // Hero poster (ook poster voor de Higgsfield-video)
  { file: "images/hero/hero-poster.jpg", svg: placeholderSvg({ w: 1920, h: 1080, title: "HERO FOTO / VIDEO POSTER", subtitle: "Vervang door een echte gevel- of werkfoto (1920×1080)", tone: "dark" }), format: "jpeg" },
  // Diensten
  { file: "images/services/gevelreiniging.jpg", svg: placeholderSvg({ w: 1600, h: 1100, title: "GEVELREINIGING", subtitle: "Vervang door echte werkfoto (public/images/services/gevelreiniging.jpg)" }), format: "jpeg" },
  { file: "images/services/dakpanreiniging.jpg", svg: placeholderSvg({ w: 1600, h: 1100, title: "DAKPANREINIGING", subtitle: "Vervang door echte werkfoto (public/images/services/dakpanreiniging.jpg)" }), format: "jpeg" },
  { file: "images/services/trespa-reiniging.jpg", svg: placeholderSvg({ w: 1600, h: 1100, title: "TRESPA REINIGING", subtitle: "Vervang door echte werkfoto (public/images/services/trespa-reiniging.jpg)" }), format: "jpeg" },
  { file: "images/services/zonnepanelen-reiniging.jpg", svg: placeholderSvg({ w: 1600, h: 1100, title: "ZONNEPANELEN", subtitle: "Vervang door echte werkfoto (public/images/services/zonnepanelen-reiniging.jpg)" }), format: "jpeg" },
  { file: "images/services/bestrating-reiniging.jpg", svg: placeholderSvg({ w: 1600, h: 1100, title: "BESTRATING & TERRAS", subtitle: "Vervang door echte werkfoto (public/images/services/bestrating-reiniging.jpg)" }), format: "jpeg" },
  // Projecten - de aangeleverde before/after-foto's horen hier
  { file: "images/projects/dakpanreiniging-1-voor.jpg", svg: placeholderSvg({ w: 1600, h: 1200, title: "VOOR - PROJECT 1", subtitle: "Aangeleverde foto: dakpannen met mos (close-up)", tone: "dark" }), format: "jpeg" },
  { file: "images/projects/dakpanreiniging-1-na.jpg", svg: placeholderSvg({ w: 1600, h: 1200, title: "NA - PROJECT 1", subtitle: "Aangeleverde foto: schoon dak, woning met dakkapel" }), format: "jpeg" },
  { file: "images/projects/dakpanreiniging-2-voor.jpg", svg: placeholderSvg({ w: 1600, h: 1200, title: "VOOR - PROJECT 2", subtitle: "Aangeleverde foto: vrijstaande woning, hoogwerker", tone: "dark" }), format: "jpeg" },
  { file: "images/projects/dakpanreiniging-2-na.jpg", svg: placeholderSvg({ w: 1600, h: 1200, title: "NA - PROJECT 2", subtitle: "Aangeleverde foto: schoon oranje pannendak" }), format: "jpeg" },
  { file: "images/projects/dakpanreiniging-3-voor.jpg", svg: placeholderSvg({ w: 1600, h: 1200, title: "VOOR - PROJECT 3", subtitle: "Aangeleverde foto: bedrijfspand met groene aanslag", tone: "dark" }), format: "jpeg" },
  { file: "images/projects/dakpanreiniging-3-na.jpg", svg: placeholderSvg({ w: 1600, h: 1200, title: "NA - PROJECT 3", subtitle: "Aangeleverde foto: schoon dak bedrijfspand" }), format: "jpeg" },
  // Over ons / intro
  { file: "images/over-ons/bedrijfsbus.jpg", svg: placeholderSvg({ w: 1400, h: 1400, title: "BEDRIJFSBUS", subtitle: "Aangeleverde foto: bus voor woning (public/images/over-ons/bedrijfsbus.jpg)" }), format: "jpeg" },
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

let created = 0;
for (const f of files) {
  const out = path.join(root, f.file);
  if (!force && (await exists(out))) continue;
  await mkdir(path.dirname(out), { recursive: true });
  let img = sharp(Buffer.from(f.svg));
  img = f.format === "png" ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 80, mozjpeg: true });
  await writeFile(out, await img.toBuffer());
  created++;
  console.log("✓", f.file);
}

// favicon.ico → van het logo (32px PNG in .ico-container is voldoende voor moderne browsers)
const favicon = path.join(process.cwd(), "app", "favicon.ico");
if (force || !(await exists(favicon))) {
  const png = await sharp(Buffer.from(logoSvg(64))).resize(32, 32).png().toBuffer();
  await writeFile(favicon, png);
  console.log("✓ app/favicon.ico");
}

console.log(`\nKlaar: ${created} placeholder(s) aangemaakt. Vervang ze door echte foto's met dezelfde bestandsnaam.`);
