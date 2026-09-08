/**
 * Verwerkt de aangeleverde originele foto's naar de paden die de site verwacht.
 *
 * - Collages (VOOR boven, NA onder — of andersom) worden gesplitst op de witte
 *   randen; de rode/groene VOOR/NA-labels worden weggesneden aan de bovenkant.
 * - Losse foto's worden bijgesneden/geschaald en gecomprimeerd.
 *
 * Gebruik:  node scripts/process-photos.mjs
 * Bron:     assets/originals/*.jpg|png   (niet publiek geserveerd)
 * Doel:     public/images/...
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets/originals");
const OUT = path.resolve("public/images");

/** Bronbestanden (originele uploadnamen) → betekenis */
const files = {
  bus: "533011831_122098312010981017_577908254788244146_n.jpg",
  gevelVoor: "533142150_122098311746981017_5760140018751728113_n.jpg",
  gevelWerk: "533353958_122098311734981017_1503539170817205370_n.jpg",
  logo: "534809700_122098289426981017_7453829717038726388_n.jpg",
  dakCollage2: "535392287_122102921336981017_7061727221527316672_n.jpg", // hoogwerker + heg → oranje dak
  gevelCollage1: "536713388_122102840072981017_7954978616455894377_n.jpg", // gele bakstenen bungalow
  gevelCollage2: "537134801_122102840018981017_6576229098436328129_n.jpg", // witte/grijze steen, grote ramen
  dakCollage4: "537321610_122102839994981017_1070608436681684775_n.jpg", // NA boven, voor onder (rij woningen)
  dakCollage1: "538105896_122102921384981017_3244892465660119034_n.jpg", // dakpannen close-up → dakkapel
  dakCollage3: "538254845_122102921348981017_1165772027743159795_n.jpg", // bedrijfspand
};

const JPEG = { quality: 82, mozjpeg: true };

/** Vind horizontale banden met niet-witte inhoud (de twee foto's in een collage). */
async function findBands(img) {
  const { data, info } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rowScore = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    let dark = 0;
    for (let x = 0; x < width; x++) if (data[y * width + x] < 235) dark++;
    rowScore[y] = dark / width;
  }
  const bands = [];
  let start = null;
  for (let y = 0; y <= height; y++) {
    const on = y < height && rowScore[y] > 0.08;
    if (on && start === null) start = y;
    if (!on && start !== null) {
      if (y - start > height * 0.2) bands.push({ top: start, bottom: y });
      start = null;
    }
  }
  return bands.sort((a, b) => b.bottom - b.top - (a.bottom - a.top)).slice(0, 2).sort((a, b) => a.top - b.top);
}

/** Kolomgrenzen van een band (witte zijranden wegsnijden). */
async function findColumns(img, band) {
  const { data, info } = await img
    .clone()
    .extract({ left: 0, top: band.top, width: (await img.metadata()).width, height: band.bottom - band.top })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const colScore = new Array(width).fill(0);
  for (let x = 0; x < width; x++) {
    let dark = 0;
    for (let y = 0; y < height; y++) if (data[y * width + x] < 235) dark++;
    colScore[x] = dark / height;
  }
  let left = 0;
  while (left < width && colScore[left] < 0.08) left++;
  let right = width - 1;
  while (right > left && colScore[right] < 0.08) right--;
  return { left, right: right + 1 };
}

/**
 * Bounding box van het rode/groene VOOR/NA-label in de bovenste 35% van de foto.
 * Geeft null als er geen label is.
 */
async function findLabelBox(img, region) {
  const { data, info } = await img.clone().extract(region).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const limit = Math.floor(height * 0.35);
  const rows = new Array(limit).fill(0);
  const cols = new Array(width).fill(0);
  for (let y = 0; y < limit; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const isRed = r > 170 && g < 90 && b < 90;
      const isGreen = g > 140 && r < 110 && b < 110;
      if (isRed || isGreen) {
        rows[y]++;
        cols[x]++;
      }
    }
  }
  const ys = rows.map((v, i) => (v > 3 ? i : -1)).filter((i) => i >= 0);
  const xs = cols.map((v, i) => (v > 3 ? i : -1)).filter((i) => i >= 0);
  if (!ys.length || !xs.length) return null;
  return { top: ys[0], bottom: ys[ys.length - 1], left: xs[0], right: xs[xs.length - 1] };
}

/**
 * Kies de snede die het minste beeld kost: bovenkant eraf, linkerkant eraf of
 * rechterkant eraf. Een label in het midden kan alleen via de bovenkant.
 */
