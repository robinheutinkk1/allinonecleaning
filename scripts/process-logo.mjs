/**
 * Maakt uit het aangeleverde logo (assets/originals/all in one.webp, witte achtergrond)
 * de varianten die de site gebruikt:
 *
 *   public/images/logo.png            volledig logo, witte achtergrond weggehaald (transparant)
 *   public/images/logo-inverted.png   idem, navy-delen wit gemaakt voor donkere achtergronden
 *   public/images/logo-mark.png       alleen het huisje (vierkant), voor favicon en kleine plekken
 *   app/icon.png, app/apple-icon.png, app/favicon.ico
 *
 * Gebruik: node scripts/process-logo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets/originals/all in one.webp");
const OUT = path.resolve("public/images");

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// 1. Witte achtergrond → transparant. Alpha op basis van het laagste kanaal (wit = 255,255,255),
//    daarna de kleur "ont-mengen" zodat randpixels niet wit uitslaan op donkere achtergronden.
const MIN_REF = 60; // laagste kanaalwaarde van de logokleuren (goud ≈ 58) telt als volledig dekkend
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  const min = Math.min(r, g, b);
  let a = Math.min(1, Math.max(0, (255 - min) / (255 - MIN_REF)));
  if (a < 0.03) a = 0;
  const un = (c) => (a === 0 ? 0 : Math.max(0, Math.min(255, Math.round((c - (1 - a) * 255) / a))));
  rgba[i * 4] = un(r);
  rgba[i * 4 + 1] = un(g);
  rgba[i * 4 + 2] = un(b);
  rgba[i * 4 + 3] = Math.round(a * 255);
}

// 2. Bounding box van het logo (alpha > 0) met marge.
let top = H, bottom = 0, left = W, right = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (rgba[(y * W + x) * 4 + 3] > 8) {
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
const m = Math.round((bottom - top) * 0.04);
const box = { left: Math.max(0, left - m), top: Math.max(0, top - m), width: Math.min(W, right + m) - Math.max(0, left - m), height: Math.min(H, bottom + m) - Math.max(0, top - m) };
console.log("logo bbox", box);

const full = sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(box);
await full.clone().png().toFile(path.join(OUT, "logo.png"));

// 3. Inverted: navy (blauw dominant) → wit, goud blijft goud.
const inv = Buffer.from(rgba);
for (let i = 0; i < W * H; i++) {
  const r = inv[i * 4], b = inv[i * 4 + 2], a = inv[i * 4 + 3];
  if (a === 0) continue;
  if (b >= r) {
    inv[i * 4] = 255;
    inv[i * 4 + 1] = 255;
    inv[i * 4 + 2] = 255;
  }
}
await sharp(inv, { raw: { width: W, height: H, channels: 4 } }).extract(box).png().toFile(path.join(OUT, "logo-inverted.png"));

// 4. Beeldmerk: het huisje (dak + schoorsteen + raam). Het dak is het enige navy-element
//    in de bovenste helft van het logo; de tekst "ALL IN ONE" is ook navy maar staat lager.
//    Bbox van navy pixels in de bovenste 55% van het logo, plus marge; daarna in een
//    vierkant gezet met transparante rand.
const isNavy = (i) => rgba[i * 4 + 3] > 40 && rgba[i * 4 + 2] >= rgba[i * 4];
const limitY = top + Math.round((bottom - top) * 0.55);
let hTop = H, hBottom = 0, hLeft = W, hRight = 0;
for (let y = top; y < limitY; y++)
  for (let x = left; x <= right; x++)
    if (isNavy(y * W + x)) {
      if (y < hTop) hTop = y;
      if (y > hBottom) hBottom = y;
      if (x < hLeft) hLeft = x;
      if (x > hRight) hRight = x;
    }
const hm = Math.round((hRight - hLeft) * 0.04);
const mark = { left: Math.max(0, hLeft - hm), top: Math.max(0, hTop - hm), width: Math.min(W, hRight + hm) - Math.max(0, hLeft - hm), height: Math.min(H, hBottom + hm) - Math.max(0, hTop - hm) };
console.log("mark bbox", mark);
const markPng = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(mark).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
fs.writeFileSync(path.join(OUT, "logo-mark.png"), markPng);

// 5. Icons: transparant huisje; favicon.ico met PNG-entries.
fs.writeFileSync(path.resolve("app/icon.png"), markPng);
// Apple-icoon: iOS maskt zelf en houdt niet van transparantie → wit vlak met marge
await sharp(markPng).resize(150, 150).extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#ffffff" }).flatten({ background: "#ffffff" }).png().toFile(path.resolve("app/apple-icon.png"));
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await sharp(markPng).resize(s, s).png().toBuffer());
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
const dir = Buffer.alloc(16 * sizes.length);
let offset = 6 + 16 * sizes.length;
sizes.forEach((s, i) => {
  const e = i * 16;
  dir.writeUInt8(s, e);
  dir.writeUInt8(s, e + 1);
  dir.writeUInt16LE(1, e + 4);
  dir.writeUInt16LE(32, e + 6);
  dir.writeUInt32LE(pngs[i].length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
fs.writeFileSync(path.resolve("app/favicon.ico"), Buffer.concat([header, dir, ...pngs]));

console.log("klaar: logo.png, logo-inverted.png, logo-mark.png, app/icon.png, app/apple-icon.png, app/favicon.ico");
