import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getSettingsRow, listReviews } from "@/lib/admin/queries";
import { googlePlacesConfig } from "@/lib/google/places";
import { GoogleReviewsCard } from "@/components/admin/GoogleReviewsCard";
import { ReviewManager } from "@/components/admin/ReviewManager";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  await requireAdmin();
  const [reviews, settings] = await Promise.all([listReviews(), getSettingsRow()]);
  const google = googlePlacesConfig();
  return (
    <>
      <PageTitle title="Reviews" description="Echte klantbeoordelingen die op de homepage en op Over ons worden getoond." />
      <Card title="Google" className="mb-6">
        <GoogleReviewsCard
          configured={google.missing.length === 0}
          missing={google.missing}
          cronConfigured={Boolean((process.env.CRON_SECRET ?? "").trim())}
          rating={settings?.google_rating !== null && settings?.google_rating !== undefined ? Number(settings.google_rating) : null}
          count={settings?.google_review_count ?? null}
          url={settings?.google_reviews_url ?? null}
          placeName={settings?.google_place_name ?? null}
          syncedAt={settings?.google_synced_at ?? null}
        />
      </Card>
      <Card title="Alle reviews">
        <ReviewManager reviews={reviews} />
      </Card>
    </>
  );
}
