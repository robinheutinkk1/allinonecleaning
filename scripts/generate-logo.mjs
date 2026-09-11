/**
 * Genereert het NOVA Onderhoud-logo: een typografisch woordmerk met een subtiel
 * geometrisch beeldmerk. De lettervormen komen uit Plus Jakarta Sans (assets/fonts)
 * en worden omgezet naar SVG-paden, zodat het logo overal scherp is en niet van
 * een webfont afhankelijk is.
 *
 *   node scripts/generate-logo.mjs
 *
 * Uitvoer:
 * - components/ui/logo-paths.ts     paddata voor het inline-SVG-logo (Logo.tsx)
 * - public/brand/nova-logo.png       primair logo, navy tekst, transparant
 * - public/brand/nova-logo-light.png lichte variant, witte tekst, transparant (donkere vlakken, e-mail, OG)
 * - public/brand/nova-mark.png       alleen het beeldmerk
 * - app/icon.png, app/apple-icon.png, app/favicon.ico
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const fontkit = createRequire(import.meta.url)("fontkit");

const root = process.cwd();
const fonts = {
  extraBold: fontkit.openSync(path.join(root, "assets/fonts/PlusJakartaSans-ExtraBold.ttf")),
  medium: fontkit.openSync(path.join(root, "assets/fonts/PlusJakartaSans-Medium.ttf")),
};

const GOLD = "#d9a23a";
const NAVY = "#111c30";

/** Tekst naar één SVG-pad (in logo-eenheden), met optionele letterspatiëring. */
function textPath(font, text, { size, x, baseline, tracking = 0 }) {
  const scale = size / font.unitsPerEm;
  const run = font.layout(text);
  let cursor = x;
  const parts = [];
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const p = glyph.path.transform(scale, 0, 0, -scale, cursor + pos.xOffset * scale, baseline - pos.yOffset * scale);
    const d = p.toSVG();
    if (d) parts.push(d);
    cursor += pos.xAdvance * scale + tracking;
  });
  const width = cursor - x - tracking;
  return { d: round(parts.join(" ")), width };
}

function round(d) {
  return d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 100) / 100));
}

// Layout in logo-eenheden. Het beeldmerk is 100 x 100; het woordmerk staat rechts.
const ICON = 100;
const GAP = 26;
const nova = textPath(fonts.extraBold, "NOVA", { size: 68, x: ICON + GAP, baseline: 56, tracking: -1 });
const onderhoud = textPath(fonts.medium, "ONDERHOUD", { size: 21.5, x: ICON + GAP + 1.5, baseline: 88, tracking: 4.4 });
const WIDTH = Math.ceil(ICON + GAP + Math.max(nova.width, onderhoud.width) + 2);
const HEIGHT = 100;

/**
 * Beeldmerk: afgeronde gouden tegel met een strakke dakvorm en een basislijn.
 * Leest als 'pand en onderhoud', werkt op licht, donker en transparant.
 */
const iconPaths = {
  tile: "M24 0H76C89.25 0 100 10.75 100 24V76C100 89.25 89.25 100 76 100H24C10.75 100 0 89.25 0 76V24C0 10.75 10.75 0 24 0Z",
  roof: "M27 58L50 35L73 58",
  base: "M36 71H64",
};

const ts = `/**
 * Paddata van het NOVA Onderhoud-logo. Gegenereerd door scripts/generate-logo.mjs;
 * niet met de hand bewerken.
 */
export const logoPaths = {
  width: ${WIDTH},
  height: ${HEIGHT},
  icon: {
    size: ${ICON},
    tile: "${iconPaths.tile}",
    roof: "${iconPaths.roof}",
    base: "${iconPaths.base}",
  },
  nova: "${nova.d}",
  onderhoud: "${onderhoud.d}",
} as const;
`;

await writeFile(path.join(root, "components/ui/logo-paths.ts"), ts);
console.log("✓ components/ui/logo-paths.ts", `(${WIDTH}x${HEIGHT})`);

function iconSvgInner(x = 0, y = 0, size = ICON, { inverted = false } = {}) {
  const s = size / ICON;
  const roofStroke = inverted ? NAVY : "#ffffff";
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="${iconPaths.tile}" fill="${GOLD}"/>
    <path d="${iconPaths.roof}" fill="none" stroke="${roofStroke}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${iconPaths.base}" fill="none" stroke="${roofStroke}" stroke-width="9" stroke-linecap="round"/>
  </g>`;
}

function logoSvg({ light = false, padding = 0, background = null } = {}) {
  const text = light ? "#ffffff" : NAVY;
  const sub = light ? "#e8cf8a" : "#8a6a1f";
  const w = WIDTH + padding * 2;
  const h = HEIGHT + padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${background ? `<rect width="${w}" height="${h}" fill="${background}"/>` : ""}
  <g transform="translate(${padding} ${padding})">
    ${iconSvgInner()}
    <path d="${nova.d}" fill="${text}"/>
    <path d="${onderhoud.d}" fill="${sub}"/>
  </g>
</svg>`;
}

function markSvg(size, { background = null, radius = 0 } = {}) {
  const inner = background ? Math.round(size * 0.72) : size;
  const off = Math.round((size - inner) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${background ? `<rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>` : ""}
  ${iconSvgInner(off, off, inner)}
</svg>`;
}

const brandDir = path.join(root, "public/brand");
await mkdir(brandDir, { recursive: true });

const SCALE = 4; // PNG's op 4x voor scherpte
await writeFile(path.join(brandDir, "nova-logo.png"), await sharp(Buffer.from(logoSvg({ padding: 8 }))).resize({ width: (WIDTH + 16) * SCALE }).png().toBuffer());
await writeFile(path.join(brandDir, "nova-logo-light.png"), await sharp(Buffer.from(logoSvg({ light: true, padding: 8 }))).resize({ width: (WIDTH + 16) * SCALE }).png().toBuffer());
await writeFile(path.join(brandDir, "nova-mark.png"), await sharp(Buffer.from(markSvg(512))).png().toBuffer());
await writeFile(path.join(brandDir, "nova-logo.svg"), logoSvg());
await writeFile(path.join(brandDir, "nova-logo-light.svg"), logoSvg({ light: true }));
console.log("✓ public/brand/nova-logo.png, nova-logo-light.png, nova-mark.png (+ svg)");

// App-iconen: het beeldmerk vult het icoon (de tegel heeft zelf al ronde hoeken).
await writeFile(path.join(root, "app/icon.png"), await sharp(Buffer.from(markSvg(512))).png().toBuffer());
// Apple-icoon: iOS rondt zelf af, dus een gevuld navy vlak met het merk in het midden.
await writeFile(path.join(root, "app/apple-icon.png"), await sharp(Buffer.from(markSvg(180, { background: NAVY }))).png().toBuffer());

// favicon.ico: ICO-container met PNG-ingangen van 16, 32 en 48 px.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(Buffer.from(markSvg(s))).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
const entries = [];
let offset = 6 + 16 * sizes.length;
pngs.forEach((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);
  e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  entries.push(e);
});
await writeFile(path.join(root, "app/favicon.ico"), Buffer.concat([header, ...entries, ...pngs]));
console.log("✓ app/icon.png, app/apple-icon.png, app/favicon.ico");
