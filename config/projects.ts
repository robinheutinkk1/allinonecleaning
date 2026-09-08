/**
 * Before/after-projecten (statische fallback).
 *
 * Zodra Supabase is gekoppeld en de tabel `projects` gevuld is, worden de
 * projecten uit de database gebruikt (zie lib/projects.ts). Tot die tijd
 * — of als Supabase niet bereikbaar is — worden onderstaande projecten getoond.
 *
 * De drie projecten hieronder zijn gebaseerd op de aangeleverde before/after-
 * foto's (allemaal dakpanreiniging). Plaats de echte foto's op de
 * aangegeven paden in /public en werk `location` bij zodra bekend.
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
    id: "static-1",
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
    afterAlt: "Na: schone dakpannen met de oorspronkelijke kleur weer zichtbaar",
    featured: true,
    sortOrder: 1,
    published: true,
  },
  {
    id: "static-2",
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
    beforeAlt: "Voor: donker, vervuild pannendak van een vrijstaande woning",
    afterAlt: "Na: schoon oranje pannendak van dezelfde woning",
    featured: true,
    sortOrder: 2,
    published: true,
  },
  {
    id: "static-3",
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
    beforeAlt: "Voor: pannendak van een bedrijfspand met groene aanslag",
    afterAlt: "Na: schoon pannendak van hetzelfde bedrijfspand",
    featured: false,
    sortOrder: 3,
    published: true,
  },
];
