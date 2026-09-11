import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { MediaLibrary } from "@/components/demo-admin/MediaLibrary";

export const metadata: Metadata = { title: "Media" };

export default function DemoMediaPage() {
  return (
    <>
      <DemoHint />
      <PageTitle title="Media" description="Alle afbeeldingen, video's, logo's en before/after-foto's die op de website worden gebruikt." />
      <MediaLibrary />
    </>
  );
}
