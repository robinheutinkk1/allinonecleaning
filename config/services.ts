/**
 * Diensten van NOVA Onderhoud (fictief demobedrijf).
 *
 * Voeg hier een dienst toe of verwijder er een: de dienstenpagina, homepage,
 * offertewizard, sitemap en structured data volgen automatisch.
 */

export type ServiceSlug =
  | "gevelreiniging"
  | "dakreiniging"
  | "zonnepanelen-reinigen"
  | "terras-en-bestrating"
  | "schilderwerk"
  | "houtrotherstel"
  | "periodiek-onderhoud"
  | "renovatie";

/** Reiniging (gevel, dak, panelen, bestrating) of onderhoud (schilderwerk, herstel, renovatie). */
export type ServiceCategory = "reiniging" | "onderhoud";

export type Service = {
  slug: ServiceSlug;
  category: ServiceCategory;
  href: string;
  title: string;
  shortTitle: string;
  /** Icoonnaam (zie components/ui/ServiceIcon.tsx) */
  icon: "building" | "home" | "layers" | "sun" | "grid" | "paintbrush" | "hammer" | "ruler" | "hardhat" | "calendar";
  image: string;
  imageAlt: string;
  /** Eén zin voor kaarten */
  tagline: string;
  /** Korte omschrijving voor kaarten en overzichten */
  summary: string;
  /** Langere intro voor de dienstpagina */
  intro: string;
  benefits: string[];
  suitableFor: string[];
  seoTitle: string;
  seoDescription: string;
  /** Sleutel die de offertewizard gebruikt */
  quoteKey: string;
};

