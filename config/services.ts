/**
 * Diensten van All in One Vastgoedonderhoud.
 *
 * Bronnen: de belettering op de bedrijfsbus ("Gevelreiniging · Dakpanreiniging ·
 * Trespa · Zonnepanelen"), de website allinone-cleaning.nl (bestrating, terras,
 * dakgoten), de aangeleverde before/after-foto's en het Trustoo-profiel van
 * All in One Vastgoedonderhoud B.V. (schilderwerk binnen en buiten, houtrotherstel,
 * vloerwerk, renovatie en totaalonderhoud).
 *
 * Voeg hier een dienst toe of verwijder er een: de dienstenpagina, homepage,
 * offertewizard, sitemap en structured data volgen automatisch.
 */

export type ServiceSlug =
  | "gevelreiniging"
  | "dakpanreiniging"
  | "trespa-reiniging"
  | "zonnepanelen-reiniging"
  | "bestrating-reiniging"
  | "schilderwerk"
  | "houtrotherstel"
  | "vloerwerk"
  | "renovatie-onderhoud";

/** Reiniging (lage druk, biologisch afbreekbaar) of onderhoud (schilderwerk, herstel, renovatie). */
export type ServiceCategory = "reiniging" | "onderhoud";

export type Service = {
  slug: ServiceSlug;
  category: ServiceCategory;
  /** Pagina-URL. Gevelreiniging heeft een eigen pillar-pagina. */
  href: string;
  title: string;
  shortTitle: string;
  /** Icoonnaam uit lucide-react (zie components/ui/ServiceIcon.tsx) */
  icon: "building" | "home" | "layers" | "sun" | "grid" | "paintbrush" | "hammer" | "ruler" | "hardhat";
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
    category: "reiniging",
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
      "Gevelreiniging in Enschede en heel Overijssel zonder hogedruk. All in One Vastgoedonderhoud verwijdert algen, schimmel en groene aanslag met lage druk en milieuvriendelijke middelen. Vraag gratis een offerte aan en stuur foto's mee.",
    quoteKey: "gevel",
  },
  {
    slug: "dakpanreiniging",
    category: "reiniging",
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
      "Dakpannen reinigen in Enschede en heel Overijssel met lage druk. All in One Vastgoedonderhoud verwijdert mos, algen en aanslag van uw dak zonder schade. Bekijk onze before & after-resultaten en vraag een gratis offerte aan.",
    quoteKey: "dak",
  },
  {
    slug: "trespa-reiniging",
    category: "reiniging",
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
      "Trespa en gevelbeplating reinigen in Enschede en heel Overijssel. All in One Vastgoedonderhoud maakt uw gevelbekleding weer strak en fris, zonder hogedruk. Gratis offerte, stuur eenvoudig foto's mee.",
    quoteKey: "trespa",
  },
  {
    slug: "zonnepanelen-reiniging",
    category: "reiniging",
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
      "Zonnepanelen laten reinigen in Enschede en heel Overijssel. All in One Vastgoedonderhoud verwijdert vuil en aanslag veilig en milieuvriendelijk voor een optimaal rendement. Vraag vrijblijvend een offerte aan.",
    quoteKey: "zonnepanelen",
  },
  {
    slug: "bestrating-reiniging",
    category: "reiniging",
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
      "Terras, oprit of tuinpad laten reinigen in Enschede en heel Overijssel. All in One Vastgoedonderhoud verwijdert groene aanslag en mos met lage druk, zonder de voegen uit te spoelen. Gratis offerte.",
    quoteKey: "bestrating",
  },
  {
    slug: "schilderwerk",
    category: "onderhoud",
    href: "/diensten/schilderwerk",
    title: "Schilderwerk binnen en buiten",
    shortTitle: "Schilderwerk",
    icon: "paintbrush",
    image: "/images/services/schilderwerk.jpg",
    imageAlt: "Buitenschilderwerk aan kozijnen door All in One Vastgoedonderhoud",
    tagline: "Strak schilderwerk dat jaren meegaat.",
    summary:
      "Professioneel binnen- en buitenschilderwerk voor woningen en bedrijfspanden. Van kozijnen, deuren en boeidelen tot wanden en plafonds, met oog voor detail en een duurzaam, strak eindresultaat.",
    intro:
      "Goed schilderwerk beschermt uw pand tegen weer en wind en bepaalt voor een groot deel de uitstraling. Wij verzorgen buitenschilderwerk van kozijnen, deuren, boeidelen en gevelbetimmering, en binnenschilderwerk van wanden, plafonds, kozijnen en deuren. Het ondergrondwerk doen we zorgvuldig: schoonmaken, schuren, herstellen en gronden, zodat de afwerking lang mooi blijft.",
    benefits: [
      "Binnen- en buitenschilderwerk door één partij",
      "Zorgvuldige voorbereiding van de ondergrond",
      "Duurzaam en strak eindresultaat",
      "Eerlijk advies over kleur, verfsysteem en onderhoudsinterval",
    ],
    suitableFor: ["Kozijnen, deuren en boeidelen", "Wanden en plafonds", "Woningen en appartementen", "Bedrijfspanden en VvE's"],
    seoTitle: "Schilder Enschede | Binnen- en buitenschilderwerk | All in One Vastgoedonderhoud",
    seoDescription:
      "Schilderwerk binnen en buiten in Enschede en heel Overijssel. All in One Vastgoedonderhoud schildert kozijnen, deuren, boeidelen, wanden en plafonds met een strak en duurzaam resultaat. Vraag een vrijblijvende offerte aan.",
    quoteKey: "schilderwerk",
  },
  {
    slug: "houtrotherstel",
    category: "onderhoud",
    href: "/diensten/houtrotherstel",
    title: "Houtrotherstel",
    shortTitle: "Houtrot",
    icon: "hammer",
    image: "/images/services/houtrotherstel.jpg",
    imageAlt: "Herstel van houtrot in een kozijn door All in One Vastgoedonderhoud",
    tagline: "Houtrot vakkundig hersteld, voordat het erger wordt.",
    summary:
      "Zachte plekken in kozijnen, deuren of boeidelen? Wij verwijderen het aangetaste hout, herstellen het met een duurzaam reparatiesysteem en werken het strak af, zodat vervangen vaak niet nodig is.",
    intro:
      "Houtrot begint klein: een zachte plek onderin een kozijn of een naad waar water in trekt. Wordt het niet aangepakt, dan breidt het zich uit en wordt vervangen op den duur de enige optie. Wij halen het aangetaste hout weg, behandelen de plek, vullen en herstellen het met een duurzaam reparatiesysteem en schilderen het weer strak af. Zo gaat uw kozijn of deur weer jaren mee.",
    benefits: [
      "Herstel in plaats van vervangen, vaak een stuk voordeliger",
      "Duurzaam reparatiesysteem, strak afgewerkt",
      "Direct gecombineerd met het schilderwerk",
      "Eerlijk advies als vervangen toch de betere keuze is",
    ],
    suitableFor: ["Kozijnen en ramen", "Deuren en deurposten", "Boeidelen en dakranden", "Gevelbetimmering"],
    seoTitle: "Houtrot herstellen Enschede | All in One Vastgoedonderhoud",
    seoDescription:
      "Houtrotherstel in Enschede en heel Overijssel. All in One Vastgoedonderhoud herstelt aangetaste kozijnen, deuren en boeidelen met een duurzaam reparatiesysteem en werkt ze strak af. Vraag een vrijblijvende offerte aan.",
    quoteKey: "houtrot",
  },
  {
    slug: "vloerwerk",
    category: "onderhoud",
    href: "/diensten/vloerwerk",
    title: "Vloerwerk",
    shortTitle: "Vloerwerk",
    icon: "ruler",
    image: "/images/services/vloerwerk.jpg",
    imageAlt: "Vloerwerk in een woning door All in One Vastgoedonderhoud",
    tagline: "Een vloer die strak ligt en lang meegaat.",
    summary:
      "Vloerwerk voor woningen en bedrijfspanden: leggen, vervangen en herstellen. Netjes voorbereid, strak afgewerkt en met duidelijke afspraken vooraf.",
    intro:
      "Een goede vloer begint bij een goede voorbereiding. Wij verzorgen vloerwerk in woningen en bedrijfspanden: het leggen van een nieuwe vloer, het vervangen van een bestaande vloer en het herstellen van beschadigingen. We adviseren eerlijk over wat past bij de ruimte en het gebruik, en werken netjes en volgens afspraak.",
    benefits: [
      "Leggen, vervangen en herstellen door één partij",
      "Zorgvuldige voorbereiding van de ondervloer",
      "Strakke afwerking tot in de hoeken",
      "Duidelijke planning en communicatie",
    ],
    suitableFor: ["Woonkamers en verdiepingen", "Bedrijfsruimtes en kantoren", "Renovatieprojecten", "Verhuur- en VvE-panden"],
    seoTitle: "Vloerwerk Enschede | Vloer leggen of vervangen | All in One Vastgoedonderhoud",
    seoDescription:
      "Vloerwerk in Enschede en heel Overijssel: vloeren leggen, vervangen en herstellen in woningen en bedrijfspanden. All in One Vastgoedonderhoud werkt netjes, strak en volgens afspraak. Vraag een vrijblijvende offerte aan.",
    quoteKey: "vloerwerk",
  },
  {
    slug: "renovatie-onderhoud",
    category: "onderhoud",
    href: "/diensten/renovatie-onderhoud",
    title: "Renovatie en totaalonderhoud",
    shortTitle: "Renovatie",
    icon: "hardhat",
    image: "/images/services/renovatie-onderhoud.jpg",
    imageAlt: "Renovatie en onderhoud van een woning door All in One Vastgoedonderhoud",
    tagline: "Eén partner voor het complete onderhoud van uw pand.",
    summary:
      "Renovatie en totaalonderhoud van woningen en bedrijfspanden. Van periodiek onderhoud tot een complete opknapbeurt: één aanspreekpunt, één planning, één strak eindresultaat.",
    intro:
      "Wilt u uw pand in één keer goed laten aanpakken, of het onderhoud structureel uit handen geven? Wij combineren reiniging, schilderwerk, houtrotherstel, vloerwerk en diverse onderhoudswerkzaamheden tot één plan. U heeft één aanspreekpunt, één planning en één partij die verantwoordelijk is voor het eindresultaat. Voor particulieren, bedrijven, verhuurders en VvE's.",
    benefits: [
      "Eén aanspreekpunt voor alle werkzaamheden",
      "Renovatie, herstel en periodiek onderhoud",
      "Professioneel, veilig en met oog voor detail",
      "Eerlijk advies, snelle service en duidelijke communicatie",
    ],
    suitableFor: ["Woningen en appartementen", "Bedrijfspanden en winkels", "Verhuurders en VvE's", "Meerjarig onderhoud"],
    seoTitle: "Renovatie en totaalonderhoud Enschede | All in One Vastgoedonderhoud",
    seoDescription:
      "Renovatie en totaalonderhoud van woningen en bedrijfspanden in Enschede en heel Overijssel. Reiniging, schilderwerk, houtrotherstel en vloerwerk door één partij. Vraag een vrijblijvende offerte aan.",
    quoteKey: "renovatie",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceByQuoteKey(key: string): Service | undefined {
  return services.find((s) => s.quoteKey === key);
}
