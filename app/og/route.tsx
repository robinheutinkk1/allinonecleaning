import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { demoConfig, siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /og?t=<titel>&s=<ondertitel>&k=<kicker>&v=<variant>
 * Dynamische deelafbeelding (Open Graph / Twitter) van 1200x630.
 *
 * - Standaard: logo, kicker, grote titel, ondertitel, dienstenregel.
 * - v=login: slotje + "Inloggen", zonder marketingtekst.
 * - v=beheer: TagPoint Demo-beheeromgeving.
 * Fonts komen uit assets/fonts (zelfde families als de site), zodat de
 * afbeelding niet afhankelijk is van externe diensten.
 */

const WIDTH = 1200;
const HEIGHT = 630;
/** Inkorten op een woordgrens, met beletselteken. */
const clamp = (v: string | null, max: number, fallback = "") => {
  const s = (v ?? fallback).replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
};
const DEFAULT_TITLE = "Uw pand verdient onderhoud dat gezien mag worden.";
const DEFAULT_SUBTITLE = "Van gevel en dak tot schilderwerk en renovatie. Eén professioneel team voor woning en bedrijfspand in Twente.";

const cache: { fonts?: { name: string; data: Buffer; weight: 400 | 500 | 800 }[]; logo?: string } = {};

async function assets() {
  if (!cache.fonts) {
    const dir = path.join(process.cwd(), "assets/fonts");
    const [jakarta, inter, interMedium] = await Promise.all([
      readFile(path.join(dir, "plus-jakarta-sans-latin-800-normal.woff")),
      readFile(path.join(dir, "inter-latin-400-normal.woff")),
      readFile(path.join(dir, "inter-latin-500-normal.woff")),
    ]);
    cache.fonts = [
      { name: "Jakarta", data: jakarta, weight: 800 },
      { name: "Inter", data: inter, weight: 400 },
      { name: "Inter", data: interMedium, weight: 500 },
    ];
  }
  if (!cache.logo) {
    const png = await readFile(path.join(process.cwd(), "public/brand/nova-logo-light.png"));
    cache.logo = `data:image/png;base64,${png.toString("base64")}`;
  }
  return { fonts: cache.fonts, logo: cache.logo };
}

const navy = "#0a1120";
const gold = "#d9a23a";
const goldSoft = "#ecc76a";

/** Achtergrond op de root zelf: satori kent geen `inset` en geen `filter: blur`, wel (radial-)gradients. */
const rootStyle = {
  width: WIDTH,
  height: HEIGHT,
  display: "flex" as const,
  flexDirection: "column" as const,
  justifyContent: "space-between" as const,
  padding: 72,
  position: "relative" as const,
  color: "#fff",
  fontFamily: "Inter",
  backgroundColor: navy,
  backgroundImage: `linear-gradient(115deg, ${navy} 0%, #111c30 55%, #1f2d5c 130%)`,
};

function Background() {
  return (
    <>
      <div style={{ position: "absolute", top: -220, left: 640, width: 760, height: 760, borderRadius: 9999, backgroundImage: "radial-gradient(circle, rgba(217,162,58,0.38) 0%, rgba(217,162,58,0.12) 40%, rgba(217,162,58,0) 70%)" }} />
      <div style={{ position: "absolute", top: 380, left: -200, width: 560, height: 560, borderRadius: 9999, backgroundImage: "radial-gradient(circle, rgba(217,162,58,0.16) 0%, rgba(217,162,58,0) 65%)" }} />
      <div style={{ position: "absolute", top: HEIGHT - 6, left: 0, width: WIDTH, height: 6, backgroundImage: `linear-gradient(90deg, ${gold} 0%, rgba(217,162,58,0) 100%)` }} />
    </>
  );
}

function Brand({ logo, label }: { logo: string; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={264} height={80} alt="" style={{ objectFit: "contain" }} />
      {label && (
        <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 18, letterSpacing: 5, color: goldSoft, textTransform: "uppercase", borderLeft: `2px solid rgba(255,255,255,0.15)`, paddingLeft: 24 }}>{label}</span>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <div style={{ display: "flex", width: 132, height: 132, borderRadius: 36, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" }}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={goldSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16.5" r="1" fill={goldSoft} />
      </svg>
    </div>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { fonts, logo } = await assets();
  const v = searchParams.get("v");
  const variant = v === "login" || v === "beheer" ? v : "default";

  const image =
    variant === "login" ? (
      <div style={rootStyle}>
        <Background />
        <Brand logo={logo} label="Dashboard" />
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <LockIcon />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Jakarta", fontWeight: 800, fontSize: 72, lineHeight: 1.05, letterSpacing: -2 }}>Inloggen voor medewerkers</span>
            <span style={{ fontSize: 28, color: "#c3d0e0", marginTop: 18 }}>Aanvragen, projecten, reviews en instellingen beheren.</span>
          </div>
        </div>
        <span style={{ fontSize: 22, color: "#94a9c4" }}>Alleen voor het team van {siteConfig.companyName}</span>
      </div>
    ) : variant === "beheer" ? (
      <div style={rootStyle}>
        <Background />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 56, height: 56, borderRadius: 16, background: gold, alignItems: "center", justifyContent: "center" }}>
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
              <path d="M27 58L50 35L73 58" />
              <path d="M36 71H64" />
            </svg>
          </div>
          <span style={{ fontFamily: "Jakarta", fontWeight: 800, fontSize: 34, letterSpacing: -1 }}>{demoConfig.platformName} Demo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <LockIcon />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Jakarta", fontWeight: 800, fontSize: 72, lineHeight: 1.05, letterSpacing: -2 }}>Demo beheeromgeving</span>
            <span style={{ fontSize: 28, color: "#c3d0e0", marginTop: 18 }}>Website, diensten, projecten, reviews en aanvragen beheren.</span>
          </div>
        </div>
        <span style={{ fontSize: 22, color: "#94a9c4" }}>Voorbeeldomgeving voor de website van {siteConfig.companyName}</span>
      </div>
    ) : (
      (() => {
        const kicker = clamp(searchParams.get("k"), 60, `${siteConfig.tagline} · ${siteConfig.city}`);
        const title = clamp(searchParams.get("t"), 90, DEFAULT_TITLE);
        const subtitle = clamp(searchParams.get("s"), 140, DEFAULT_SUBTITLE);
        const titleSize = title.length > 60 ? 54 : title.length > 40 ? 62 : 74;
        return (
          <div style={rootStyle}>
            <Background />
            <Brand logo={logo} />
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
              <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 22, letterSpacing: 6, color: goldSoft, textTransform: "uppercase" }}>{kicker}</span>
              <span style={{ fontFamily: "Jakarta", fontWeight: 800, fontSize: titleSize, lineHeight: 1.06, letterSpacing: -2, marginTop: 18 }}>{title}</span>
              {subtitle && <span style={{ fontSize: 27, lineHeight: 1.4, color: "#c3d0e0", marginTop: 22, maxWidth: 960 }}>{subtitle}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 21, color: "#94a9c4" }}>
              {["Reiniging", "Schilderwerk", "Houtrotherstel", "Onderhoud", "Renovatie"].map((s, i) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && <span style={{ width: 6, height: 6, borderRadius: 9999, background: gold }} />}
                  {s}
                </span>
              ))}
            </div>
          </div>
        );
      })()
    );

  return new ImageResponse(image, {
    width: WIDTH,
    height: HEIGHT,
    fonts: fonts.map((f) => ({ name: f.name, data: f.data, weight: f.weight, style: "normal" as const })),
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000" },
  });
}
