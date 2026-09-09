import { Quote, Star } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { ReviewText } from "@/components/sections/ReviewText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Review } from "@/config/reviews";
import { getReviews } from "@/lib/reviews";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/config/site";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} van 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={i < rating ? "size-4 fill-sun-400 text-sun-400" : "size-4 text-navy-200"} aria-hidden />
      ))}
    </span>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 sm:p-6">
      <div className="flex items-center justify-between">
        <Quote className="size-5 text-gold-300" aria-hidden />
        <Stars rating={review.rating} />
      </div>
      <ReviewText text={review.text} className="mt-3 flex-1" />
      <figcaption className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
        <span className="min-w-0">
          {review.authorUrl ? (
            <a href={review.authorUrl} target="_blank" rel="noopener noreferrer nofollow" className="block truncate text-sm font-semibold text-navy-900 hover:text-gold-700">
              {review.author}
            </a>
          ) : (
            <span className="block truncate text-sm font-semibold text-navy-900">{review.author}</span>
          )}
          <span className="block text-xs text-navy-400">
            via {review.source}
            {review.date ? ` · ${review.date}` : ""}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Social proof: reviews uit het dashboard (Supabase) of config/reviews.ts.
 * Zonder echte reviews en zonder Google-score wordt de sectie niet getoond.
 */
export async function ReviewsSection() {
  const [reviews, settings] = await Promise.all([getReviews(), getSiteSettings()]);
  const googleRating = settings.googleRating;
  const trustoo = siteConfig.trustoo;
  if (reviews.length === 0 && !googleRating && !trustoo) return null;

  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Ervaringen" title="Wat klanten zeggen." description="Beoordelingen van klanten die ons voor zijn gegaan." />
          <div className="flex flex-wrap gap-3">
            {googleRating && (
              <a href={googleRating.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-2xl bg-navy-50 px-5 py-3 transition-colors hover:bg-navy-100">
                <span className="font-display text-2xl font-bold text-navy-900">{googleRating.rating.toFixed(1)}</span>
                <span className="flex flex-col">
                  <Stars rating={Math.round(googleRating.rating)} />
                  <span className="text-xs text-navy-500">{googleRating.count} Google reviews</span>
                </span>
              </a>
            )}
            {trustoo && (
              <a href={trustoo.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-3 rounded-2xl bg-navy-50 px-5 py-3 transition-colors hover:bg-navy-100">
                <span className="font-display text-2xl font-bold text-navy-900">{trustoo.score.toFixed(1).replace(".", ",")}</span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-navy-900">Trustoo-score</span>
                  <span className="text-xs text-navy-500">{trustoo.label}</span>
                </span>
              </a>
            )}
          </div>)
        </Reveal>

        {reviews.length > 0 && (
          <StaggerGroup className="mt-12 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((r, i) => (
              <StaggerItem key={`${r.author}-${i}`}>
                <ReviewCard review={r} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
