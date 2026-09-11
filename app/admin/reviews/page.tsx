import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { listReviews } from "@/lib/admin/queries";
import { ReviewManager } from "@/components/admin/ReviewManager";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  await requireAdmin();
  const reviews = await listReviews();
  return (
    <>
      <PageTitle title="Reviews" description="Klantbeoordelingen die op de homepage en op Over ons worden getoond." />
      <Card title="Alle reviews">
        <ReviewManager reviews={reviews} />
      </Card>
    </>
  );
}
