import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { getServiceClient } from "@/lib/supabase/server";
import { fetchGooglePlace } from "@/lib/google/places";

export type GoogleSyncResult = {
  placeName: string | null;
  rating: number | null;
  reviewCount: number | null;
  url: string | null;
  received: number;
  imported: number;
  updated: number;
  skipped: number;
  syncedAt: string;
};

/**
 * Haalt de Google-gegevens op en werkt de database bij:
 * - nieuwe reviews worden toegevoegd (gepubliceerd, niet uitgelicht);
 * - bekende reviews (zelfde Google-id) krijgen de actuele tekst en score,
 *   maar behouden gepubliceerd/uitgelicht/volgorde zoals in het dashboard ingesteld;
 * - reviews zonder tekst (alleen sterren) worden overgeslagen;
 * - gemiddelde, aantal en Google-link gaan naar site_settings.
 * Gebruikt door de knop in het dashboard en de dagelijkse cron.
 */
export async function syncGoogleReviews(): Promise<GoogleSyncResult> {
  const client = getServiceClient();
  if (!client) throw new Error("Supabase is niet geconfigureerd.");

  const place = await fetchGooglePlace();
  const ids = place.reviews.map((r) => r.id);

  const existingById = new Map<string, string>();
  if (ids.length) {
    const { data, error } = await client.from("reviews").select("id, google_review_id").in("google_review_id", ids);
    if (error) throw new Error(error.message);
    for (const row of data ?? []) if (row.google_review_id) existingById.set(row.google_review_id, row.id);
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  for (const r of place.reviews) {
    if (!r.text) {
      skipped++;
      continue;
    }
    const fields = { author: r.author, author_url: r.authorUrl, rating: r.rating, text: r.text, source: "Google", review_date: r.publishedAt };
    const existingId = existingById.get(r.id);
    if (existingId) {
      const { error } = await client.from("reviews").update(fields).eq("id", existingId);
      if (error) throw new Error(error.message);
      updated++;
    } else {
      const { error } = await client.from("reviews").insert({ ...fields, google_review_id: r.id, published: true, featured: false, sort_order: 0 });
      if (error) throw new Error(error.message);
      imported++;
    }
  }

  const syncedAt = new Date().toISOString();
  const settings: Record<string, unknown> = {
    id: 1,
    google_rating: place.rating,
    google_review_count: place.reviewCount,
    google_synced_at: syncedAt,
    google_place_name: place.name,
  };
  if (place.url) settings.google_reviews_url = place.url;
  const { error: settingsError } = await client.from("site_settings").upsert(settings as { id: number });
  if (settingsError) throw new Error(settingsError.message);

  revalidateTag("reviews", "max");
  revalidateTag("site-settings", "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin/reviews");

  return { placeName: place.name, rating: place.rating, reviewCount: place.reviewCount, url: place.url, received: place.reviews.length, imported, updated, skipped, syncedAt };
}
