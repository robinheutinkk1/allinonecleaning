/**
 * Voorbeeldgegevens voor de TagPoint Demo-beheeromgeving (/beheer).
 *
 * Alles hier is fictief en wordt nergens opgeslagen. De omgeving laat zien hoe een
 * klant zijn website, diensten, projecten, reviews en aanvragen zou beheren.
 */
import { services } from "@/config/services";
import { fallbackProjects } from "@/config/projects";
import { reviews } from "@/config/reviews";
import { siteConfig } from "@/config/site";

export const demoStats = [
  { key: "visitors", label: "Bezoekers deze maand", value: "1.284", delta: "+12% t.o.v. vorige maand", tone: "accent" as const },
  { key: "requests", label: "Offerte-aanvragen", value: "37", delta: "+5 deze week" },
  { key: "conversion", label: "Conversieratio", value: "2,9%", delta: "+0,4 punt" },
  { key: "calls", label: "Telefoontjes", value: "18", delta: "via de belknop" },
];

/** Bezoekers per dag, laatste 14 dagen (voor de kleine grafiek op het dashboard). */
export const demoVisitorsSeries = [28, 34, 41, 39, 52, 47, 44, 58, 61, 49, 55, 63, 70, 66];

export type DemoRequestStatus = "Nieuw" | "In behandeling" | "Offerte verstuurd" | "Afgerond";
export const demoRequestStatuses: DemoRequestStatus[] = ["Nieuw", "In behandeling", "Offerte verstuurd", "Afgerond"];

export type DemoRequest = {
  id: string;
  number: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  receivedAt: string;
  status: DemoRequestStatus;
  photos: number;
  message: string;
  property: string;
};

export const demoRequests: DemoRequest[] = [
  { id: "r1", number: "NOVA-2026-0037", name: "Jan de Vries", email: "jan.devries@voorbeeld.nl", phone: "06 11 22 33 44", service: "Gevelreiniging", location: "Hengelo", receivedAt: "Vandaag 14:32", status: "Nieuw", photos: 3, message: "Groene aanslag op de noordgevel, vooral rond de kozijnen. Graag een indicatie van de kosten.", property: "Vrijstaande woning" },
  { id: "r2", number: "NOVA-2026-0036", name: "Petra Bakker", email: "p.bakker@voorbeeld.nl", phone: "06 22 33 44 55", service: "Dakreiniging", location: "Borne", receivedAt: "Vandaag 09:15", status: "Nieuw", photos: 2, message: "Veel mos op het dak aan de achterzijde. Kan dit voor de zomer?", property: "Twee-onder-een-kap" },
  { id: "r3", number: "NOVA-2026-0035", name: "VvE De Linde", email: "bestuur@vvedelinde.nl", phone: "074 123 45 67", service: "Schilderwerk", location: "Enschede", receivedAt: "Gisteren 16:48", status: "In behandeling", photos: 6, message: "Buitenschilderwerk van 12 appartementen, kozijnen en boeidelen. Graag een afspraak voor een opname.", property: "Appartementencomplex" },
  { id: "r4", number: "NOVA-2026-0034", name: "Sander Meijer", email: "sander@voorbeeld.nl", phone: "06 33 44 55 66", service: "Zonnepanelen reinigen", location: "Oldenzaal", receivedAt: "Gisteren 11:20", status: "In behandeling", photos: 1, message: "18 panelen op een schuin dak, opbrengst loopt terug.", property: "Rijtjeswoning" },
  { id: "r5", number: "NOVA-2026-0033", name: "Bouwbedrijf Hoogland", email: "info@hoogland-bouw.nl", phone: "0546 98 76 54", service: "Renovatie", location: "Almelo", receivedAt: "2 dagen geleden", status: "Offerte verstuurd", photos: 8, message: "Gevel en kozijnen van ons kantoorpand opknappen, incl. houtrotherstel.", property: "Bedrijfspand" },
  { id: "r6", number: "NOVA-2026-0032", name: "Familie Oude Vrielink", email: "oudevrielink@voorbeeld.nl", phone: "06 44 55 66 77", service: "Terras en bestrating", location: "Hengelo", receivedAt: "3 dagen geleden", status: "Offerte verstuurd", photos: 4, message: "Terras van 40 m2 en oprit, groene aanslag en onkruid tussen de tegels.", property: "Vrijstaande woning" },
  { id: "r7", number: "NOVA-2026-0031", name: "Marloes Jansen", email: "marloes.j@voorbeeld.nl", phone: "06 55 66 77 88", service: "Houtrotherstel", location: "Enschede", receivedAt: "4 dagen geleden", status: "Afgerond", photos: 2, message: "Onderdorpel van de voordeur en twee raamkozijnen.", property: "Jaren-dertigwoning" },
  { id: "r8", number: "NOVA-2026-0030", name: "Kinderopvang De Vlinder", email: "beheer@devlinder.nl", phone: "053 456 78 90", service: "Periodiek onderhoud", location: "Borne", receivedAt: "Vorige week", status: "Afgerond", photos: 0, message: "Jaarlijks onderhoudscontract voor gevel, dakgoten en schilderwerk.", property: "Bedrijfspand" },
];

