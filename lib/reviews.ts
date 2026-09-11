import "server-only";
import { unstable_cache } from "next/cache";
import { reviews as configReviews, type Review } from "@/config/reviews";
import { demoConfig } from "@/config/site";
import { getAnonServerClient } from "@/lib/supabase/server";

/**
 * Reviews voor de site. Demo: de voorbeeldreviews uit config/reviews.ts.
 * Met DEMO_USE_DATABASE_CONTENT=true komen gepubliceerde reviews uit de database.
 */
async function loadReviews(): Promise<Review[]> {
  const client = demoConfig.useDatabaseContent ? getAnonServerClient() : null;
  if (!client) return configReviews;
  try {
    const { data, error } = await client
      .from("reviews")
      .select("author, author_url, rating, text, source, review_date, featured, sort_order")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(12);
    if (error || !data || data.length === 0) return configReviews;
    return data.map((r) => ({
      author: r.author,
      rating: Math.min(5, Math.max(1, r.rating)) as Review["rating"],
      text: r.text,
      source: r.source,
      date: r.review_date ? new Date(r.review_date).toLocaleDateString("nl-NL", { month: "long", year: "numeric" }) : undefined,
      authorUrl: r.author_url ?? undefined,
    }));
  } catch {
    return configReviews;
  }
}

export const getReviews = unstable_cache(loadReviews, ["reviews"], { tags: ["reviews"], revalidate: 3600 });
