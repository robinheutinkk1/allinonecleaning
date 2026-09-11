import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { DemoSettingsForm } from "@/components/demo-admin/SettingsForm";

export const metadata: Metadata = { title: "Instellingen" };

export default function DemoSettingsPage() {
  return (
    <>
      <DemoHint />
      <PageTitle title="Instellingen" description="Bedrijfsgegevens, huisstijl, social media en SEO van de website." />
      <DemoSettingsForm />
    </>
  );
}
