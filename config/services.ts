/**
 * Diensten van All in One Cleaning.
 *
 * Bron: de belettering op de bedrijfsbus
 * ("Gevelreiniging · Dakpanreiniging · Trespa · Zonnepanelen") en de
 * aangeleverde before/after-foto's (dakpanreiniging).
 *
 * Voeg hier een dienst toe of verwijder er een — de dienstenpagina,
 * homepage, offertewizard, sitemap en structured data volgen automatisch.
 */

export type ServiceSlug = "gevelreiniging" | "dakpanreiniging" | "trespa-reiniging" | "zonnepanelen-reiniging";

export type Service = {
  slug: ServiceSlug;
  /** Pagina-URL. Gevelreiniging heeft een eigen pillar-pagina. */
  href: string;
  title: string;
  shortTitle: string;
  /** Icoonnaam uit lucide-react (zie components/ui/ServiceIcon.tsx) */
  icon: "building" | "home" | "layers" | "sun";
  image: string;
  imageAlt: string;
  /** Eén zin voor kaarten */
  tagline: string;
  /** Korte omschrijving voor kaarten en overzichten */
  summary: string;
  /** Langere intro voor de dienstpagina */
  intro: string;
  /** Voordelen — feitelijk en zonder technische beloften */
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
    imageAlt: "Gevelreiniging van een woning in Enschede door All in One Cleaning",
    tagline: "Een gevel die weer gezien mag worden.",
    summary:
      "Vervuiling, groene aanslag en verkleuring maken een gevel dof. Wij reinigen metselwerk en gevels zodat uw pand weer een verzorgde uitstraling heeft.",
    intro:
      "De gevel is het eerste wat bezoekers van uw woning of bedrijfspand zien. Door weersinvloeden, verkeer en vocht ontstaat er na verloop van tijd een laag vuil, algen en groene aanslag. Wij beoordelen uw gevel en kiezen een reinigingsmethode die past bij het materiaal en de vervuiling.",
    benefits: [
      "Verzorgde eerste indruk van uw pand",
      "Reinigingsmethode afgestemd op het geveltype",
      "Beoordeling vooraf op basis van uw foto's",
      "Duidelijke offerte, geen verrassingen",
    ],
    suitableFor: ["Woningen", "Bedrijfspanden", "Appartementencomplexen en VvE's", "Metselwerk en gevelsteen"],
    seoTitle: "Gevelreiniging Enschede | All in One Cleaning – Uw gevelspecialist",
    seoDescription:
      "Gevelreiniging in Enschede en omgeving. All in One Cleaning verwijdert vuil, algen en groene aanslag van uw gevel. Vraag gratis een offerte aan en stuur foto's mee.",
    quoteKey: "gevel",
  },
  {
    slug: "dakpanreiniging",
    href: "/diensten/dakpanreiniging",
    title: "Dakpanreiniging",
    shortTitle: "Dakpannen",
    icon: "home",
    image: "/images/services/dakpanreiniging.jpg",
    imageAlt: "Dakpanreiniging: dakpannen voor en na reiniging door All in One Cleaning",
    tagline: "Mos en aanslag van uw dak, de kleur van uw pannen terug.",
    summary:
      "Mos, algen en aanslag op dakpannen houden vocht vast en doen afbreuk aan de uitstraling van uw woning. Wij reinigen uw dakpannen zorgvuldig.",
    intro:
      "Op dakpannen hecht zich in de loop der jaren mos, groene aanslag en vuil. Dat ziet er niet alleen slordig uit, maar houdt ook vocht vast. Na reiniging is de oorspronkelijke kleur van de dakpannen weer zichtbaar — bekijk het verschil op onze before & after-pagina.",
    benefits: [
      "Mos en aanslag verwijderd",
      "Oorspronkelijke kleur van de dakpannen weer zichtbaar",
      "Werken op hoogte met passend materieel",
      "Beoordeling vooraf aan de hand van uw foto's",
    ],
    suitableFor: ["Woningen met pannendak", "Bedrijfspanden", "Bijgebouwen en garages"],
    seoTitle: "Dakpanreiniging Enschede | Mos en aanslag verwijderen – All in One Cleaning",
    seoDescription:
      "Dakpannen reinigen in Enschede en omgeving. All in One Cleaning verwijdert mos, algen en aanslag van uw dak. Bekijk onze before & after-resultaten en vraag een gratis offerte aan.",
    quoteKey: "dak",
  },
  {
    slug: "trespa-reiniging",
    href: "/diensten/trespa-reiniging",
    title: "Trespa reiniging",
    shortTitle: "Trespa",
    icon: "layers",
    image: "/images/services/trespa-reiniging.jpg",
    imageAlt: "Reiniging van trespa gevelbekleding door All in One Cleaning",
    tagline: "Gevelbekleding weer strak en fris.",
    summary:
      "Trespa en andere gevelbeplating worden dof en vlekkerig door vuil en weersinvloeden. Wij reinigen de beplating zonder het materiaal te beschadigen.",
    intro:
      "Trespa en vergelijkbare HPL-gevelbekleding zijn onderhoudsarm, maar niet onderhoudsvrij. Vuil, aanslag en strepen maken de platen dof. Met een geschikte, materiaalvriendelijke reiniging krijgt de bekleding zijn frisse uitstraling terug.",
    benefits: [
      "Materiaalvriendelijke reiniging van gevelbeplating",
      "Strepen, aanslag en vuil verwijderd",
      "Geschikt voor woningen en bedrijfspanden",
      "Duidelijke offerte vooraf",
    ],
    suitableFor: ["Trespa en HPL-beplating", "Dakranden en boeidelen", "Bedrijfspanden en scholen"],
    seoTitle: "Trespa reinigen Enschede | Gevelbekleding schoonmaken – All in One Cleaning",
    seoDescription:
      "Trespa en gevelbeplating reinigen in Enschede en omgeving. All in One Cleaning maakt uw gevelbekleding weer strak en fris. Gratis offerte, stuur eenvoudig foto's mee.",
    quoteKey: "trespa",
  },
  {
    slug: "zonnepanelen-reiniging",
    href: "/diensten/zonnepanelen-reiniging",
    title: "Zonnepanelen reiniging",
    shortTitle: "Zonnepanelen",
    icon: "sun",
    image: "/images/services/zonnepanelen-reiniging.jpg",
    imageAlt: "Reiniging van zonnepanelen op een dak door All in One Cleaning",
    tagline: "Schone panelen, vrij van vuil en aanslag.",
    summary:
      "Stof, vogelpoep, pollen en aanslag hopen zich op zonnepanelen op. Wij reinigen uw panelen zorgvuldig met geschikte middelen en materialen.",
    intro:
      "Zonnepanelen liggen dag en nacht buiten en vangen stof, pollen, vogelpoep en aanslag op. Wij reinigen de panelen zorgvuldig, zodat het glas weer schoon is en het oppervlak vrij is van vuil.",
    benefits: [
      "Zorgvuldige reiniging van het paneeloppervlak",
      "Geschikte middelen en materialen voor zonnepanelen",
      "Werken op hoogte met passend materieel",
      "Te combineren met dakpanreiniging",
    ],
    suitableFor: ["Woningen", "Bedrijfsdaken", "Panelen op schuine en platte daken"],
    seoTitle: "Zonnepanelen reinigen Enschede | All in One Cleaning",
    seoDescription:
      "Zonnepanelen laten reinigen in Enschede en omgeving. All in One Cleaning verwijdert vuil en aanslag van uw panelen. Vraag vrijblijvend een offerte aan.",
    quoteKey: "zonnepanelen",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceByQuoteKey(key: string): Service | undefined {
  return services.find((s) => s.quoteKey === key);
}