export type DemoServiceRow = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: "Actief" | "Concept";
  order: number;
};

export const demoServices: DemoServiceRow[] = services.map((s, i) => ({
  id: s.slug,
  name: s.title,
  description: s.summary,
  image: s.image,
  status: "Actief",
  order: i + 1,
}));

export type DemoProjectRow = {
  id: string;
  title: string;
  category: string;
  location: string;
  status: "Gepubliceerd" | "Concept";
  beforeImage: string;
  afterImage: string;
  description: string;
  result: string;
};

export const demoProjects: DemoProjectRow[] = [
  ...fallbackProjects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.serviceLabel,
    location: p.location,
    status: "Gepubliceerd" as const,
    beforeImage: p.beforeImage,
    afterImage: p.afterImage,
    description: p.description,
    result: p.result,
  })),
  {
    id: "demo-project-05",
    title: "Zonnepanelen bedrijfshal",
    category: "Zonnepanelen reinigen",
    location: "Almelo",
    status: "Concept",
    beforeImage: "/images/projects/dakreiniging-voor.jpg",
    afterImage: "/images/projects/dakreiniging-na.jpg",
    description: "Panelen met stof, pollen en vogelpoep; opbrengst duidelijk lager dan het jaar ervoor.",
    result: "Schone panelen en een merkbaar hogere opbrengst.",
  },
];

export type DemoReviewRow = {
  id: string;
  name: string;
  place: string;
  text: string;
  rating: number;
  status: "Gepubliceerd" | "Concept";
  date: string;
};

export const demoReviews: DemoReviewRow[] = [
  ...reviews.map((r, i) => ({
    id: `review-${i + 1}`,
    name: r.author,
    place: r.location ?? "Twente",
    text: r.text,
    rating: r.rating,
    status: "Gepubliceerd" as const,
    date: r.date ?? "",
  })),
  {
    id: "review-4",
    name: "Bram K.",
    place: "Almelo",
    text: "Snel gereageerd op onze aanvraag en de zonnepanelen zien er weer als nieuw uit.",
    rating: 5,
    status: "Concept",
    date: "juli 2026",
  },
];

export type DemoMediaItem = {
  id: string;
  name: string;
  type: "Afbeelding" | "Video" | "Logo" | "Before & after";
  src: string;
  poster?: string;
  size: string;
  usedOn: string[];
};

