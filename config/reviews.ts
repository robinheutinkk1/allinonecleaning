/**
 * Voorbeeldreviews van het fictieve demobedrijf NOVA Onderhoud.
 *
 * Dit zijn geen echte klantbeoordelingen. Ze laten zien hoe de reviewsectie eruitziet;
 * op de site staat het label "Voorbeeldreviews". Via het beheer kunnen ze worden vervangen.
 */
export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: "Google" | "Facebook" | "Website" | string;
  date?: string;
  /** Link naar het profiel van de schrijver (alleen bij gekoppelde reviewplatforms). */
  authorUrl?: string;
  /** Woonplaats, alleen voor de demo-weergave. */
  location?: string;
};

/** Label dat bij de reviews wordt getoond, zodat duidelijk is dat het demo-inhoud is. */
export const reviewsDemoLabel = "Voorbeeldreviews";

export const reviews: Review[] = [
  {
    author: "Mark V.",
    location: "Hengelo",
    rating: 5,
    text: "Vanaf het eerste contact was alles duidelijk. Het resultaat van de gevelreiniging is echt opvallend, de buren vroegen direct wie het gedaan had.",
    source: "Website",
    date: "juni 2026",
  },
  {
    author: "Sandra de G.",
    location: "Borne",
    rating: 5,
    text: "Het dak zag er na jaren weer uit als nieuw. Netjes gewerkt, alles opgeruimd en de planning is precies nagekomen.",
    source: "Website",
    date: "mei 2026",
  },
  {
    author: "Familie Ter H.",
    location: "Oldenzaal",
    rating: 4,
    text: "Schilderwerk en houtrotherstel in één keer geregeld. Prettig dat er eerlijk werd geadviseerd over wat wel en niet nodig was.",
    source: "Website",
    date: "april 2026",
  },
];

/** Google-beoordeling: niet gebruikt in de demo. */
export const googleRating: { rating: number; count: number; url: string } | null = null;
