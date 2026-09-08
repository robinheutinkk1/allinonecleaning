/**
 * Configuratie van de digitale offertewizard.
 *
 * Alle opties zijn hier centraal aanpasbaar. De wizard, de server-side
 * validatie (lib/validation/quote.ts) en de e-mails gebruiken deze lijst.
 */

export type Option = {
  value: string;
  label: string;
  description?: string;
};

/** Stap 1 - Wat wilt u laten reinigen? Gebaseerd op de bevestigde diensten. */
export const serviceOptions: (Option & { icon: "building" | "home" | "layers" | "sun" | "more" })[] = [
  { value: "gevel", label: "Gevel", description: "Metselwerk, gevelsteen", icon: "building" },
  { value: "dak", label: "Dakpannen", description: "Mos en aanslag op het dak", icon: "home" },
  { value: "trespa", label: "Trespa / gevelbekleding", description: "Gevelbeplating, boeidelen", icon: "layers" },
  { value: "zonnepanelen", label: "Zonnepanelen", description: "Vuil en aanslag op panelen", icon: "sun" },
  { value: "anders", label: "Anders", description: "Iets anders? Vertel het ons", icon: "more" },
];

/** Stap 2 - Pandtype */
export const propertyTypeOptions: Option[] = [
  { value: "woning", label: "Woning" },
  { value: "bedrijfspand", label: "Bedrijfspand" },
  { value: "appartement", label: "Appartement / VvE" },
  { value: "anders", label: "Anders" },
];

/**
 * Stap 3 - Oppervlak, conditioneel per gekozen dienst.
 * Sleutel = `value` uit serviceOptions.
 */
export const surfaceOptionsByService: Record<string, Option[]> = {
  gevel: [
    { value: "voorgevel", label: "Voorgevel" },
    { value: "zijgevel", label: "Zijgevel(s)" },
    { value: "achtergevel", label: "Achtergevel" },
    { value: "hele-gevel", label: "Hele gevel rondom" },
    { value: "muur-schutting", label: "Tuinmuur / schutting" },
    { value: "anders", label: "Anders" },
  ],
  dak: [
    { value: "schuin-dak", label: "Schuin pannendak" },
    { value: "dakkapel", label: "Dakkapel" },
    { value: "bijgebouw", label: "Garage / bijgebouw" },
    { value: "heel-dak", label: "Hele dak" },
    { value: "anders", label: "Anders" },
  ],
  trespa: [
    { value: "gevelbekleding", label: "Gevelbekleding" },
    { value: "boeidelen", label: "Boeidelen / dakranden" },
    { value: "dakkapel", label: "Dakkapel" },
    { value: "anders", label: "Anders" },
  ],
  zonnepanelen: [
    { value: "schuin-dak", label: "Panelen op schuin dak" },
    { value: "plat-dak", label: "Panelen op plat dak" },
    { value: "veldopstelling", label: "Panelen op de grond / veld" },
    { value: "anders", label: "Anders" },
  ],
  anders: [
    { value: "terras-bestrating", label: "Terras / bestrating" },
    { value: "oprit", label: "Oprit" },
    { value: "buitenoppervlak", label: "Ander buitenoppervlak" },
    { value: "anders", label: "Anders" },
  ],
};

/** Stap 4 - Omvang */
export const sizeOptions: Option[] = [
  { value: "klein", label: "Klein", description: "Bijv. één gevel of dakvlak" },
  { value: "gemiddeld", label: "Gemiddeld", description: "Bijv. een rijtjeswoning" },
  { value: "groot", label: "Groot", description: "Bijv. vrijstaand of bedrijfspand" },
  { value: "onbekend", label: "Weet ik niet", description: "Geen probleem, wij beoordelen het" },
];

