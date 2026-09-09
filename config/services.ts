/**
 * Diensten van All in One Vastgoedonderhoud.
 *
 * Bronnen: de belettering op de bedrijfsbus ("Gevelreiniging · Dakpanreiniging ·
 * Trespa · Zonnepanelen"), de huidige website allinone-cleaning.nl (daar staan
 * ook bestrating, terras en dakgoten) en de aangeleverde before/after-foto's.
 *
 * Voeg hier een dienst toe of verwijder er een: de dienstenpagina, homepage,
 * offertewizard, sitemap en structured data volgen automatisch.
 */

export type ServiceSlug = "gevelreiniging" | "dakpanreiniging" | "trespa-reiniging" | "zonnepanelen-reiniging" | "bestrating-reiniging";

export type Service = {
  slug: ServiceSlug;
  /** Pagina-URL. Gevelreiniging heeft een eigen pillar-pagina. */
  href: string;
  title: string;
  shortTitle: string;
  /** Icoonnaam uit lucide-react (zie components/ui/ServiceIcon.tsx) */
  icon: "building" | "home" | "layers" | "sun" | "grid";
  image: string;
  imageAlt: string;
  /** Eén zin voor kaarten */
  tagline: string;
  /** Korte omschrijving voor kaarten en overzichten */
  summary: string;
  /** Langere intro voor de dienstpagina */
  intro: string;
  /** Voordelen: feitelijk, gebaseerd op de werkwijze van het bedrijf */
  benefits: string[];
  /** Voor wie / wanneer is dit relevant */
  suitableFor: string[];
  /** Meta */
  seoTitle: string;
  seoDescription: string;
  /** Sleutel die de offertewizard gebruikt */
  quoteKey: string;
};

