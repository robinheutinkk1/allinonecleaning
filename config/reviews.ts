/**
 * Klantbeoordelingen.
 *
 * ALLEEN ECHTE REVIEWS. Zolang deze lijst leeg is, toont de site een
 * nette placeholder-sectie ("Google Reviews volgen binnenkort") in plaats
 * van verzonnen testimonials.
 *
 * Voorbeeld:
 * {
 *   author: "J. de Vries",
 *   rating: 5,
 *   text: "…",
 *   source: "Google",
 *   date: "2026-05",
 * }
 */
export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: "Google" | "Facebook" | "Website" | string;
  date?: string;
};

export const reviews: Review[] = [];

/** Google-beoordeling - alleen invullen met echte cijfers uit Google Business Profile. */
export const googleRating: { rating: number; count: number; url: string } | null = null;
