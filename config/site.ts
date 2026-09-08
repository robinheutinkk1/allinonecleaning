/**
 * Centrale bedrijfsconfiguratie.
 *
 * Alles wat hier `null` of een [PLACEHOLDER] is, is nog niet bevestigd door
 * All in One Cleaning en wordt op de site verborgen of als placeholder getoond.
 * Vul dit bestand aan zodra de informatie bekend is - er hoeft verder niets
 * in de code te veranderen.
 */

const DEFAULT_SITE_URL = "https://www.allinonecleaning-enschede.nl";

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
  phone: null as string | null,
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
    "All in One Cleaning is uw gevelspecialist in Enschede en omgeving. Professionele reiniging van gevels, dakpannen, trespa en zonnepanelen, met een persoonlijke aanpak en zichtbaar resultaat.",

  /** E-mailadres waar nieuwe offerteaanvragen naartoe gaan (server-side, uit env). */
  notificationEmail: process.env.QUOTE_NOTIFICATION_EMAIL ?? null,

  /** Prefix voor offertenummers, bijv. AIC-2026-0001 */
  quotePrefix: "AIC",
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
  { label: "Professionele aanpak", description: "Passende reinigingsmethode per oppervlak" },
  { label: "Persoonlijk contact", description: "Eén aanspreekpunt, korte lijnen" },
  { label: "Actief in Enschede & omgeving", description: "Lokaal bedrijf, snel ter plaatse" },
  { label: "Gratis offerte met foto's", description: "Beoordeling op basis van uw situatie" },
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