export const services: Service[] = [
  {
    slug: "gevelreiniging",
    category: "reiniging",
    href: "/diensten/gevelreiniging",
    title: "Gevelreiniging",
    shortTitle: "Gevel",
    icon: "building",
    image: "/images/services/gevelreiniging.jpg",
    imageAlt: "Illustratie van een schone bakstenen gevel met witte kozijnen",
    tagline: "Een gevel die weer fris en verzorgd oogt.",
    summary:
      "Verwijder vuil, aanslag en atmosferische vervuiling met een reinigingsmethode die past bij het oppervlak. Metselwerk, gevelsteen en beplating krijgen hun oorspronkelijke kleur terug.",
    intro:
      "De gevel bepaalt de eerste indruk van een woning of bedrijfspand. Weer, verkeer en vocht laten in de loop van de jaren een laag vuil, algen en groene aanslag achter die het pand ouder laat lijken dan het is. Wij beoordelen eerst het materiaal en de vervuiling, en kiezen daarna de methode: gecontroleerde druk, milieubewuste middelen en de juiste apparatuur. Het resultaat is een schone gevel zonder beschadigde voegen of stenen.",
    benefits: [
      "Methode afgestemd op metselwerk, gevelsteen of beplating",
      "Voegen en oppervlak blijven intact",
      "Verwijdert algen, groene aanslag, vuil en verkleuring",
      "Nacontrole samen met u",
    ],
    suitableFor: ["Woningen en appartementen", "Bedrijfspanden en winkels", "VvE's en verhuurders", "Metselwerk, gevelsteen en beplating"],
    seoTitle: "Gevelreiniging in Twente | NOVA Onderhoud",
    seoDescription:
      "Gevelreiniging voor woningen en bedrijfspanden in Twente. NOVA Onderhoud verwijdert vuil, algen en aanslag met een methode die past bij uw gevel. Vraag eenvoudig een offerte aan.",
    quoteKey: "gevel",
  },
  {
    slug: "dakreiniging",
    category: "reiniging",
    href: "/diensten/dakreiniging",
    title: "Dakreiniging",
    shortTitle: "Dak",
    icon: "home",
    image: "/images/services/dakreiniging.jpg",
    imageAlt: "Illustratie van een schoon pannendak met dakkapel",
    tagline: "Mos en aanslag weg, de kleur van uw dak terug.",
    summary:
      "Mos, algen en aanslag houden vocht vast en maken dakpannen dof. Wij reinigen het dak zorgvuldig en veilig, zodat de pannen weer hun eigen kleur laten zien en langer meegaan.",
    intro:
      "Op een dak hecht zich in de loop van de jaren mos, korstmos en groene aanslag. Dat ziet er slordig uit, maar houdt ook vocht vast en versnelt slijtage. Wij reinigen dakpannen met gecontroleerde druk en passende middelen, werken veilig op hoogte en nemen de dakgoten desgewenst direct mee. Na afloop is de oorspronkelijke kleur van de pannen weer zichtbaar.",
    benefits: [
      "Mos, korstmos en aanslag grondig verwijderd",
      "Veilig werken op hoogte met de juiste apparatuur",
      "Dakgoten in dezelfde werkgang schoon",
      "Langere levensduur van uw dakbedekking",
    ],
    suitableFor: ["Woningen met pannendak", "Bedrijfspanden en loodsen", "Bijgebouwen en garages", "Dakgoten en dakranden"],
    seoTitle: "Dakreiniging in Twente | NOVA Onderhoud",
    seoDescription:
      "Dakreiniging in Twente: mos, algen en aanslag van uw dakpannen verwijderd, veilig en zonder schade. NOVA Onderhoud werkt voor particulieren en bedrijven. Vraag een offerte aan.",
    quoteKey: "dak",
  },
  {
    slug: "zonnepanelen-reinigen",
    category: "reiniging",
    href: "/diensten/zonnepanelen-reinigen",
    title: "Zonnepanelen reinigen",
    shortTitle: "Zonnepanelen",
    icon: "sun",
    image: "/images/services/zonnepanelen-reinigen.jpg",
    imageAlt: "Illustratie van schone zonnepanelen op een dak",
    tagline: "Schone panelen, meer opbrengst.",
    summary:
      "Stof, pollen, vogelpoep en aanslag verlagen de opbrengst van zonnepanelen. Wij reinigen ze streeploos en zonder krassen, zodat ze weer optimaal presteren.",
    intro:
      "Zonnepanelen die vuil zijn, leveren merkbaar minder op. Regen spoelt lang niet alles weg: pollen, roet, vogelpoep en een film van aanslag blijven achter. Wij reinigen de panelen met zacht water en zonder agressieve middelen, zodat het glas en de coating onbeschadigd blijven. Het resultaat is direct meetbaar in de opbrengst.",
    benefits: [
      "Streeploos schoon met osmosewater",
      "Geen krassen, geen schade aan coating of frames",
      "Merkbaar hogere opbrengst na reiniging",
      "Ook voor grotere installaties op bedrijfsdaken",
    ],
    suitableFor: ["Panelen op schuine daken", "Panelen op platte daken", "Bedrijfsinstallaties", "Veldopstellingen"],
    seoTitle: "Zonnepanelen reinigen in Twente | NOVA Onderhoud",
    seoDescription:
      "Laat uw zonnepanelen streeploos reinigen door NOVA Onderhoud in Twente. Zonder krassen, met meetbaar meer opbrengst. Voor woningen en bedrijven. Vraag een offerte aan.",
    quoteKey: "zonnepanelen",
  },
  {
    slug: "terras-en-bestrating",
    category: "reiniging",
    href: "/diensten/terras-en-bestrating",
    title: "Terras en bestrating",
    shortTitle: "Bestrating",
    icon: "grid",
    image: "/images/services/terras-en-bestrating.jpg",
    imageAlt: "Illustratie van een schoon terras met tuin",
    tagline: "Terras, oprit en tuinpad weer schoon en veilig.",
    summary:
      "Groene aanslag en mos maken bestrating glad en dof. Wij reinigen terrassen, opritten en paden grondig, zonder de voegen uit te spoelen.",
    intro:
      "Op terrassen, opritten en tuinpaden ontstaat door vocht en schaduw al snel groene aanslag, mos en algen. Dat ziet er verwaarloosd uit en is glad bij nat weer. Wij reinigen de bestrating met een methode die past bij het materiaal, zodat het voegzand op zijn plek blijft en het oppervlak van de stenen niet wordt aangetast. Desgewenst voegen we opnieuw in.",
    benefits: [
      "Groene aanslag, mos en algen verwijderd",
      "Voegzand blijft op zijn plek",
      "Minder glad, veiliger bij nat weer",
      "Geschikt voor klinkers, tegels en natuursteen",
    ],
    suitableFor: ["Terrassen en tuinpaden", "Opritten", "Parkeerplaatsen en bedrijfsterreinen", "Natuursteen en keramische tegels"],
    seoTitle: "Terras en bestrating reinigen in Twente | NOVA Onderhoud",
    seoDescription:
      "Terras, oprit of tuinpad laten reinigen in Twente. NOVA Onderhoud verwijdert groene aanslag en mos zonder de voegen uit te spoelen. Vraag een offerte aan.",
    quoteKey: "bestrating",
  },
  {
    slug: "schilderwerk",
    category: "onderhoud",
    href: "/diensten/schilderwerk",
    title: "Schilderwerk",
    shortTitle: "Schilderwerk",
    icon: "paintbrush",
    image: "/images/services/schilderwerk.jpg",
    imageAlt: "Illustratie van vers geschilderde kozijnen aan een woning",
    tagline: "Strak schilderwerk, binnen en buiten.",
    summary:
      "Buitenschilderwerk beschermt uw pand tegen weer en wind, binnenschilderwerk geeft ruimtes een frisse uitstraling. Zorgvuldig voorbereid, strak afgewerkt.",
    intro:
      "Goed schilderwerk begint bij de ondergrond. We reinigen, schuren, herstellen en gronden voordat er een laklaag op gaat, zodat het resultaat lang mooi blijft. Buiten schilderen we kozijnen, deuren, boeidelen en gevelbetimmering; binnen wanden, plafonds, kozijnen en trappen. We adviseren over kleur en verfsysteem en werken netjes en volgens planning.",
    benefits: [
      "Binnen- en buitenschilderwerk door één team",
      "Zorgvuldige voorbereiding van de ondergrond",
      "Advies over kleur, verfsysteem en onderhoudsinterval",
      "Strak eindresultaat dat jaren meegaat",
    ],
    suitableFor: ["Kozijnen, deuren en boeidelen", "Wanden en plafonds", "Woningen en appartementen", "Bedrijfspanden en VvE's"],
    seoTitle: "Schilderwerk binnen en buiten in Twente | NOVA Onderhoud",
    seoDescription:
      "Schilderwerk binnen en buiten in Twente door NOVA Onderhoud. Kozijnen, deuren, wanden en plafonds strak geschilderd met een goede voorbereiding. Vraag een offerte aan.",
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
    imageAlt: "Illustratie van een hersteld houten kozijn",
    tagline: "Houtrot aangepakt voordat het erger wordt.",
    summary:
      "Zachte plekken in kozijnen, deuren of boeidelen? Wij verwijderen het aangetaste hout, herstellen het met een duurzaam reparatiesysteem en werken het strak af.",
    intro:
      "Houtrot begint klein en breidt zich uit zolang vocht kan intrekken. Wordt het op tijd aangepakt, dan is vervangen meestal niet nodig. Wij halen het aangetaste hout weg, behandelen de plek, herstellen met een duurzaam reparatiesysteem en schilderen het geheel weer strak af. Is vervangen toch de betere keuze, dan zeggen we dat eerlijk.",
    benefits: [
      "Herstel in plaats van vervangen, waar dat verantwoord is",
      "Duurzaam reparatiesysteem, strak afgewerkt",
      "Direct gecombineerd met het schilderwerk",
      "Eerlijk advies over herstellen of vervangen",
    ],
    suitableFor: ["Kozijnen en ramen", "Deuren en posten", "Boeidelen en dakranden", "Gevelbetimmering"],
    seoTitle: "Houtrotherstel in Twente | NOVA Onderhoud",
    seoDescription:
      "Houtrot in kozijnen, deuren of boeidelen? NOVA Onderhoud herstelt aangetast hout duurzaam en werkt het strak af. Actief in Twente. Vraag een offerte aan.",
    quoteKey: "houtrot",
  },
  {
    slug: "periodiek-onderhoud",
    category: "onderhoud",
    href: "/diensten/periodiek-onderhoud",
    title: "Periodiek onderhoud",
    shortTitle: "Onderhoud",
    icon: "calendar",
    image: "/images/services/periodiek-onderhoud.jpg",
    imageAlt: "Illustratie van een verzorgd bedrijfspand",
    tagline: "Uw pand structureel in goede staat.",
    summary:
      "Een vast onderhoudsplan voor woning, verhuurpand of bedrijfspand. Wij plannen inspecties en werkzaamheden vooruit, zodat kleine gebreken geen grote reparaties worden.",
    intro:
      "Wie onderhoud vooruit plant, voorkomt verrassingen. In een onderhoudsplan leggen we vast wat wanneer nodig is: reiniging, schilderwerk, kleine reparaties en periodieke inspecties. U krijgt één aanspreekpunt, een heldere planning en een pand dat er het hele jaar verzorgd uitziet. Geschikt voor particulieren, verhuurders, bedrijven en VvE's.",
    benefits: [
      "Meerjarig onderhoudsplan op maat",
      "Eén aanspreekpunt voor alle werkzaamheden",
      "Kleine gebreken vroeg opgemerkt en verholpen",
      "Vaste planning en voorspelbare kosten",
    ],
    suitableFor: ["Verhuurders en beleggers", "VvE's en beheerders", "Bedrijfspanden", "Woningen"],
    seoTitle: "Periodiek onderhoud voor woning en bedrijf in Twente | NOVA Onderhoud",
    seoDescription:
      "Periodiek onderhoud in Twente: een vast onderhoudsplan voor woning, verhuurpand of bedrijfspand. NOVA Onderhoud regelt inspecties, reiniging en reparaties. Vraag een offerte aan.",
    quoteKey: "onderhoud",
  },
  {
    slug: "renovatie",
    category: "onderhoud",
    href: "/diensten/renovatie",
    title: "Renovatie",
    shortTitle: "Renovatie",
    icon: "hardhat",
    image: "/images/services/renovatie.jpg",
    imageAlt: "Illustratie van een gerenoveerde woning met nieuwe kozijnen",
    tagline: "Een pand dat weer helemaal bij de tijd is.",
    summary:
      "Van een opknapbeurt van de buitenzijde tot een complete renovatie van een woning of bedrijfsruimte. Eén partij, één planning, één strak eindresultaat.",
    intro:
      "Bij een renovatie komt veel samen: reiniging, herstel, schilderwerk, timmerwerk en afwerking. Wij combineren die onderdelen tot één plan en voeren het uit met vaste vakmensen. U heeft één aanspreekpunt en weet vooraf wat het kost en hoe lang het duurt. Van een verouderde buitenzijde tot een complete opknapbeurt van binnen en buiten.",
    benefits: [
      "Eén aanspreekpunt voor het hele traject",
      "Vaste planning en duidelijke begroting",
      "Vakmensen voor reiniging, herstel, timmer- en schilderwerk",
      "Strak eindresultaat, netjes opgeleverd",
    ],
    suitableFor: ["Woningen en appartementen", "Bedrijfsruimtes en winkels", "Verhuurpanden", "Buitenzijde en gevelrenovatie"],
    seoTitle: "Renovatie van woning of bedrijfspand in Twente | NOVA Onderhoud",
    seoDescription:
      "Renovatie in Twente door NOVA Onderhoud: van gevelrenovatie tot een complete opknapbeurt van woning of bedrijfsruimte. Eén partij, één planning. Vraag een offerte aan.",
    quoteKey: "renovatie",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceByQuoteKey(key: string): Service | undefined {
  return services.find((s) => s.quoteKey === key);
}
