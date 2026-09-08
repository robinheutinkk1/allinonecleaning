/**
 * Centrale bedrijfsconfiguratie.
 *
 * Alles wat hier `null` of een [PLACEHOLDER] is, is nog niet bevestigd door
 * All in One Cleaning en wordt op de site verborgen of als placeholder getoond.
 * Vul dit bestand aan zodra de informatie bekend is - er hoeft verder niets
 * in de code te veranderen.
 */

const DEFAULT_SITE_URL = "https://allinone-cleaning.nl";

/**
 * Publieke site-URL bepalen, robuust tegen lege of ongeldige env-waarden.
 * Volgorde: NEXT_PUBLIC_SITE_URL → Vercel productie-/preview-URL → standaarddomein.
 * Een lege string of een waarde zonder geldig formaat mag de build nooit breken.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = (raw ?? "").trim().replace(/\/+$/, "");
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).origin;
    } catch {
      /* ongeldige waarde: volgende kandidaat */
    }
  }
  return DEFAULT_SITE_URL;
}

export const siteConfig = {
  companyName: "All in One Cleaning",
  legalName: "All in One Cleaning Enschede",
  tagline: "Uw gevelspecialist",
  city: "Enschede",
  region: "Twente",
  country: "NL",

  /** Publieke URL van de site (zonder trailing slash). Wordt gebruikt voor canonical, OG en sitemap. */
  url: resolveSiteUrl(),

  /**
   * Contactgegevens. `null` = nog niet bekend → wordt niet getoond.
   * Vul in als: phone: "+31 6 12345678", email: "info@…"
   */
  /** Bron: allinone-cleaning.nl (huidige website). Controleer of dit nummer klopt. */
  phone: "06 58947413" as string | null,
  email: null as string | null,
  whatsapp: null as string | null,

  address: {
    street: null as string | null,
    postalCode: null as string | null,
    city: "Enschede",
  },

  kvk: null as string | null,
  btw: null as string | null,

  /** Openingstijden - nog niet bevestigd. */
  openingHours: null as { days: string; hours: string }[] | null,

  /** Bevestigd werkgebied. Voeg pas plaatsen toe als het bedrijf dit bevestigt. */
  workAreas: ["Enschede", "omgeving Enschede"],

  /** Social links - alleen tonen als bekend. */
  socialLinks: {
    instagram: null as string | null,
    facebook: null as string | null,
    linkedin: null as string | null,
    google: null as string | null, // Google Business Profile URL
  },

  /** Korte bedrijfsomschrijving voor footer, meta en structured data. */
  description:
    "All in One Cleaning is uw gevelspecialist in Enschede en omgeving. Veilige en milieuvriendelijke reiniging van gevels, dakpannen, trespa, bestrating en zonnepanelen met lage druk en biologisch afbreekbare middelen, zonder hogedruk of stoom.",

  /**
   * Reinigingsmethode zoals het bedrijf die zelf beschrijft (bron: allinone-cleaning.nl).
   * Wordt gebruikt in de intro, dienstpagina's en FAQ.
   */
  method: {
    short: "Lage druk en biologisch afbreekbare reinigingsmiddelen, geen hogedruk of stoom.",
    long:
      "Wij reinigen met een combinatie van lage druk en biologisch afbreekbare reinigingsmiddelen. Zo verwijderen we schimmel, bacteriën, algen en andere organische vervuiling zonder het oppervlak te beschadigen. Doordat we geen hogedruk of stoom gebruiken, worden voegen niet uitgeblazen en blijft uw gevel, dak of bestrating intact. Na afloop controleren we het resultaat samen met u.",
    removes: ["Schimmel", "Bacteriën", "Algen en groene aanslag", "Mos", "Organische vlekken en aanslag"],
  },

  /** Voor wie het bedrijf werkt (bron: allinone-cleaning.nl). */
  audiences: ["Particulieren", "Bedrijven", "Instellingen en scholen", "VvE's en beheerders"],

  /** E-mailadres waar nieuwe offerteaanvragen naartoe gaan (server-side, uit env). */
  notificationEmail: process.env.QUOTE_NOTIFICATION_EMAIL ?? null,

  /** Prefix voor offertenummers, bijv. AIC-2026-0001 */
  quotePrefix: "AIC",

  /**
   * Hero-video: Higgsfield variant B, zelf gehost als H.264 (1080p, 8 s, ±1,6 MB, geen audio,
   * naadloze loop). Origineel: assets/originals/hero-higgsfield-variant-b.mp4.
   * Overschrijven kan met NEXT_PUBLIC_HERO_VIDEO_SRC; een lege waarde schakelt de video uit.
   * Laadt de video niet (trage verbinding, databesparing), dan blijft de poster staan.
   */
  heroVideo: process.env.NEXT_PUBLIC_HERO_VIDEO_SRC ?? "/videos/hero.mp4",
} as const;

export type SiteConfig = typeof siteConfig;

export const navigation = {
  main: [
    { label: "Home", href: "/" },
    { label: "Diensten", href: "/diensten" },
    { label: "Before & After", href: "/before-after" },
    { label: "Over ons", href: "/over-ons" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacyverklaring", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;

export const ctaConfig = {
  primary: { label: "Gratis offerte aanvragen", href: "/offerte-aanvragen" },
  primaryShort: { label: "Gratis offerte", href: "/offerte-aanvragen" },
  secondary: { label: "Bekijk onze resultaten", href: "/before-after" },
  contact: { label: "Neem contact op", href: "/contact" },
} as const;

/** Trust-claims onder de hero. Alleen feitelijke, bevestigde claims. */
export const trustItems = [
  { label: "Lage druk, geen hogedruk", description: "Veilig voor voegen, dakpannen en beplating" },
  { label: "Milieuvriendelijke middelen", description: "Biologisch afbreekbare reinigingsmiddelen" },
  { label: "Transparante offerte", description: "Duidelijke prijs vooraf, geen verrassingen" },
  { label: "Actief in Enschede & omgeving", description: "Lokaal bedrijf, persoonlijk contact" },
] as const;

/**
 * Statistieken - alleen tonen met ECHTE cijfers. Zolang `value` null is,
 * wordt de statistiekensectie niet gerenderd.
 */
export const stats: { label: string; value: string | null }[] = [
  { label: "Projecten uitgevoerd", value: null },
  { label: "Jaar ervaring", value: null },
  { label: "Gemiddelde beoordeling", value: null },
];
