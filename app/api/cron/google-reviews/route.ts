import { isGooglePlacesConfigured } from "@/lib/google/places";
import { syncGoogleReviews } from "@/lib/google/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/google-reviews: dagelijkse verversing van de Google-reviews.
 * Wordt aangeroepen door Vercel Cron (zie vercel.json) met de header
 * `Authorization: Bearer <CRON_SECRET>`. Zonder geldig secret: 401.
 */
export async function GET(request: Request) {
  const secret = (process.env.CRON_SECRET ?? "").trim();
  if (!secret) return Response.json({ ok: false, error: "CRON_SECRET ontbreekt in de omgeving." }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ ok: false, error: "Geen toegang." }, { status: 401 });

  if (!isGooglePlacesConfigured()) return Response.json({ ok: false, error: "GOOGLE_PLACES_API_KEY of GOOGLE_PLACE_ID ontbreekt." }, { status: 503 });

  try {
    const result = await syncGoogleReviews();
    console.info("[google-reviews] verversing geslaagd:", result);
    return Response.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Onbekende fout";
    console.error("[google-reviews] verversing mislukt:", message);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
