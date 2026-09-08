import { Quote, Star } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { googleRating, reviews, type Review } from "@/config/reviews";

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
    <figure className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
      <Quote className="size-6 text-aqua-300" aria-hidden />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-navy-700">{review.text}</blockquote>
      <figcaption className="mt-5 flex items-center justify-between border-t border-navy-100 pt-4">
        <span>
          <span className="block text-sm font-semibold text-navy-900">{review.author}</span>
          <span className="block text-xs text-navy-400">
            via {review.source}
            {review.date ? ` · ${review.date}` : ""}
          </span>
        </span>
        <Stars rating={review.rating} />
      </figcaption>
    </figure>
  );
}

/**
 * Social proof. Zolang er geen echte reviews in config/reviews.ts staan,
 * wordt een eerlijke placeholder getoond in plaats van verzonnen testimonials.
 */
export function ReviewsSection({ showPlaceholder = false }: { showPlaceholder?: boolean }) {
  const hasReviews = reviews.length > 0;
  // Geen echte reviews én geen placeholder gewenst → sectie niet renderen (geen fake social proof).
  if (!hasReviews && !googleRating && !showPlaceholder) return null;

  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Ervaringen"
            title="Wat klanten zeggen."
            description={hasReviews ? "Beoordelingen van klanten die ons voor zijn gegaan." : "Wij verzamelen beoordelingen van klanten via Google. Zodra die er zijn, vindt u ze hier."}
          />
          {googleRating && (
            <a
              href={googleRating.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-navy-50 px-5 py-3 transition-colors hover:bg-navy-100"
            >
              <span className="font-display text-2xl font-bold text-navy-900">{googleRating.rating.toFixed(1)}</span>
              <span className="flex flex-col">
                <Stars rating={Math.round(googleRating.rating)} />
                <span className="text-xs text-navy-500">{googleRating.count} Google reviews</span>
              </span>
            </a>
          )}
        </Reveal>

        {hasReviews ? (
          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((r, i) => (
              <StaggerItem key={`${r.author}-${i}`}>
                <ReviewCard review={r} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <Reveal className="mt-12">
            <div className="grid gap-6 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-3xl border border-dashed border-navy-200 bg-navy-50/60 p-6" aria-hidden={i > 0}>
                  <Stars rating={5} />
                  <p className="mt-4 text-sm leading-relaxed text-navy-400">
                    {i === 0 ? "[GOOGLE REVIEWS] — hier verschijnen echte beoordelingen zodra ze zijn toegevoegd in config/reviews.ts." : "Beoordeling volgt"}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
