/**
 * Genereert de neutrale demo-illustraties van NOVA Onderhoud (fictief bedrijf).
 *
 * Alle beelden zijn procedureel getekend (SVG → JPG via sharp): geen foto's van
 * echte panden, personen of bedrijven. Ze staan op precies de paden die de site
 * verwacht, zodat ze later één-op-één door eigen foto's vervangen kunnen worden.
 *
 *   node scripts/generate-demo-images.mjs             # dienstbeelden en over-ons opnieuw
 *   node scripts/generate-demo-images.mjs --projects  # ook illustraties voor de voor/na-paren
 *
 * Uitvoer (public/images):
 * - services/<slug>.jpg                 8 dienstbeelden (1600x1100)
 * - over-ons/team-aan-het-werk.jpg      beeld voor intro en over-ons (1400x1050)
 * - projects/<naam>-voor.jpg / -na.jpg  alleen met --projects; standaard staan hier
 *                                       AI-gegenereerde voorbeeldfoto's (1200x800)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.cwd(), "public/images");

/* Palet: rustig, natuurlijk, met het merkgoud als accent. */
const C = {
  skyTop: "#dfe9f3",
  skyBottom: "#f6f8fb",
  sun: "#f2d488",
  grass: "#8fb58a",
  grassDark: "#7aa276",
  brick: "#c98a67",
  brickDark: "#b3males",
  wall: "#e9e2d6",
  wallShade: "#d9d0c2",
  roof: "#8b5a44",
  roofLight: "#a56d54",
  roofDark: "#6f4736",
  wood: "#b98b5a",
  woodDark: "#8a6238",
  glass: "#bcd6e8",
  glassLight: "#dcebf5",
  frame: "#f6f3ee",
  navy: "#111c30",
  gold: "#d9a23a",
  stone: "#cfc9bf",
  stoneDark: "#b9b2a6",
  panel: "#1f2c4a",
  panelLine: "#33507a",
  grime: "#5a6b4c",
  moss: "#6e8a4a",
};
C.brickDark = "#b0775a";

/* Kleine hulpfuncties voor herhaalbare vormen. */
const rnd = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

function defs(w, h, extra = "") {
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyTop}"/><stop offset="1" stop-color="${C.skyBottom}"/></linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.grass}"/><stop offset="1" stop-color="${C.grassDark}"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.glassLight}"/><stop offset="1" stop-color="${C.glass}"/></linearGradient>
    <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.roofLight}"/><stop offset="1" stop-color="${C.roof}"/></linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3d63"/><stop offset="1" stop-color="${C.panel}"/></linearGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.sun}" stop-opacity="0.9"/><stop offset="1" stop-color="${C.sun}" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.round(w / 90)}"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.06"/></feComponentTransfer></filter>
    ${extra}
  </defs>`;
}

function sky(w, h, { horizon = 0.72, sunX = 0.8, sunY = 0.2 } = {}) {
  return `<rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${w * sunX}" cy="${h * sunY}" r="${w * 0.16}" fill="url(#sunGlow)"/>
  <g fill="#ffffff" opacity="0.7">
    <ellipse cx="${w * 0.22}" cy="${h * 0.18}" rx="${w * 0.09}" ry="${h * 0.035}"/>
    <ellipse cx="${w * 0.28}" cy="${h * 0.16}" rx="${w * 0.07}" ry="${h * 0.04}"/>
    <ellipse cx="${w * 0.62}" cy="${h * 0.12}" rx="${w * 0.06}" ry="${h * 0.028}"/>
  </g>
  <rect x="0" y="${h * horizon}" width="${w}" height="${h * (1 - horizon)}" fill="url(#grass)"/>`;
}

function grain(w, h) {
  return `<rect width="${w}" height="${h}" filter="url(#grain)"/>`;
}

function shadow(x, y, w, h, s = 1) {
  return `<ellipse cx="${x + w / 2}" cy="${y + h}" rx="${(w / 2) * 1.05 * s}" ry="${h * 0.06}" fill="${C.navy}" opacity="0.12" filter="url(#soft)"/>`;
}

function window(x, y, w, h, { light = true } = {}) {
  return `<g>
    <rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="4" fill="${C.frame}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#glass)"/>
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${C.frame}" stroke-width="6"/>
    <line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${C.frame}" stroke-width="6"/>
    ${light ? `<path d="M${x + 8} ${y + h - 8}L${x + w * 0.45} ${y + 8}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10" stroke-linecap="round"/>` : ""}
  </g>`;
}

function door(x, y, w, h) {
  return `<g>
    <rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 6}" rx="6" fill="${C.frame}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${C.navy}"/>
    <rect x="${x + w * 0.2}" y="${y + h * 0.12}" width="${w * 0.6}" height="${h * 0.32}" rx="3" fill="url(#glass)"/>
    <circle cx="${x + w * 0.8}" cy="${y + h * 0.58}" r="5" fill="${C.gold}"/>
  </g>`;
}

function bricks(x, y, w, h, seed = 1, color = C.brick, dark = C.brickDark) {
  const r = rnd(seed);
  const bh = 26;
  const bw = 62;
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/><g>`;
  for (let row = 0; row * bh < h; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let col = -1; col * bw < w + bw; col++) {
      const bx = x + col * bw + off;
      const by = y + row * bh;
      if (bx + bw < x || bx > x + w) continue;
      const cx = Math.max(x, bx);
      const cw = Math.min(x + w, bx + bw) - cx;
      if (cw <= 0) continue;
      const o = 0.25 + r() * 0.45;
      out += `<rect x="${cx + 2}" y="${by + 2}" width="${cw - 4}" height="${bh - 4}" fill="${dark}" opacity="${o.toFixed(2)}"/>`;
    }
  }
  return out + "</g>";
}

