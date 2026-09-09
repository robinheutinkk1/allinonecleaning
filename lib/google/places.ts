import "server-only";

/**
 * Google Places API (New): beoordeling, aantal reviews en de (maximaal 5)
 * reviews die Google vrijgeeft voor één bedrijfsprofiel.
 *
 * Vereist in de omgeving:
 *   GOOGLE_PLACES_API_KEY  API-sleutel, beperkt tot de Places API (New)
 *   GOOGLE_PLACE_ID        Place ID van het bedrijf (begint met ChIJ)
 *
 * Voorwaarden van Google waar deze code rekening mee houdt:
 * - naam van de schrijver en link naar het Google-profiel worden meegenomen;
 * - gegevens mogen maximaal 30 dagen bewaard worden zonder verversing,
 *   vandaar de dagelijkse cron (zie app/api/cron/google-reviews).
 */

const ENDPOINT = "https://places.googleapis.com/v1/places";

export type GoogleReview = {
  /** Vaste id van Google (resource name), bijv. places/ChIJ…/reviews/… */
  id: string;
  author: string;
  authorUrl: string | null;
  rating: number;
  text: string;
  /** YYYY-MM-DD */
  publishedAt: string | null;
};

export type GooglePlace = {
  id: string;
  name: string | null;
  rating: number | null;
  reviewCount: number | null;
  url: string | null;
  reviews: GoogleReview[];
};

export function googlePlacesConfig(): { key: string; placeId: string; missing: string[] } {
  const key = (process.env.GOOGLE_PLACES_API_KEY ?? "").trim();
  const placeId = (process.env.GOOGLE_PLACE_ID ?? "").trim();
  const missing: string[] = [];
  if (!key) missing.push("GOOGLE_PLACES_API_KEY");
  if (!placeId) missing.push("GOOGLE_PLACE_ID");
  return { key, placeId, missing };
}

export function isGooglePlacesConfigured(): boolean {
  return googlePlacesConfig().missing.length === 0;
}

type RawReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string };
  publishTime?: string;
};

type RawPlace = {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: RawReview[];
};

function explain(status: number, body: unknown): string {
  const msg =
    body && typeof body === "object" && "error" in body && body.error && typeof body.error === "object" && "message" in body.error
      ? String((body.error as { message?: string }).message ?? "")
      : "";
  if (/API key not valid/i.test(msg)) return "Google keurt de API-sleutel af. Controleer GOOGLE_PLACES_API_KEY (en of de sleutel de Places API (New) mag gebruiken).";
  if (status === 403) return `Google weigert de sleutel (403). Controleer of de Places API (New) is ingeschakeld en de sleutel niet te strikt is beperkt. ${msg}`.trim();
  if (status === 404) return "Google kent deze Place ID niet (404). Controleer GOOGLE_PLACE_ID.";
  if (status === 400) return `Google accepteert het verzoek niet (400). ${msg}`.trim();
  if (status === 429) return "Google-limiet bereikt (429). Probeer het later opnieuw.";
  return `Google antwoordde met status ${status}. ${msg}`.trim();
}

async function request(fieldMask: string): Promise<RawPlace> {
  const { key, placeId, missing } = googlePlacesConfig();
  if (missing.length) throw new Error(`Google-koppeling niet ingesteld: ${missing.join(" en ")} ontbreekt.`);

  const url = `${ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=nl&regionCode=NL`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": fieldMask, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (e) {
    const reason = e instanceof Error && e.name === "TimeoutError" ? "time-out na 10 seconden" : "netwerkfout";
    throw new Error(`Google is niet bereikbaar vanaf de server (${reason}). Probeer het later opnieuw.`);
  }
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(explain(res.status, body));
  return (body ?? {}) as RawPlace;
}

/** Gratis controle (alleen het veld `id`): werkt de sleutel en bestaat de Place ID? */
export async function pingGooglePlace(): Promise<{ ok: boolean; detail: string }> {
  try {
    const place = await request("id");
    return place.id ? { ok: true, detail: "Sleutel en Place ID werken" } : { ok: false, detail: "Google gaf geen id terug" };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : "Onbekende fout" };
  }
}

/** Beoordeling, aantal en reviews ophalen. */
export async function fetchGooglePlace(): Promise<GooglePlace> {
  const raw = await request("id,displayName,rating,userRatingCount,googleMapsUri,reviews");
  const reviews: GoogleReview[] = (raw.reviews ?? [])
    .filter((r): r is RawReview & { name: string } => typeof r.name === "string" && r.name.length > 0)
    .map((r) => ({
      id: r.name,
      author: (r.authorAttribution?.displayName ?? "").trim() || "Google-gebruiker",
      authorUrl: r.authorAttribution?.uri ?? null,
      rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 0))),
      text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
      publishedAt: r.publishTime ? r.publishTime.slice(0, 10) : null,
    }));

  return {
    id: raw.id ?? googlePlacesConfig().placeId,
    name: raw.displayName?.text ?? null,
    rating: typeof raw.rating === "number" ? Math.round(raw.rating * 10) / 10 : null,
    reviewCount: typeof raw.userRatingCount === "number" ? raw.userRatingCount : null,
    url: raw.googleMapsUri ?? null,
    reviews,
  };
}