function chooseCrop(region, box) {
  if (!box) return { ...region, cut: "none" };
  const m = Math.round(region.height * 0.03);
  const options = [];
  const topCut = Math.min(region.height - 1, box.bottom + m);
  options.push({ cut: "top", loss: topCut * region.width, rect: { left: region.left, top: region.top + topCut, width: region.width, height: region.height - topCut } });
  if (box.right < region.width * 0.5) {
    const c = Math.min(region.width - 1, box.right + m);
    options.push({ cut: "left", loss: c * region.height, rect: { left: region.left + c, top: region.top, width: region.width - c, height: region.height } });
  }
  if (box.left > region.width * 0.5) {
    const c = Math.min(region.width - 1, region.width - box.left + m);
    options.push({ cut: "right", loss: c * region.height, rect: { left: region.left, top: region.top, width: region.width - c, height: region.height } });
  }
  options.sort((a, b) => a.loss - b.loss);
  return { ...options[0].rect, cut: options[0].cut };
}

async function splitCollage(file, outTop, outBottom) {
  const img = sharp(path.join(SRC, file)).rotate();
  const bands = await findBands(img);
  if (bands.length !== 2) throw new Error(`${file}: verwachtte 2 foto's, vond ${bands.length}`);
  const results = [];
  for (const [i, band] of bands.entries()) {
    const cols = await findColumns(img, band);
    const region = { left: cols.left, top: band.top, width: cols.right - cols.left, height: band.bottom - band.top };
    const box = await findLabelBox(img, region);
    const { cut, ...final } = chooseCrop(region, box);
    const out = i === 0 ? outTop : outBottom;
    await mkdir(path.dirname(path.join(OUT, out)), { recursive: true });
    await img.clone().extract(final).resize({ width: 1600, withoutEnlargement: true }).jpeg(JPEG).toFile(path.join(OUT, out));
    results.push({ out, cut, w: final.width, h: final.height });
  }
  return results;
}

async function single(file, out, opts = {}) {
  await mkdir(path.dirname(path.join(OUT, out)), { recursive: true });
  let img = sharp(path.join(SRC, file)).rotate();
  if (opts.extract) img = img.extract(opts.extract);
  if (opts.resize) img = img.resize(opts.resize);
  if (out.endsWith(".png")) await img.png({ compressionLevel: 9 }).toFile(path.join(OUT, out));
  else await img.jpeg(JPEG).toFile(path.join(OUT, out));
  return out;
}

const log = (r) => console.log(JSON.stringify(r));

// --- Collages -------------------------------------------------------------
log(await splitCollage(files.dakCollage1, "projects/dakpanreiniging-1-voor.jpg", "projects/dakpanreiniging-1-na.jpg"));
log(await splitCollage(files.dakCollage2, "projects/dakpanreiniging-2-voor.jpg", "projects/dakpanreiniging-2-na.jpg"));
log(await splitCollage(files.dakCollage3, "projects/dakpanreiniging-3-voor.jpg", "projects/dakpanreiniging-3-na.jpg"));
// Collage 4 heeft NA boven en VOOR onder
log(await splitCollage(files.dakCollage4, "projects/dakpanreiniging-4-na.jpg", "projects/dakpanreiniging-4-voor.jpg"));
log(await splitCollage(files.gevelCollage1, "projects/gevelreiniging-1-voor.jpg", "projects/gevelreiniging-1-na.jpg"));
log(await splitCollage(files.gevelCollage2, "projects/gevelreiniging-2-voor.jpg", "projects/gevelreiniging-2-na.jpg"));

// --- Losse foto's ----------------------------------------------------------
log(await single(files.bus, "over-ons/bedrijfsbus.jpg", { resize: { width: 1400, withoutEnlargement: true } }));
log(await single(files.logo, "logo.png", { resize: { width: 512, height: 512, fit: "contain", background: "#ffffff" } }));
// Beeldmerk (alleen de cirkel met de vakman) voor navbar/footer — het volledige logo is daar te klein leesbaar
log(await single(files.logo, "logo-mark.png", { extract: { left: 78, top: 4, width: 378, height: 346 }, resize: { width: 512, height: 512, fit: "contain", background: "#ffffff" } }));
// Hero: werkfoto gevel, 16:9 uitsnede rond de vakman, opgeschaald naar 1920 breed
log(await single(files.gevelWerk, "hero/hero-poster.jpg", { extract: { left: 0, top: 200, width: 1024, height: 576 }, resize: { width: 1920 } }));
log(await single(files.gevelWerk, "services/gevelreiniging.jpg", { extract: { left: 0, top: 120, width: 1024, height: 704 }, resize: { width: 1600 } }));
// Dakpanreiniging dienstfoto: de "na"-foto van project 1 (woning met dakkapel)
await sharp(path.join(OUT, "projects/dakpanreiniging-1-na.jpg")).toFile(path.join(OUT, "services/dakpanreiniging.jpg"));
log("services/dakpanreiniging.jpg");
// Nog geen foto's voor trespa en zonnepanelen: placeholders blijven staan (scripts/generate-placeholders.mjs).
console.log("klaar");