function tiles(x, y, w, h, seed = 2) {
  const r = rnd(seed);
  const th = 30;
  const tw = 46;
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#roof)"/><g>`;
  for (let row = 0; row * th < h; row++) {
    const off = row % 2 ? tw / 2 : 0;
    for (let col = -1; col * tw < w + tw; col++) {
      const tx = x + col * tw + off;
      const ty = y + row * th;
      const cx = Math.max(x, tx);
      const cw = Math.min(x + w, tx + tw) - cx;
      if (cw <= 0) continue;
      out += `<path d="M${cx} ${ty + th}Q${cx + cw / 2} ${ty + th + 10} ${cx + cw} ${ty + th}" stroke="${C.roofDark}" stroke-opacity="${(0.25 + r() * 0.3).toFixed(2)}" stroke-width="4" fill="none"/>`;
    }
  }
  return out + "</g>";
}

/** Groene aanslag, mos en vuil: voor de 'voor'-beelden. */
function grime(x, y, w, h, seed = 7, { density = 26, color = C.grime, moss = C.moss } = {}) {
  const r = rnd(seed);
  let out = `<g>`;
  for (let i = 0; i < density; i++) {
    const cx = x + r() * w;
    const cy = y + h * (0.35 + r() * 0.7);
    const rx = w * (0.04 + r() * 0.12);
    const ry = h * (0.03 + r() * 0.09);
    out += `<ellipse cx="${cx.toFixed(0)}" cy="${Math.min(y + h, cy).toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="${r() > 0.5 ? color : moss}" opacity="${(0.18 + r() * 0.3).toFixed(2)}" filter="url(#soft)"/>`;
  }
  // Streepvorming onder ramen en langs randen
  for (let i = 0; i < 6; i++) {
    const sx = x + r() * w;
    out += `<rect x="${sx.toFixed(0)}" y="${y}" width="${(6 + r() * 14).toFixed(0)}" height="${h}" fill="${color}" opacity="${(0.06 + r() * 0.1).toFixed(2)}"/>`;
  }
  return out + `</g>`;
}

function tree(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-10" y="0" width="20" height="90" rx="8" fill="${C.woodDark}"/>
    <circle cx="0" cy="-40" r="70" fill="${C.grassDark}"/>
    <circle cx="-40" cy="-10" r="52" fill="${C.grass}"/>
    <circle cx="42" cy="-14" r="56" fill="${C.grass}"/>
    <circle cx="6" cy="-70" r="46" fill="#9cc297"/>
  </g>`;
}

function plant(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-28 0h56l-8 44h-40z" fill="${C.brick}"/>
    <path d="M0 0c-30-30-40-60-10-80c20 30 20 55 10 80z" fill="${C.grassDark}"/>
    <path d="M0 0c30-28 46-56 14-78c-22 28-24 54-14 78z" fill="${C.grass}"/>
    <path d="M0 0c-4-40 4-60 0-90" stroke="${C.grassDark}" stroke-width="6" fill="none"/>
  </g>`;
}

