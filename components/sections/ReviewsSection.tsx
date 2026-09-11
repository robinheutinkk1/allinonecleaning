import { MapPin, Quote, Star } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { ReviewText } from "@/components/sections/ReviewText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviewsDemoLabel, type Review } from "@/config/reviews";
import { getReviews } from "@/lib/reviews";

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
      <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-navy-100 pt-4">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-navy-900">{review.author}</span>
          {review.date && <span className="block text-xs text-navy-400">{review.date}</span>}
        </span>
        {review.location && (
          <span className="inline-flex shrink-0 items-center gap-1 text-xs text-navy-500">
            <MapPin className="size-3.5 text-gold-600" aria-hidden />
            {review.location}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Reviewsectie. In de demo staan hier voorbeeldreviews (config/reviews.ts of het beheer),
 * duidelijk gelabeld als "Voorbeeldreviews". Zonder reviews wordt de sectie niet getoond.
 */
export async function ReviewsSection() {
  const reviews = await getReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Ervaringen" title="Wat klanten zeggen." description="Een indruk van hoe klanten het contact en het resultaat ervaren." />
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-navy-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-navy-500 ring-1 ring-navy-100">
            <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
            {reviewsDemoLabel}
          </span>
        </Reveal>

        <StaggerGroup className="mt-12 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((r, i) => (
            <StaggerItem key={`${r.author}-${i}`}>
              <ReviewCard review={r} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
