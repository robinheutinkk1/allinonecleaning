import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { RequestsManager } from "@/components/demo-admin/RequestsManager";

export const metadata: Metadata = { title: "Offerte-aanvragen" };

export default function DemoRequestsPage() {
  return (
    <>
      <DemoHint />
      <PageTitle title="Offerte-aanvragen" description="Alle aanvragen die via het offerteformulier op de website binnenkomen." />
      <Suspense>
        <RequestsManager />
      </Suspense>
    </>
  );
}
