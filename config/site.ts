/**
 * Centrale bedrijfsconfiguratie van de demo-website.
 *
 * NOVA Onderhoud is een fictief voorbeeldbedrijf. Alle gegevens hieronder zijn
 * demo-gegevens: telefoonnummer, e-mailadres, werkgebied en teksten zijn bedacht
 * om te laten zien hoe een bedrijfswebsite op dit platform eruit kan zien.
 */

const DEFAULT_SITE_URL = "https://www.novademo.nl";

/**
 * Publieke site-URL bepalen, robuust tegen lege of ongeldige env-waarden.
 * Volgorde: NEXT_PUBLIC_SITE_URL → Vercel productie-/preview-URL → standaarddomein.
 */
function resolveSiteUrl(): string {
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL];
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
  companyName: "NOVA Onderhoud",
  shortName: "NOVA",
  legalName: "NOVA Onderhoud",
  tagline: "Professioneel onderhoud voor woning en bedrijf",
  /** Regio waarin het demobedrijf actief is. Geen straatadres: dit is een voorbeeldbedrijf. */
  city: "Twente",
  region: "Twente",
  country: "NL",

  /** Publieke URL van de site (zonder trailing slash). Wordt gebruikt voor canonical, OG en sitemap. */
  url: resolveSiteUrl(),

  /** Demo-contactgegevens. Geen echte nummers of adressen. */
  phone: "06 12 34 56 78" as string | null,
  email: "info@novademo.nl" as string | null,
  whatsapp: null as string | null,

  address: {
    street: null as string | null,
    postalCode: null as string | null,
    city: "Twente, Nederland",
  },

  kvk: null as string | null,
  btw: null as string | null,

  openingHours: [
    { days: "Ma t/m vr", hours: "08:00-17:30" },
    { days: "Zaterdag", hours: "Op afspraak" },
  ] as { days: string; hours: string }[] | null,

  /** Werkgebied van het demobedrijf. */
  workAreas: ["Hengelo", "Borne", "Enschede", "Oldenzaal", "Almelo"],

  /** Social links: leeg in de demo. */
  socialLinks: {
    instagram: null as string | null,
    facebook: null as string | null,
    linkedin: null as string | null,
  },

  /** Korte bedrijfsomschrijving voor footer, meta en structured data. */
  description:
    "Professioneel onderhoud, reiniging en renovatie voor woningen en bedrijfspanden in Twente. Bekijk onze diensten en vraag eenvoudig een offerte aan.",

  /** Reinigingsaanpak (gevel, dak, zonnepanelen, bestrating). */
  method: {
    short: "Een reinigingsmethode die past bij het oppervlak: grondig, maar zonder schade.",
    long:
      "Elk oppervlak vraagt om een andere aanpak. Metselwerk, dakpannen, glas en bestrating reageren allemaal anders op water, druk en reinigingsmiddelen. Daarom kijken we eerst naar het materiaal en de vervuiling en kiezen we daarna de methode: gecontroleerde druk, milieubewuste middelen en de juiste apparatuur. Zo verdwijnt de aanslag, maar blijven voegen, coatings en oppervlakken intact.",
    removes: ["Groene aanslag", "Algen en mos", "Vuil en roet", "Verkleuring", "Vogelpoep en stof"],
  },

  /** Werkwijze bij schilderwerk, herstel en renovatie. */
  workStyle: {
    short: "Vakwerk met oog voor detail, duidelijke afspraken en een resultaat dat lang meegaat.",
    long:
      "Goed onderhoud begint met een eerlijk advies. We bekijken wat er echt nodig is, leggen dat helder uit en plannen het werk in overleg. Tijdens de uitvoering werken we netjes en veilig, met aandacht voor de details die het verschil maken. Na afloop lopen we het resultaat samen met u na.",
    promises: ["Eerlijk advies", "Duidelijke planning", "Netjes en veilig werken", "Nacontrole samen met u"],
  },

  /** Voor wie het demobedrijf werkt. */
  audiences: ["Particulieren", "Bedrijven", "Verhuurders", "VvE's en beheerders"],

  /** E-mailadres waar nieuwe offerteaanvragen naartoe gaan (server-side, uit env). */
  notificationEmail: process.env.QUOTE_NOTIFICATION_EMAIL ?? null,

  /** Prefix voor aanvraagnummers, bijv. NOVA-2026-0001 */
  quotePrefix: "NOVA",

  /**
   * Hero-video: neutrale, AI-gegenereerde beelden van gevelreiniging (geen bedrijf, logo of
   * personen herkenbaar). Overschrijven kan met NEXT_PUBLIC_HERO_VIDEO_SRC; leeg = alleen poster.
   */
  heroVideo: process.env.NEXT_PUBLIC_HERO_VIDEO_SRC ?? "/videos/hero.mp4",
} as const;

export type SiteConfig = typeof siteConfig;

/** Demo-label: deze website is een voorbeeldsite van TagPoint. */
export const demoConfig = {
  platformName: "TagPoint",
  platformUrl: "https://tagpoint.nl",
  credit: "Website concept door TagPoint",
  adminPath: "/beheer",
  /**
   * De publieke site gebruikt standaard alleen de demo-inhoud uit config/ (contactgegevens,
   * reviews, projecten). Zet DEMO_USE_DATABASE_CONTENT=true om de inhoud uit het beheer
   * (database) leidend te maken, zoals bij een echte klantwebsite.
   */
  useDatabaseContent: process.env.DEMO_USE_DATABASE_CONTENT === "true",
} as const;

export const navigation = {
  main: [
    { label: "Home", href: "/" },
    { label: "Diensten", href: "/diensten" },
    { label: "Ons werk", href: "/ons-werk" },
    { label: "Werkwijze", href: "/werkwijze" },
    { label: "Over ons", href: "/over-ons" },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    { label: "Home", href: "/" },
    { label: "Diensten", href: "/diensten" },
    { label: "Ons werk", href: "/ons-werk" },
    { label: "Werkwijze", href: "/werkwijze" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacyverklaring", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;

export const ctaConfig = {
  primary: { label: "Offerte aanvragen", href: "/offerte-aanvragen" },
  primaryShort: { label: "Offerte aanvragen", href: "/offerte-aanvragen" },
  secondary: { label: "Bekijk ons werk", href: "/ons-werk" },
  contact: { label: "Neem contact op", href: "/contact" },
} as const;

/** Trust-claims onder de hero. */
export const trustItems = [
  { label: "Eén team voor alles", description: "Van reiniging tot schilderwerk en renovatie" },
  { label: "Passende methode per oppervlak", description: "Grondig resultaat, geen schade" },
  { label: "Duidelijke offerte vooraf", description: "Heldere prijs, geen verrassingen" },
  { label: "Actief in Twente", description: "Hengelo, Borne, Enschede, Oldenzaal, Almelo" },
] as const;

/** Statistieken op de homepage staan in de demo uit; via het beheer zijn ze in te vullen. */
export const stats: { label: string; value: string | null }[] = [];