/** Stap 5 - Vervuiling, conditioneel per dienst (multi-select). */
export const contaminationOptionsByService: Record<string, Option[]> = {
  gevel: [
    { value: "groene-aanslag", label: "Groene aanslag" },
    { value: "algen", label: "Algen" },
    { value: "mos", label: "Mos" },
    { value: "vuil", label: "Vuil / roet" },
    { value: "verkleuring", label: "Verkleuring" },
    { value: "witte-uitslag", label: "Witte uitslag" },
    { value: "hardnekkig", label: "Hardnekkige aanslag" },
    { value: "anders", label: "Anders" },
  ],
  dak: [
    { value: "mos", label: "Mos" },
    { value: "groene-aanslag", label: "Groene aanslag" },
    { value: "algen", label: "Algen" },
    { value: "korstmos", label: "Korstmos (witte/gele plekken)" },
    { value: "vuil", label: "Vuil" },
    { value: "verkleuring", label: "Verkleuring" },
    { value: "anders", label: "Anders" },
  ],
  trespa: [
    { value: "vuil", label: "Vuil / stof" },
    { value: "strepen", label: "Strepen / uitloop" },
    { value: "groene-aanslag", label: "Groene aanslag" },
    { value: "verkleuring", label: "Doffe plekken / verkleuring" },
    { value: "anders", label: "Anders" },
  ],
  zonnepanelen: [
    { value: "stof", label: "Stof / pollen" },
    { value: "vogelpoep", label: "Vogelpoep" },
    { value: "groene-aanslag", label: "Groene aanslag / algen" },
    { value: "kalk", label: "Kalkaanslag" },
    { value: "anders", label: "Anders" },
  ],
  anders: [
    { value: "groene-aanslag", label: "Groene aanslag" },
    { value: "mos", label: "Mos" },
    { value: "algen", label: "Algen" },
    { value: "vuil", label: "Vuil" },
    { value: "verkleuring", label: "Verkleuring" },
    { value: "hardnekkig", label: "Hardnekkige aanslag" },
    { value: "anders", label: "Anders" },
  ],
};

/** Stap 8 - Planning */
export const periodOptions: Option[] = [
  { value: "asap", label: "Zo snel mogelijk" },
  { value: "2-weken", label: "Binnen 2 weken" },
  { value: "1-maand", label: "Binnen 1 maand" },
  { value: "geen-voorkeur", label: "Geen voorkeur" },
];

/** Upload-limieten (ook server-side gebruikt) */
export const uploadConfig = {
  maxFiles: 8,
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

/** Wizard-stappen in volgorde. Wordt gebruikt voor progress en samenvatting. */
export const quoteSteps = [
  { id: "service", title: "Wat wilt u laten reinigen?", short: "Dienst" },
  { id: "property", title: "Wat voor pand betreft het?", short: "Pand" },
  { id: "surface", title: "Wat wilt u precies laten reinigen?", short: "Oppervlak" },
  { id: "size", title: "Hoe groot is het ongeveer?", short: "Omvang" },
  { id: "contamination", title: "Hoe ziet de vervuiling eruit?", short: "Vervuiling" },
  { id: "photos", title: "Laat ons alvast meekijken", short: "Foto's" },
  { id: "location", title: "Waar bevindt de klus zich?", short: "Locatie" },
  { id: "period", title: "Wanneer wilt u het laten uitvoeren?", short: "Planning" },
  { id: "contact", title: "Hoe kunnen wij u bereiken?", short: "Contact" },
  { id: "review", title: "Controleer uw aanvraag", short: "Controle" },
] as const;

export type QuoteStepId = (typeof quoteSteps)[number]["id"];

/** Helpers om labels op te zoeken voor samenvatting en e-mails */
export function labelFor(options: Option[], value: string | null | undefined): string {
  if (!value) return "-";
  return options.find((o) => o.value === value)?.label ?? value;
}

export function surfaceOptionsFor(service: string | null | undefined): Option[] {
  return surfaceOptionsByService[service ?? "anders"] ?? surfaceOptionsByService.anders;
}

export function contaminationOptionsFor(service: string | null | undefined): Option[] {
  return contaminationOptionsByService[service ?? "anders"] ?? contaminationOptionsByService.anders;
}
