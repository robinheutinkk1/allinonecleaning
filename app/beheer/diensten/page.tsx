import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { ServicesManager } from "@/components/demo-admin/ServicesManager";

export const metadata: Metadata = { title: "Diensten" };

export default function DemoServicesPage() {
  return (
    <>
      <DemoHint />
      <PageTitle title="Diensten" description="De diensten zoals ze op de website staan. Pas teksten en beelden aan, wijzig de volgorde of zet een dienst tijdelijk uit." />
      <ServicesManager />
    </>
  );
}
