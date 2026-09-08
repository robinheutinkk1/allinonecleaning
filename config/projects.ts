/**
 * Before/after-projecten (statische fallback).
 *
 * Zodra Supabase is gekoppeld en de tabel `projects` gevuld is, worden de
 * projecten uit de database gebruikt (zie lib/projects.ts). Tot die tijd
 * — of als Supabase niet bereikbaar is — worden onderstaande projecten getoond.
 *
 * De foto's zijn de aangeleverde VOOR/NA-collages, gesplitst met
 * scripts/process-photos.mjs (originelen in assets/originals/).
 * `location` staat op "Regio Enschede" totdat de echte plaats per project bekend is.
 */

export type Project = {
  id: string;
  slug: string;
  title: string;
  service: string; // service slug uit config/services.ts
  serviceLabel: string;
  location: string;
  description: string;
  result: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  featured: boolean;
  sortOrder: number;
  published: boolean;
};

export const fallbackProjects: Project[] = [
  {
    id: "static-gevel-1",
    slug: "gevelreiniging-bungalow-gele-baksteen",
    title: "Gevelreiniging – bungalow met gele baksteen",
    service: "gevelreiniging",
    serviceLabel: "Gevelreiniging",
    location: "Regio Enschede",
    description:
      "De gele gevelsteen van deze bungalow was grauw en dof geworden door jarenlange vervuiling en groene aanslag, vooral aan de schaduwzijde.",
    result: "De oorspronkelijke warme kleur van de baksteen is terug en de voegen zijn weer schoon.",
    beforeImage: "/images/projects/gevelreiniging-1-voor.jpg",
    afterImage: "/images/projects/gevelreiniging-1-na.jpg",
    beforeAlt: "Voor: grauwe, vervuilde gevel van gele baksteen bij een bungalow",
    afterAlt: "Na: schone gele bakstenen gevel van dezelfde bungalow",
    featured: true,
    sortOrder: 1,
    published: true,
  },
  {
    id: "static-dak-1",
    slug: "dakpanreiniging-woning-met-dakkapel",
    title: "Dakpanreiniging – woning met dakkapel",
    service: "dakpanreiniging",
    serviceLabel: "Dakpanreiniging",
    location: "Regio Enschede",
    description:
      "Dakpannen met een dikke laag mos, korstmos en groene aanslag. De pannen waren dof en de oorspronkelijke kleur was nauwelijks nog zichtbaar.",
    result: "Mos en aanslag verwijderd. De warme kleur van de dakpannen is weer volledig zichtbaar.",
    beforeImage: "/images/projects/dakpanreiniging-1-voor.jpg",
    afterImage: "/images/projects/dakpanreiniging-1-na.jpg",
    beforeAlt: "Voor: dakpannen bedekt met mos en groene aanslag",
    afterAlt: "Na: schone dakpannen op een woning met dakkapel",
    featured: true,
    sortOrder: 2,
    published: true,
  },
  {
    id: "static-dak-2",
    slug: "dakpanreiniging-vrijstaande-woning",
    title: "Dakpanreiniging – vrijstaande woning",
    service: "dakpanreiniging",
    serviceLabel: "Dakpanreiniging",
    location: "Regio Enschede",
    description:
      "Het dak van deze woning was door de jaren heen donker en groen geworden door mos en algen. Uitgevoerd met een hoogwerker voor veilig werken op hoogte.",
    result: "Een egaal schoon dak in de oorspronkelijke oranje kleur.",
    beforeImage: "/images/projects/dakpanreiniging-2-voor.jpg",
    afterImage: "/images/projects/dakpanreiniging-2-na.jpg",
    beforeAlt: "Voor: hoogwerker bij een woning met vervuild pannendak",
    afterAlt: "Na: schoon oranje pannendak van de vrijstaande woning",
    featured: true,
    sortOrder: 3,
    published: true,
  },
  {
    id: "static-gevel-2",
    slug: "gevelreiniging-woning-lichte-gevelsteen",
    title: "Gevelreiniging – woning met lichte gevelsteen",
    service: "gevelreiniging",
    serviceLabel: "Gevelreiniging",
    location: "Regio Enschede",
    description:
      "Lichte gevelsteen met donkere vervuiling en aanslag rond de kozijnen. De gevel is met een telescoopsteel zorgvuldig gereinigd, zonder de beplanting te beschadigen.",
    result: "De gevel is weer licht en egaal van kleur; de aanslag rond de ramen is verdwenen.",
    beforeImage: "/images/projects/gevelreiniging-2-voor.jpg",
    afterImage: "/images/projects/gevelreiniging-2-na.jpg",
    beforeAlt: "Voor: lichte gevelsteen met donkere vervuiling rond de ramen",
    afterAlt: "Na: medewerker van All in One Cleaning reinigt de gevel, de steen is weer licht",
    featured: false,
    sortOrder: 4,
    published: true,
  },
  {
    id: "static-dak-3",
    slug: "dakpanreiniging-bedrijfspand",
    title: "Dakpanreiniging – bedrijfspand",
    service: "dakpanreiniging",
    serviceLabel: "Dakpanreiniging",
    location: "Regio Enschede",
    description:
      "Groene aanslag en vuil op de dakvlakken van een bedrijfspand met meerdere dakdelen. Gereinigd met een hoogwerker, zonder de bedrijfsvoering te storen.",
    result: "Alle dakvlakken schoon en egaal van kleur, het pand oogt weer verzorgd.",
    beforeImage: "/images/projects/dakpanreiniging-3-voor.jpg",
    afterImage: "/images/projects/dakpanreiniging-3-na.jpg",
    beforeAlt: "Voor: pannendak van een bedrijfspand met groene aanslag en hoogwerker",
    afterAlt: "Na: schoon pannendak van hetzelfde bedrijfspand",
    featured: false,
    sortOrder: 5,
    published: true,
  },
  {
    id: "static-dak-4",
    slug: "dakpanreiniging-woningen-met-puntgevel",
    title: "Dakpanreiniging – woningen met puntgevel",
    service: "dakpanreiniging",
    serviceLabel: "Dakpanreiniging",
    location: "Regio Enschede",
    description:
      "Meerdere aansluitende dakvlakken met donkere vervuiling en mos. De pannen zijn vlak voor vlak gereinigd met een hoogwerker.",
    result: "Alle dakvlakken weer helder oranje; het verschil met de omliggende daken is duidelijk zichtbaar.",
    beforeImage: "/images/projects/dakpanreiniging-4-voor.jpg",
    afterImage: "/images/projects/dakpanreiniging-4-na.jpg",
    beforeAlt: "Voor: donkere, vervuilde pannendaken met hoogwerker",
    afterAlt: "Na: schone oranje pannendaken van dezelfde woningen",
    featured: false,
    sortOrder: 6,
    published: true,
  },
];
