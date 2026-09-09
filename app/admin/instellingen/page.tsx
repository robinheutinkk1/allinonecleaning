import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getSettingsRow } from "@/lib/admin/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Instellingen" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettingsRow();
  return (
    <>
      <PageTitle title="Instellingen" description="Bedrijfsgegevens die op de website worden getoond. Wijzigingen zijn direct zichtbaar na opslaan." />
      <Card>
        <SettingsForm settings={settings} />
      </Card>
    </>
  );
}