/** Eenvoudige, neutrale figuur van een onderhoudsmedewerker (geen gezicht herkenbaar). */
function worker(x, y, s = 1, { tool = "roller", facing = 1 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s * facing} ${s})">
    <ellipse cx="0" cy="0" rx="46" ry="8" fill="${C.navy}" opacity="0.15"/>
    <rect x="-22" y="-110" width="18" height="110" rx="8" fill="${C.navy}"/>
    <rect x="4" y="-110" width="18" height="110" rx="8" fill="${C.navy}"/>
    <rect x="-30" y="-200" width="60" height="100" rx="18" fill="${C.gold}"/>
    <rect x="-30" y="-150" width="60" height="16" fill="#ffffff" opacity="0.7"/>
    <rect x="-30" y="-122" width="60" height="16" fill="#ffffff" opacity="0.7"/>
    <circle cx="0" cy="-232" r="26" fill="#e8c9a8"/>
    <path d="M-30 -236a30 30 0 0 1 60 0v6h-60z" fill="#ffffff"/>
    <rect x="-34" y="-236" width="68" height="10" rx="5" fill="#ffffff"/>
    ${
      tool === "roller"
        ? `<rect x="26" y="-190" width="14" height="90" rx="7" fill="#e8c9a8"/><rect x="24" y="-260" width="18" height="76" rx="6" fill="${C.woodDark}"/><rect x="8" y="-282" width="50" height="26" rx="10" fill="#f6f3ee"/>`
        : tool === "lance"
          ? `<rect x="26" y="-186" width="14" height="80" rx="7" fill="#e8c9a8"/><rect x="30" y="-300" width="10" height="130" rx="5" fill="#8a94a6"/><path d="M35 -300l-40 -60" stroke="#bcd6e8" stroke-width="10" stroke-linecap="round" opacity="0.8"/><path d="M35 -300l-52 -44" stroke="#bcd6e8" stroke-width="7" stroke-linecap="round" opacity="0.5"/>`
          : `<rect x="26" y="-186" width="14" height="80" rx="7" fill="#e8c9a8"/><rect x="18" y="-214" width="60" height="16" rx="6" fill="${C.woodDark}"/>`
    }
  </g>`;
}

/* ------------------------------------------------------------------ */
/* Scènes                                                             */
/* ------------------------------------------------------------------ */

function sceneGevel(w, h, { dirty = false } = {}) {
  const gx = w * 0.22;
  const gy = h * 0.26;
  const gw = w * 0.56;
  const gh = h * 0.5;
  const roofY = gy - h * 0.12;
  return `${defs(w, h)}${sky(w, h, { horizon: 0.76 })}
  ${tree(w * 0.08, h * 0.72, 1.3)}${tree(w * 0.92, h * 0.74, 1.1)}
  ${shadow(gx, gy, gw, gh)}
  ${bricks(gx, gy, gw, gh, 3)}
  ${dirty ? grime(gx, gy, gw, gh, 11, { density: 34 }) : ""}
  <path d="M${gx - 30} ${gy}L${gx + gw / 2} ${roofY}L${gx + gw + 30} ${gy}Z" fill="${C.roofDark}"/>
  <path d="M${gx - 10} ${gy - 8}L${gx + gw / 2} ${roofY + 18}L${gx + gw + 10} ${gy - 8}Z" fill="url(#roof)"/>
  ${window(gx + gw * 0.12, gy + gh * 0.16, gw * 0.2, gh * 0.28)}
  ${window(gx + gw * 0.68, gy + gh * 0.16, gw * 0.2, gh * 0.28)}
  ${window(gx + gw * 0.12, gy + gh * 0.58, gw * 0.2, gh * 0.3)}
  ${door(gx + gw * 0.44, gy + gh * 0.5, gw * 0.13, gh * 0.5)}
  ${window(gx + gw * 0.68, gy + gh * 0.58, gw * 0.2, gh * 0.3)}
  ${dirty ? grime(gx, gy + gh * 0.55, gw, gh * 0.45, 5, { density: 18 }) : ""}
  <rect x="${gx - 30}" y="${gy + gh}" width="${gw + 60}" height="${h * 0.02}" fill="${C.stone}"/>
  ${plant(gx + gw * 0.36, gy + gh, 0.9)}${plant(gx + gw * 0.64, gy + gh, 0.9)}
  ${!dirty ? worker(gx - w * 0.06, gy + gh, w / 1600 * 1.05, { tool: "lance" }) : ""}
  ${grain(w, h)}`;
}

function sceneDak(w, h, { dirty = false } = {}) {
  const rx = w * 0.1;
  const ry = h * 0.3;
  const rw = w * 0.8;
  const rh = h * 0.34;
  return `${defs(w, h)}${sky(w, h, { horizon: 0.86, sunX: 0.15, sunY: 0.18 })}
  <path d="M${rx - 40} ${ry + rh}L${rx + rw * 0.5} ${ry - h * 0.1}L${rx + rw + 40} ${ry + rh}Z" fill="${C.roofDark}"/>
  <g clip-path="url(#roofClip)">
    <clipPath id="roofClip"><path d="M${rx} ${ry + rh}L${rx + rw * 0.5} ${ry - h * 0.08}L${rx + rw} ${ry + rh}Z"/></clipPath>
    ${tiles(rx, ry - h * 0.08, rw, rh + h * 0.08, 9)}
    ${dirty ? grime(rx, ry - h * 0.08, rw, rh + h * 0.08, 21, { density: 44, color: "#4f5e40", moss: "#7c9a4e" }) : ""}
    ${dirty ? grime(rx + rw * 0.05, ry + rh * 0.2, rw * 0.5, rh * 0.8, 23, { density: 26, color: "#6b7a5e", moss: "#87a35a" }) : ""}
  </g>
  <rect x="${rx + rw * 0.66}" y="${ry + rh * 0.02}" width="${rw * 0.07}" height="${rh * 0.34}" fill="${C.brick}"/>
  <rect x="${rx + rw * 0.65}" y="${ry - 6}" width="${rw * 0.09}" height="14" rx="3" fill="${C.stone}"/>
  <g>
    <rect x="${rx + rw * 0.2}" y="${ry + rh * 0.38}" width="${rw * 0.18}" height="${rh * 0.4}" rx="6" fill="${C.frame}"/>
    <rect x="${rx + rw * 0.215}" y="${ry + rh * 0.42}" width="${rw * 0.15}" height="${rh * 0.32}" rx="3" fill="url(#glass)"/>
  </g>
  ${bricks(rx, ry + rh, rw, h - (ry + rh) - h * 0.14, 4)}
  ${window(rx + rw * 0.12, ry + rh + h * 0.06, rw * 0.14, h * 0.12)}
  ${window(rx + rw * 0.74, ry + rh + h * 0.06, rw * 0.14, h * 0.12)}
  <rect x="${rx - 30}" y="${ry + rh - 8}" width="${rw + 60}" height="18" rx="4" fill="${C.frame}"/>
  ${!dirty ? worker(rx + rw * 0.5, ry + rh * 0.9, w / 1600 * 0.8, { tool: "lance", facing: -1 }) : ""}
  ${grain(w, h)}`;
}

function sceneZonnepanelen(w, h, { dirty = false } = {}) {
  const rx = w * 0.06;
  const ry = h * 0.22;
  const rw = w * 0.88;
  const rh = h * 0.56;
  let panels = "";
  const cols = 5;
  const rows = 3;
  const pw = rw / cols;
  const ph = rh / rows;
  const r = rnd(31);
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const x = rx + i * pw + 6;
      const y = ry + j * ph + 6;
      panels += `<rect x="${x}" y="${y}" width="${pw - 12}" height="${ph - 12}" rx="6" fill="url(#panel)" stroke="#c7d1e0" stroke-width="4"/>`;
      for (let k = 1; k < 4; k++) panels += `<line x1="${x + (k * (pw - 12)) / 4}" y1="${y}" x2="${x + (k * (pw - 12)) / 4}" y2="${y + ph - 12}" stroke="${C.panelLine}" stroke-width="2"/>`;
      for (let k = 1; k < 3; k++) panels += `<line x1="${x}" y1="${y + (k * (ph - 12)) / 3}" x2="${x + pw - 12}" y2="${y + (k * (ph - 12)) / 3}" stroke="${C.panelLine}" stroke-width="2"/>`;
      if (!dirty) panels += `<path d="M${x + 10} ${y + ph - 30}L${x + pw * 0.5} ${y + 10}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="14" stroke-linecap="round"/>`;
      if (dirty) {
        for (let n = 0; n < 5; n++) {
          panels += `<ellipse cx="${x + r() * (pw - 12)}" cy="${y + r() * (ph - 12)}" rx="${18 + r() * 40}" ry="${10 + r() * 22}" fill="#b8b09a" opacity="${(0.25 + r() * 0.35).toFixed(2)}" filter="url(#soft)"/>`;
        }
      }
    }
  return `${defs(w, h)}${sky(w, h, { horizon: 0.98, sunX: 0.88, sunY: 0.14 })}
  ${tiles(0, h * 0.14, w, h * 0.86, 12)}
  ${dirty ? `<rect x="0" y="${h * 0.14}" width="${w}" height="${h * 0.86}" fill="#7a7466" opacity="0.18"/>` : ""}
  ${panels}
  ${!dirty ? worker(w * 0.9, h * 0.98, w / 1600 * 0.9, { tool: "brush", facing: -1 }) : ""}
  ${grain(w, h)}`;
}

