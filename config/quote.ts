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

/** Stap 1 - Wat wilt u laten doen? Gebaseerd op de bevestigde diensten (reiniging én onderhoud). */
export const serviceOptions: (Option & { icon: "building" | "home" | "layers" | "sun" | "grid" | "paintbrush" | "hammer" | "ruler" | "hardhat" | "more" })[] = [
  { value: "gevel", label: "Gevelreiniging", description: "Metselwerk, gevelsteen", icon: "building" },
  { value: "dak", label: "Dakpanreiniging", description: "Mos en aanslag op het dak, dakgoten", icon: "home" },
  { value: "trespa", label: "Trespa / gevelbekleding", description: "Gevelbeplating, boeidelen reinigen", icon: "layers" },
  { value: "zonnepanelen", label: "Zonnepanelen", description: "Vuil en aanslag op panelen", icon: "sun" },
  { value: "bestrating", label: "Bestrating / terras", description: "Terras, oprit, tuinpad reinigen", icon: "grid" },
  { value: "schilderwerk", label: "Schilderwerk", description: "Binnen en buiten", icon: "paintbrush" },
  { value: "houtrot", label: "Houtrotherstel", description: "Kozijnen, deuren, boeidelen", icon: "hammer" },
  { value: "vloerwerk", label: "Vloerwerk", description: "Leggen, vervangen, herstellen", icon: "ruler" },
  { value: "renovatie", label: "Renovatie / onderhoud", description: "Totaalonderhoud van uw pand", icon: "hardhat" },
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
    { value: "dakgoten", label: "Dakgoten" },
    { value: "anders", label: "Anders" },
  ],
  bestrating: [
    { value: "terras", label: "Terras" },
    { value: "oprit", label: "Oprit" },
    { value: "tuinpad", label: "Tuinpad" },
    { value: "parkeerplaats", label: "Parkeerplaats / bedrijfsterrein" },
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
  schilderwerk: [
    { value: "buiten-kozijnen", label: "Buiten: kozijnen, deuren, boeidelen" },
    { value: "buiten-gevel", label: "Buiten: gevel of gevelbetimmering" },
    { value: "binnen-wanden", label: "Binnen: wanden en plafonds" },
    { value: "binnen-kozijnen", label: "Binnen: kozijnen, deuren, trap" },
    { value: "hele-woning", label: "Hele woning of pand" },
    { value: "anders", label: "Anders" },
  ],
  houtrot: [
    { value: "kozijnen", label: "Kozijnen / ramen" },
    { value: "deuren", label: "Deuren / deurposten" },
    { value: "boeidelen", label: "Boeidelen / dakranden" },
    { value: "gevelbetimmering", label: "Gevelbetimmering" },
    { value: "anders", label: "Anders" },
  ],
  vloerwerk: [
    { value: "woonkamer", label: "Woonkamer / één ruimte" },
    { value: "verdieping", label: "Hele verdieping" },
    { value: "hele-woning", label: "Hele woning" },
    { value: "bedrijfsruimte", label: "Bedrijfsruimte / kantoor" },
    { value: "anders", label: "Anders" },
  ],
  renovatie: [
    { value: "buitenzijde", label: "Buitenzijde van het pand" },
    { value: "binnenzijde", label: "Binnenzijde / ruimtes" },
    { value: "badkamer-keuken", label: "Badkamer of keuken" },
    { value: "totaal", label: "Totaalonderhoud / meerjarig" },
    { value: "anders", label: "Anders" },
  ],
  anders: [
    { value: "schutting", label: "Schutting / tuinmuur" },
    { value: "ramen", label: "Ramen / glasbewassing" },
    { value: "buitenoppervlak", label: "Ander buitenoppervlak" },
    { value: "binnen", label: "Iets binnen in het pand" },
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

/** Stap 5 - Situatie (vervuiling of staat), conditioneel per dienst (multi-select). */
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
  bestrating: [
    { value: "groene-aanslag", label: "Groene aanslag" },
    { value: "mos", label: "Mos tussen de voegen" },
    { value: "algen", label: "Algen (glad oppervlak)" },
    { value: "vuil", label: "Vuil / verkleuring" },
    { value: "onkruid", label: "Onkruid" },
    { value: "anders", label: "Anders" },
  ],
  schilderwerk: [
    { value: "bladdert", label: "Verf bladdert of barst" },
    { value: "verweerd", label: "Verweerd / dof" },
    { value: "houtrot", label: "Houtrot zichtbaar" },
    { value: "andere-kleur", label: "Andere kleur gewenst" },
    { value: "nieuw-hout", label: "Nieuw of kaal hout" },
    { value: "onderhoudsbeurt", label: "Periodieke onderhoudsbeurt" },
    { value: "anders", label: "Anders" },
  ],
  houtrot: [
    { value: "zachte-plekken", label: "Zachte plekken in het hout" },
    { value: "schade", label: "Zichtbare schade / gaten" },
    { value: "verf-los", label: "Verf laat los" },
    { value: "inspectie", label: "Twijfel, graag inspectie" },
    { value: "anders", label: "Anders" },
  ],
  vloerwerk: [
    { value: "nieuw", label: "Nieuwe vloer leggen" },
    { value: "vervangen", label: "Bestaande vloer vervangen" },
    { value: "herstel", label: "Herstel / reparatie" },
    { value: "egaliseren", label: "Ondervloer egaliseren" },
    { value: "anders", label: "Anders" },
  ],
  renovatie: [
    { value: "opknappen", label: "Opknappen / renoveren" },
    { value: "periodiek", label: "Periodiek onderhoud" },
    { value: "schade", label: "Herstel na schade" },
    { value: "combinatie", label: "Combinatie van reiniging en schilderwerk" },
    { value: "anders", label: "Anders" },
  ],
  anders: [
    { value: "groene-aanslag", label: "Groene aanslag" },
    { value: "mos", label: "Mos" },
    { value: "algen", label: "Algen" },
    { value: "vuil", label: "Vuil" },
    { value: "verkleuring", label: "Verkleuring" },
    { value: "hardnekkig", label: "Hardnekkige aanslag" },
    { value: "schade", label: "Schade / slijtage" },
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
  { id: "service", title: "Wat wilt u laten doen?", short: "Dienst" },
  { id: "property", title: "Wat voor pand betreft het?", short: "Pand" },
  { id: "surface", title: "Wat wilt u precies laten aanpakken?", short: "Onderdeel" },
  { id: "size", title: "Hoe groot is het ongeveer?", short: "Omvang" },
  { id: "contamination", title: "Wat is de huidige situatie?", short: "Situatie" },
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
