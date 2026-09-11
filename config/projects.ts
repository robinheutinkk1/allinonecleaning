/**
 * Before/after-projecten (statische demo-inhoud).
 *
 * NOVA Onderhoud is een fictief bedrijf: de projecten hieronder zijn voorbeeldprojecten
 * met geïllustreerde beelden. Zodra de database gevuld is (tabel `projects`), worden
 * die projecten gebruikt (zie lib/projects.ts).
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
    id: "demo-project-01",
    slug: "gevelreiniging-vrijstaande-woning",
    title: "Gevelreiniging vrijstaande woning",
    service: "gevelreiniging",
    serviceLabel: "Gevelreiniging",
    location: "Hengelo",
    description: "Vervuilde gevel met aanslag en verkleuring, vooral aan de schaduwzijde en rond de kozijnen.",
    result: "Een schone en frisse gevel met een verzorgde uitstraling.",
    beforeImage: "/images/projects/gevelreiniging-voor.jpg",
    afterImage: "/images/projects/gevelreiniging-na.jpg",
    beforeAlt: "Voor: vervuilde gevel met aanslag",
    afterAlt: "Na: schone gevel met verzorgde uitstraling",
    featured: true,
    sortOrder: 1,
    published: true,
  },
  {
    id: "demo-project-02",
    slug: "dakreiniging-twee-onder-een-kap",
    title: "Dakreiniging twee-onder-een-kapwoning",
    service: "dakreiniging",
    serviceLabel: "Dakreiniging",
    location: "Borne",
    description: "Dakpannen met mos en groene aanslag; de oorspronkelijke kleur was nauwelijks nog zichtbaar.",
    result: "Gereinigde dakpannen met een frisse uitstraling.",
    beforeImage: "/images/projects/dakreiniging-voor.jpg",
    afterImage: "/images/projects/dakreiniging-na.jpg",
    beforeAlt: "Voor: dakpannen met mos en groene aanslag",
    afterAlt: "Na: gereinigde dakpannen",
    featured: true,
    sortOrder: 2,
    published: true,
  },
  {
    id: "demo-project-03",
    slug: "terrasreiniging-achtertuin",
    title: "Terrasreiniging achtertuin",
    service: "terras-en-bestrating",
    serviceLabel: "Terras en bestrating",
    location: "Oldenzaal",
    description: "Vervuilde bestrating met groene aanslag tussen de tegels en een glad oppervlak bij nat weer.",
    result: "Schone en verzorgde bestrating, weer veilig beloopbaar.",
    beforeImage: "/images/projects/terras-voor.jpg",
    afterImage: "/images/projects/terras-na.jpg",
    beforeAlt: "Voor: vervuilde bestrating met groene aanslag",
    afterAlt: "Na: schone en verzorgde bestrating",
    featured: true,
    sortOrder: 3,
    published: true,
  },
  {
    id: "demo-project-04",
    slug: "buitenschilderwerk-jaren-dertig-woning",
    title: "Buitenschilderwerk jaren-dertigwoning",
    service: "schilderwerk",
    serviceLabel: "Schilderwerk",
    location: "Enschede",
    description: "Verweerde kozijnen en boeidelen met bladderende verf en een paar beginnende houtrotplekken.",
    result: "Hersteld hout en strak geschilderde kozijnen in een frisse kleur.",
    beforeImage: "/images/projects/schilderwerk-voor.jpg",
    afterImage: "/images/projects/schilderwerk-na.jpg",
    beforeAlt: "Voor: verweerde kozijnen met bladderende verf",
    afterAlt: "Na: strak geschilderde kozijnen",
    featured: false,
    sortOrder: 4,
    published: true,
  },
];