function sceneTerras(w, h, { dirty = false } = {}) {
  const r = rnd(41);
  let tilesOut = "";
  const tw = w / 8;
  const th = h * 0.11;
  for (let j = 0; j < 6; j++)
    for (let i = -1; i < 9; i++) {
      const x = i * tw + (j % 2 ? tw / 2 : 0);
      const y = h * 0.42 + j * th;
      const shade = 0.85 + r() * 0.15;
      tilesOut += `<rect x="${x + 4}" y="${y + 4}" width="${tw - 8}" height="${th - 8}" rx="6" fill="${C.stone}" opacity="${shade.toFixed(2)}"/>`;
      if (dirty) tilesOut += `<rect x="${x + 4}" y="${y + 4}" width="${tw - 8}" height="${th - 8}" rx="6" fill="${C.moss}" opacity="${(0.1 + r() * 0.35).toFixed(2)}"/>`;
    }
  return `${defs(w, h)}${sky(w, h, { horizon: 0.42 })}
  <rect x="0" y="${h * 0.42}" width="${w}" height="${h * 0.58}" fill="${C.stoneDark}"/>
  ${tilesOut}
  ${dirty ? grime(0, h * 0.42, w, h * 0.58, 43, { density: 40, color: "#55634a", moss: "#6f8d48" }) : ""}
  ${tree(w * 0.1, h * 0.42, 1.6)}${tree(w * 0.86, h * 0.43, 1.4)}
  <rect x="${w * 0.3}" y="${h * 0.2}" width="${w * 0.4}" height="${h * 0.22}" fill="${C.wall}"/>
  ${bricks(w * 0.3, h * 0.2, w * 0.4, h * 0.22, 8, C.wall, C.wallShade)}
  ${window(w * 0.36, h * 0.24, w * 0.1, h * 0.13)}${window(w * 0.54, h * 0.24, w * 0.1, h * 0.13)}
  <g transform="translate(${w * 0.5} ${h * 0.72})">
    <ellipse cx="0" cy="40" rx="150" ry="16" fill="${C.navy}" opacity="0.12" filter="url(#soft)"/>
    <ellipse cx="0" cy="0" rx="150" ry="40" fill="${C.woodDark}"/>
    <ellipse cx="0" cy="-8" rx="150" ry="40" fill="${C.wood}"/>
    <rect x="-8" y="0" width="16" height="70" fill="${C.woodDark}"/>
  </g>
  ${plant(w * 0.24, h * 0.86, 1.2)}${plant(w * 0.76, h * 0.88, 1.1)}
  ${!dirty ? worker(w * 0.14, h * 0.95, w / 1600 * 1.0, { tool: "lance" }) : ""}
  ${grain(w, h)}`;
}