export const services: Service[] = [
  {
    slug: "gevelreiniging",
    href: "/gevelreiniging",
    title: "Gevelreiniging",
    shortTitle: "Gevel",
    icon: "building",
    image: "/images/services/gevelreiniging.jpg",
    imageAlt: "Medewerker van All in One Vastgoedonderhoud reinigt een gevel in Enschede",
    tagline: "Een gevel die weer gezien mag worden.",
    summary:
      "Groene aanslag, algen en vuil maken een gevel dof. Wij reinigen metselwerk en gevelsteen met lage druk en biologisch afbreekbare middelen, zodat uw pand weer een verzorgde uitstraling heeft.",
    intro:
      "De gevel is het eerste wat bezoekers van uw woning of bedrijfspand zien. Door weersinvloeden, verkeer en vocht ontstaat er na verloop van tijd een laag vuil, algen, schimmel en groene aanslag. Wij verwijderen die laag met lage druk en biologisch afbreekbare reinigingsmiddelen. Zo blijven de voegen intact en komt de oorspronkelijke kleur van de steen weer tevoorschijn.",
    benefits: [
      "Geen hogedruk: voegen worden niet uitgeblazen",
      "Biologisch afbreekbare reinigingsmiddelen",
      "Verwijdert algen, schimmel, groene aanslag en vuil",
      "Eindcontrole samen met u na afloop",
    ],
    suitableFor: ["Woningen en appartementen", "Bedrijfspanden en winkels", "VvE's en scholen", "Metselwerk en gevelsteen"],
    seoTitle: "Gevelreiniging Enschede | All in One Vastgoedonderhoud",
    seoDescription:
      "Gevelreiniging in Enschede en omgeving zonder hogedruk. All in One Vastgoedonderhoud verwijdert algen, schimmel en groene aanslag met lage druk en milieuvriendelijke middelen. Vraag gratis een offerte aan en stuur foto's mee.",
    quoteKey: "gevel",
  },
  {
    slug: "dakpanreiniging",
    href: "/diensten/dakpanreiniging",
    title: "Dakpanreiniging",
    shortTitle: "Dakpannen",
    icon: "home",
    image: "/images/services/dakpanreiniging.jpg",
    imageAlt: "Schoon pannendak van een woning na dakpanreiniging door All in One Vastgoedonderhoud",
    tagline: "Mos en aanslag van uw dak, de kleur van uw pannen terug.",
    summary:
      "Mos, algen en aanslag op dakpannen houden vocht vast en doen afbreuk aan de uitstraling van uw woning. Wij reinigen uw dakpannen zorgvuldig met lage druk en zonder stoom.",
    intro:
      "Op dakpannen hecht zich in de loop der jaren mos, korstmos, groene aanslag en vuil. Dat ziet er niet alleen slordig uit, maar houdt ook vocht vast. Wij reinigen de pannen met lage druk en biologisch afbreekbare middelen, zodat de pannen en de dakconstructie geen schade oplopen. Na reiniging is de oorspronkelijke kleur weer zichtbaar. Bekijk het verschil op onze before & after-pagina. Ook dakgoten reinigen wij in dezelfde werkgang.",
    benefits: [
      "Mos, algen en aanslag verwijderd zonder hogedruk",
      "Oorspronkelijke kleur van de dakpannen weer zichtbaar",
      "Werken op hoogte met hoogwerker of ladder, veilig en netjes",
      "Dakgoten desgewenst direct meegenomen",
    ],
    suitableFor: ["Woningen met pannendak", "Bedrijfspanden", "Bijgebouwen en garages", "Dakgoten"],
    seoTitle: "Dakpanreiniging Enschede | Mos en aanslag verwijderen | All in One Vastgoedonderhoud",
    seoDescription:
      "Dakpannen reinigen in Enschede en omgeving met lage druk. All in One Vastgoedonderhoud verwijdert mos, algen en aanslag van uw dak zonder schade. Bekijk onze before & after-resultaten en vraag een gratis offerte aan.",
    quoteKey: "dak",
  },
  {
    slug: "trespa-reiniging",
    href: "/diensten/trespa-reiniging",
    title: "Trespa reiniging",
    shortTitle: "Trespa",
    icon: "layers",
    image: "/images/services/trespa-reiniging.jpg",
    imageAlt: "Reiniging van trespa gevelbekleding door All in One Vastgoedonderhoud",
    tagline: "Gevelbekleding weer strak en fris.",
    summary:
      "Trespa en andere gevelbeplating worden dof en vlekkerig door vuil en weersinvloeden. Wij reinigen de beplating grondig en veilig, zodat uw gevel er weer als nieuw uitziet.",
    intro:
      "Trespa en vergelijkbare HPL-gevelbekleding zijn onderhoudsarm, maar niet onderhoudsvrij. Vuil, aanslag en strepen maken de platen dof. Met lage druk en materiaalvriendelijke, biologisch afbreekbare middelen reinigen wij de beplating zonder krassen of beschadigingen. Het resultaat: strakke, frisse platen en een gevel die er weer verzorgd uitziet.",
    benefits: [
      "Materiaalvriendelijke reiniging, geen hogedruk of stoom",
      "Strepen, aanslag en vuil verwijderd",
      "Geschikt voor woningen, bedrijfspanden en scholen",
      "Duidelijke offerte vooraf",
    ],
    suitableFor: ["Trespa en HPL-beplating", "Dakranden en boeidelen", "Bedrijfspanden en scholen", "Dakkapellen"],
    seoTitle: "Trespa reinigen Enschede | Gevelbekleding schoonmaken | All in One Vastgoedonderhoud",
    seoDescription:
      "Trespa en gevelbeplating reinigen in Enschede en omgeving. All in One Vastgoedonderhoud maakt uw gevelbekleding weer strak en fris, zonder hogedruk. Gratis offerte, stuur eenvoudig foto's mee.",
    quoteKey: "trespa",
  },
  {
    slug: "zonnepanelen-reiniging",
    href: "/diensten/zonnepanelen-reiniging",
    title: "Zonnepanelen reiniging",
    shortTitle: "Zonnepanelen",
    icon: "sun",
    image: "/images/services/zonnepanelen-reiniging.jpg",
    imageAlt: "Reiniging van zonnepanelen op een dak door All in One Vastgoedonderhoud",
    tagline: "Schone panelen, optimaal rendement.",
    summary:
      "Stof, vogelpoep, pollen en aanslag verminderen de opbrengst van zonnepanelen. Wij reinigen uw panelen veilig en milieuvriendelijk, zodat ze weer optimaal kunnen presteren.",
    intro:
      "Zonnepanelen liggen dag en nacht buiten en vangen stof, pollen, vogelpoep en aanslag op. Een vuile laag op het glas laat minder licht door. Wij reinigen de panelen met zachte middelen en lage druk, zonder krassen en zonder agressieve chemie, zodat het glas weer schoon is en de panelen weer optimaal kunnen renderen.",
    benefits: [
      "Veilige reiniging van het paneeloppervlak, geen krassen",
      "Milieuvriendelijke, biologisch afbreekbare middelen",
      "Werken op hoogte met passend materieel",
      "Te combineren met dakpanreiniging",
    ],
    suitableFor: ["Woningen", "Bedrijfsdaken", "Panelen op schuine en platte daken"],
    seoTitle: "Zonnepanelen reinigen Enschede | All in One Vastgoedonderhoud",
    seoDescription:
      "Zonnepanelen laten reinigen in Enschede en omgeving. All in One Vastgoedonderhoud verwijdert vuil en aanslag veilig en milieuvriendelijk voor een optimaal rendement. Vraag vrijblijvend een offerte aan.",
    quoteKey: "zonnepanelen",
  },
  {
    slug: "bestrating-reiniging",
    href: "/diensten/bestrating-reiniging",
    title: "Bestrating en terras",
    shortTitle: "Bestrating",
    icon: "grid",
    image: "/images/services/bestrating-reiniging.jpg",
    imageAlt: "Reiniging van bestrating en terras door All in One Vastgoedonderhoud",
    tagline: "Terras, oprit en tuinpad weer schoon en veilig.",
    summary:
      "Groene aanslag en mos maken bestrating glad en dof. Wij reinigen terrassen, opritten en tuinpaden met lage druk, zonder de voegen uit te spoelen.",
    intro:
      "Op terrassen, opritten en tuinpaden ontstaat door vocht en schaduw al snel groene aanslag, mos en algen. Dat ziet er verwaarloosd uit en is glad bij nat weer. Wij reinigen de bestrating met lage druk en biologisch afbreekbare middelen. Anders dan bij hogedrukreiniging blijft het voegzand op zijn plek en wordt het oppervlak van de stenen niet aangetast.",
    benefits: [
      "Groene aanslag, mos en algen verwijderd",
      "Voegzand blijft op zijn plek, geen uitgespoelde voegen",
      "Minder glad, veiliger bij nat weer",
      "Geschikt voor klinkers, tegels en natuursteen",
    ],
    suitableFor: ["Terrassen", "Opritten", "Tuinpaden", "Parkeerplaatsen en bedrijfsterreinen"],
    seoTitle: "Bestrating en terras reinigen Enschede | All in One Vastgoedonderhoud",
    seoDescription:
      "Terras, oprit of tuinpad laten reinigen in Enschede en omgeving. All in One Vastgoedonderhoud verwijdert groene aanslag en mos met lage druk, zonder de voegen uit te spoelen. Gratis offerte.",
    quoteKey: "bestrating",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceByQuoteKey(key: string): Service | undefined {
  return services.find((s) => s.quoteKey === key);
}
