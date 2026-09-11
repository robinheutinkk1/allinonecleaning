import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { ReviewsManager } from "@/components/demo-admin/ReviewsManager";

export const metadata: Metadata = { title: "Reviews" };

export default function DemoReviewsPage() {
  return (
    <>
      <DemoHint>Voorbeeldreviews · deze omgeving bevat voorbeeldgegevens.</DemoHint>
      <PageTitle title="Reviews" description="Klantbeoordelingen op de homepage en de pagina Over ons. Publiceer een review of bewaar hem als concept." />
      <ReviewsManager />
    </>
  );
}