function sceneSchilderwerk(w, h, { dirty = false } = {}) {
  const fx = w * 0.18;
  const fy = h * 0.14;
  const fw = w * 0.64;
  const fh = h * 0.66;
  const r = rnd(51);
  let flakes = "";
  if (dirty)
    for (let i = 0; i < 60; i++) {
      flakes += `<path d="M${(fx + r() * fw).toFixed(0)} ${(fy + r() * fh).toFixed(0)}l${(6 + r() * 16).toFixed(0)} ${(3 + r() * 10).toFixed(0)}l-${(4 + r() * 14).toFixed(0)} ${(4 + r() * 10).toFixed(0)}z" fill="#9c8f7c" opacity="${(0.4 + r() * 0.4).toFixed(2)}"/>`;
    }
  const frameColor = dirty ? "#d8d2c4" : "#f7f5f0";
  const sash = dirty ? "#6f6a60" : C.navy;
  return `${defs(w, h)}
  <rect width="${w}" height="${h}" fill="${C.wall}"/>
  ${bricks(0, 0, w, h, 14, C.brick, C.brickDark)}
  ${dirty ? grime(0, 0, w, h, 52, { density: 20 }) : ""}
  <rect x="${fx - 24}" y="${fy - 24}" width="${fw + 48}" height="${fh + 48}" rx="10" fill="${frameColor}"/>
  <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="url(#glass)"/>
  <rect x="${fx + fw / 2 - 14}" y="${fy}" width="28" height="${fh}" fill="${frameColor}"/>
  <rect x="${fx}" y="${fy + fh * 0.42}" width="${fw}" height="24" fill="${frameColor}"/>
  <rect x="${fx - 40}" y="${fy + fh + 24}" width="${fw + 80}" height="30" rx="6" fill="${sash}"/>
  ${flakes}
  ${dirty ? `<rect x="${fx - 24}" y="${fy + fh - 40}" width="${fw + 48}" height="64" fill="#7d7160" opacity="0.35"/>` : ""}
  ${
    !dirty
      ? `<g transform="translate(${w * 0.86} ${h * 0.9})">
      <rect x="-70" y="-40" width="140" height="40" rx="8" fill="${C.navy}"/>
      <rect x="-60" y="-52" width="120" height="16" rx="6" fill="${C.gold}"/>
      <rect x="-30" y="-120" width="60" height="70" rx="6" fill="#f7f5f0"/><rect x="-30" y="-120" width="60" height="18" fill="${C.gold}"/>
    </g>${worker(w * 0.12, h * 0.98, w / 1600 * 1.1, { tool: "roller" })}`
      : ""
  }
  ${grain(w, h)}`;
}