export const demoMedia: DemoMediaItem[] = [
  { id: "m1", name: "nova-logo.png", type: "Logo", src: "/brand/nova-logo.png", size: "40 kB", usedOn: ["Navigatie", "Footer", "E-mail"] },
  { id: "m2", name: "hero.mp4", type: "Video", src: "/videos/hero.mp4", poster: "/images/hero/hero-poster.jpg", size: "1,6 MB", usedOn: ["Homepage hero"] },
  { id: "m3", name: "hero-poster.jpg", type: "Afbeelding", src: "/images/hero/hero-poster.jpg", size: "210 kB", usedOn: ["Homepage hero"] },
  { id: "m4", name: "team-aan-het-werk.jpg", type: "Afbeelding", src: "/images/over-ons/team-aan-het-werk.jpg", size: "180 kB", usedOn: ["Homepage", "Over ons"] },
  ...services.map((s, i) => ({ id: `ms${i}`, name: `${s.slug}.jpg`, type: "Afbeelding" as const, src: s.image, size: `${140 + i * 9} kB`, usedOn: ["Diensten", s.title] })),
  ...fallbackProjects.flatMap((p, i) => [
    { id: `mb${i}`, name: p.beforeImage.split("/").pop() ?? "", type: "Before & after" as const, src: p.beforeImage, size: `${150 + i * 7} kB`, usedOn: ["Ons werk", p.title] },
    { id: `ma${i}`, name: p.afterImage.split("/").pop() ?? "", type: "Before & after" as const, src: p.afterImage, size: `${145 + i * 7} kB`, usedOn: ["Ons werk", p.title] },
  ]),
];

export type DemoSettings = {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  workArea: string;
  places: string;
  primaryColor: string;
  ctaText: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  seoTitle: string;
  seoDescription: string;
};

export const demoSettings: DemoSettings = {
  companyName: siteConfig.companyName,
  tagline: siteConfig.tagline,
  phone: siteConfig.phone ?? "",
  email: siteConfig.email ?? "",
  workArea: "Twente en omgeving",
  places: siteConfig.workAreas.join(", "),
  primaryColor: "#d9a23a",
  ctaText: "Offerte aanvragen",
  instagram: "",
  facebook: "",
  linkedin: "",
  seoTitle: `${siteConfig.companyName} | ${siteConfig.tagline}`,
  seoDescription: siteConfig.description,
};

export const demoWebsite = {
  hero: {
    eyebrow: "Professioneel onderhoud",
    title: "Uw pand verdient onderhoud dat gezien mag worden.",
    text: "Van gevel en dak tot schilderwerk en renovatie. Eén professioneel team voor onderhoud dat uw woning of bedrijfspand weer laat stralen.",
    primaryCta: "Offerte aanvragen",
    secondaryCta: "Bekijk ons werk",
  },
  colors: [
    { name: "Navy", hex: "#111c30", usage: "Koppen, donkere vlakken" },
    { name: "Goud", hex: "#d9a23a", usage: "Accent, knoppen, beeldmerk" },
    { name: "Lichtgrijs", hex: "#f2f5f9", usage: "Achtergronden" },
    { name: "Wit", hex: "#ffffff", usage: "Basis" },
  ],
  pages: [
    { path: "/", label: "Home", status: "Online" },
    { path: "/diensten", label: "Diensten", status: "Online" },
    { path: "/ons-werk", label: "Ons werk", status: "Online" },
    { path: "/werkwijze", label: "Werkwijze", status: "Online" },
    { path: "/over-ons", label: "Over ons", status: "Online" },
    { path: "/contact", label: "Contact", status: "Online" },
    { path: "/offerte-aanvragen", label: "Offerte aanvragen", status: "Online" },
  ],
};

/** Recente activiteit voor het dashboard. */
export const demoActivity = [
  { when: "14:32", text: "Nieuwe offerteaanvraag van Jan de Vries (Gevelreiniging, Hengelo)." },
  { when: "11:05", text: "Review van Familie Ter H. gepubliceerd." },
  { when: "09:15", text: "Nieuwe offerteaanvraag van Petra Bakker (Dakreiniging, Borne)." },
  { when: "Gisteren", text: "Project 'Buitenschilderwerk jaren-dertigwoning' gepubliceerd op Ons werk." },
  { when: "Gisteren", text: "Hero-tekst op de homepage bijgewerkt." },
];