function sceneHoutrot(w, h, { dirty = false } = {}) {
  const r = rnd(61);
  const woodColor = dirty ? "#a08663" : C.wood;
  const holes = dirty
    ? Array.from({ length: 14 }, () => `<ellipse cx="${(w * 0.25 + r() * w * 0.5).toFixed(0)}" cy="${(h * 0.74 + r() * h * 0.12).toFixed(0)}" rx="${(10 + r() * 40).toFixed(0)}" ry="${(6 + r() * 16).toFixed(0)}" fill="#4a3a2a" opacity="${(0.4 + r() * 0.5).toFixed(2)}"/>`).join("")
    : "";
  return `${defs(w, h)}
  <rect width="${w}" height="${h}" fill="${C.wall}"/>
  ${bricks(0, 0, w, h, 16, C.wall, C.wallShade)}
  <rect x="${w * 0.2}" y="${h * 0.1}" width="${w * 0.6}" height="${h * 0.8}" rx="12" fill="${woodColor}"/>
  <rect x="${w * 0.24}" y="${h * 0.14}" width="${w * 0.52}" height="${h * 0.56}" fill="url(#glass)"/>
  <rect x="${w * 0.49}" y="${h * 0.14}" width="${w * 0.02}" height="${h * 0.56}" fill="${woodColor}"/>
  <rect x="${w * 0.2}" y="${h * 0.7}" width="${w * 0.6}" height="${h * 0.2}" rx="6" fill="${woodColor}"/>
  <g stroke="${C.woodDark}" stroke-opacity="0.35" stroke-width="3" fill="none">
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${w * 0.21} ${h * (0.72 + i * 0.018)}Q${w * 0.5} ${h * (0.7 + i * 0.02)} ${w * 0.79} ${h * (0.72 + i * 0.018)}"/>`).join("")}
  </g>
  ${holes}
  ${dirty ? `<rect x="${w * 0.2}" y="${h * 0.78}" width="${w * 0.6}" height="${h * 0.12}" fill="#3f3226" opacity="0.25"/>` : ""}
  ${
    !dirty
      ? `<g transform="translate(${w * 0.5} ${h * 0.8})">
        <rect x="-120" y="-10" width="240" height="20" rx="10" fill="${C.gold}" opacity="0.9"/>
        <path d="M-100 -2l14 -34l14 34" stroke="${C.navy}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M60 -2l14 -34l14 34" stroke="${C.navy}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>${worker(w * 0.88, h * 0.98, w / 1600 * 1.05, { tool: "brush", facing: -1 })}`
      : ""
  }
  ${grain(w, h)}`;
}

function sceneOnderhoud(w, h) {
  const gx = w * 0.12;
  const gy = h * 0.3;
  const gw = w * 0.5;
  const gh = h * 0.48;
  return `${defs(w, h)}${sky(w, h, { horizon: 0.78 })}
  ${tree(w * 0.05, h * 0.75, 1.2)}
  ${shadow(gx, gy, gw, gh)}
  ${bricks(gx, gy, gw, gh, 17)}
  <path d="M${gx - 24} ${gy}L${gx + gw / 2} ${gy - h * 0.12}L${gx + gw + 24} ${gy}Z" fill="url(#roof)"/>
  ${window(gx + gw * 0.12, gy + gh * 0.14, gw * 0.22, gh * 0.28)}
  ${window(gx + gw * 0.66, gy + gh * 0.14, gw * 0.22, gh * 0.28)}
  ${door(gx + gw * 0.42, gy + gh * 0.5, gw * 0.16, gh * 0.5)}
  ${window(gx + gw * 0.12, gy + gh * 0.56, gw * 0.22, gh * 0.3)}
  ${window(gx + gw * 0.66, gy + gh * 0.56, gw * 0.22, gh * 0.3)}
  <g transform="translate(${w * 0.7} ${h * 0.24})">
    <rect x="0" y="0" width="${w * 0.24}" height="${h * 0.5}" rx="24" fill="#ffffff" opacity="0.96"/>
    <rect x="0" y="0" width="${w * 0.24}" height="${h * 0.1}" rx="24" fill="${C.navy}"/>
    <rect x="0" y="${h * 0.05}" width="${w * 0.24}" height="${h * 0.05}" fill="${C.navy}"/>
    ${Array.from({ length: 4 }, (_, i) => {
      const y = h * 0.15 + i * h * 0.085;
      const done = i < 3;
      return `<rect x="${w * 0.02}" y="${y}" width="${h * 0.045}" height="${h * 0.045}" rx="8" fill="${done ? C.gold : "#e1e8f0"}"/>
        ${done ? `<path d="M${w * 0.02 + h * 0.011} ${y + h * 0.023}l${h * 0.009} ${h * 0.009}l${h * 0.017} -${h * 0.018}" stroke="${C.navy}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
        <rect x="${w * 0.02 + h * 0.065}" y="${y + h * 0.01}" width="${w * 0.13 - i * 10}" height="${h * 0.024}" rx="6" fill="${done ? "#c3d0e0" : "#e1e8f0"}"/>`;
    }).join("")}
    <circle cx="${w * 0.03}" cy="${h * 0.05}" r="10" fill="${C.gold}"/>
    <rect x="${w * 0.05}" y="${h * 0.04}" width="${w * 0.13}" height="${h * 0.02}" rx="6" fill="#ffffff" opacity="0.8"/>
  </g>
  ${worker(w * 0.66, h * 0.9, w / 1600 * 1.0, { tool: "brush" })}
  ${grain(w, h)}`;
}

function sceneRenovatie(w, h) {
  const gx = w * 0.16;
  const gy = h * 0.28;
  const gw = w * 0.68;
  const gh = h * 0.5;
  return `${defs(w, h)}${sky(w, h, { horizon: 0.8 })}
  ${shadow(gx, gy, gw, gh)}
  ${bricks(gx, gy, gw * 0.5, gh, 19)}
  <rect x="${gx + gw * 0.5}" y="${gy}" width="${gw * 0.5}" height="${gh}" fill="${C.wall}"/>
  <g stroke="${C.wallShade}" stroke-width="3">${Array.from({ length: 8 }, (_, i) => `<line x1="${gx + gw * 0.5}" y1="${gy + (i * gh) / 8}" x2="${gx + gw}" y2="${gy + (i * gh) / 8}"/>`).join("")}</g>
  <path d="M${gx - 24} ${gy}L${gx + gw / 2} ${gy - h * 0.14}L${gx + gw + 24} ${gy}Z" fill="url(#roof)"/>
  ${window(gx + gw * 0.08, gy + gh * 0.14, gw * 0.16, gh * 0.3)}
  ${window(gx + gw * 0.3, gy + gh * 0.14, gw * 0.16, gh * 0.3)}
  ${window(gx + gw * 0.6, gy + gh * 0.14, gw * 0.3, gh * 0.3)}
  ${door(gx + gw * 0.14, gy + gh * 0.52, gw * 0.12, gh * 0.48)}
  ${window(gx + gw * 0.6, gy + gh * 0.56, gw * 0.3, gh * 0.3)}
  <g stroke="#8a94a6" stroke-width="10" stroke-linecap="round">
    <line x1="${gx + gw * 0.52}" y1="${gy - h * 0.06}" x2="${gx + gw * 0.52}" y2="${gy + gh}"/>
    <line x1="${gx + gw * 0.98}" y1="${gy - h * 0.06}" x2="${gx + gw * 0.98}" y2="${gy + gh}"/>
    <line x1="${gx + gw * 0.52}" y1="${gy + gh * 0.33}" x2="${gx + gw * 0.98}" y2="${gy + gh * 0.33}"/>
    <line x1="${gx + gw * 0.52}" y1="${gy + gh * 0.66}" x2="${gx + gw * 0.98}" y2="${gy + gh * 0.66}"/>
    <line x1="${gx + gw * 0.52}" y1="${gy - h * 0.06}" x2="${gx + gw * 0.98}" y2="${gy - h * 0.06}"/>
  </g>
  <rect x="${gx + gw * 0.5}" y="${gy + gh * 0.31}" width="${gw * 0.5}" height="12" fill="${C.wood}"/>
  <rect x="${gx + gw * 0.5}" y="${gy + gh * 0.64}" width="${gw * 0.5}" height="12" fill="${C.wood}"/>
  ${worker(gx + gw * 0.76, gy + gh * 0.31, w / 1600 * 0.85, { tool: "roller" })}
  ${worker(gx - w * 0.04, gy + gh, w / 1600 * 1.05, { tool: "brush" })}
  ${grain(w, h)}`;
}

function sceneTeam(w, h) {
  const gx = w * 0.3;
  const gy = h * 0.24;
  const gw = w * 0.6;
  const gh = h * 0.52;
  return `${defs(w, h)}${sky(w, h, { horizon: 0.76, sunX: 0.2 })}
  ${tree(w * 0.12, h * 0.72, 1.5)}
  ${shadow(gx, gy, gw, gh)}
  ${bricks(gx, gy, gw, gh, 27, C.wall, C.wallShade)}
  <path d="M${gx - 24} ${gy}L${gx + gw / 2} ${gy - h * 0.13}L${gx + gw + 24} ${gy}Z" fill="url(#roof)"/>
  ${window(gx + gw * 0.1, gy + gh * 0.14, gw * 0.2, gh * 0.3)}
  ${window(gx + gw * 0.7, gy + gh * 0.14, gw * 0.2, gh * 0.3)}
  ${door(gx + gw * 0.43, gy + gh * 0.5, gw * 0.14, gh * 0.5)}
  ${window(gx + gw * 0.1, gy + gh * 0.56, gw * 0.2, gh * 0.3)}
  ${window(gx + gw * 0.7, gy + gh * 0.56, gw * 0.2, gh * 0.3)}
  <g transform="translate(${w * 0.16} ${h * 0.76})">
    <rect x="-150" y="-40" width="300" height="60" rx="10" fill="#ffffff" opacity="0.95"/>
    <rect x="-150" y="-40" width="300" height="12" rx="6" fill="${C.gold}"/>
    <rect x="-120" y="-20" width="90" height="10" rx="5" fill="#c3d0e0"/><rect x="-120" y="0" width="150" height="10" rx="5" fill="#e1e8f0"/>
  </g>
  ${worker(w * 0.46, h * 0.98, w / 1600 * 1.15, { tool: "roller" })}
  ${worker(w * 0.8, h * 0.98, w / 1600 * 1.1, { tool: "brush", facing: -1 })}
  ${grain(w, h)}`;
}

/* ------------------------------------------------------------------ */

function wrap(w, h, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
}

const jobs = [
  // Diensten (1600x1100)
  { file: "services/gevelreiniging.jpg", w: 1600, h: 1100, scene: sceneGevel },
  { file: "services/dakreiniging.jpg", w: 1600, h: 1100, scene: sceneDak },
  { file: "services/zonnepanelen-reinigen.jpg", w: 1600, h: 1100, scene: sceneZonnepanelen },
  { file: "services/terras-en-bestrating.jpg", w: 1600, h: 1100, scene: sceneTerras },
  { file: "services/schilderwerk.jpg", w: 1600, h: 1100, scene: sceneSchilderwerk },
  { file: "services/houtrotherstel.jpg", w: 1600, h: 1100, scene: sceneHoutrot },
  { file: "services/periodiek-onderhoud.jpg", w: 1600, h: 1100, scene: sceneOnderhoud },
  { file: "services/renovatie.jpg", w: 1600, h: 1100, scene: sceneRenovatie },
  // Over ons / intro
  { file: "over-ons/team-aan-het-werk.jpg", w: 1400, h: 1050, scene: sceneTeam },
];

/*
 * Before/after-projecten (public/images/projects/<naam>-voor.jpg en -na.jpg) staan bewust
 * niet in deze lijst: dat zijn AI-gegenereerde voorbeeldfoto's van fictieve woningen.
 * Met --projects worden ook daarvoor (opnieuw) illustraties gemaakt, bijvoorbeeld als de
 * foto's ontbreken.
 */
if (process.argv.includes("--projects")) {
  jobs.push(
    { file: "projects/gevelreiniging-voor.jpg", w: 1600, h: 1200, scene: (w, h) => sceneGevel(w, h, { dirty: true }), dull: true },
    { file: "projects/gevelreiniging-na.jpg", w: 1600, h: 1200, scene: sceneGevel },
    { file: "projects/dakreiniging-voor.jpg", w: 1600, h: 1200, scene: (w, h) => sceneDak(w, h, { dirty: true }), dull: true },
    { file: "projects/dakreiniging-na.jpg", w: 1600, h: 1200, scene: sceneDak },
    { file: "projects/terras-voor.jpg", w: 1600, h: 1200, scene: (w, h) => sceneTerras(w, h, { dirty: true }), dull: true },
    { file: "projects/terras-na.jpg", w: 1600, h: 1200, scene: sceneTerras },
    { file: "projects/schilderwerk-voor.jpg", w: 1600, h: 1200, scene: (w, h) => sceneSchilderwerk(w, h, { dirty: true }), dull: true },
    { file: "projects/schilderwerk-na.jpg", w: 1600, h: 1200, scene: sceneSchilderwerk },
  );
}

for (const job of jobs) {
  const svg = wrap(job.w, job.h, job.scene(job.w, job.h));
  let img = sharp(Buffer.from(svg));
  // 'Voor'-beelden iets doffer en koeler, zodat het verschil met 'na' direct zichtbaar is.
  if (job.dull) img = img.modulate({ saturation: 0.72, brightness: 0.93 });
  const out = path.join(root, job.file);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer());
  console.log("✓", job.file);
}
console.log("\nKlaar. Vervang de illustraties desgewenst door eigen foto's met dezelfde bestandsnaam.");
