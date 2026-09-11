import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { WebsiteEditor } from "@/components/demo-admin/WebsiteEditor";

export const metadata: Metadata = { title: "Website" };

export default function DemoWebsitePage() {
  return (
    <>
      <DemoHint />
      <PageTitle title="Website" description="Hero, logo, kleuren, knoppen, contactgegevens, werkgebied en SEO van de website." />
      <WebsiteEditor />
    </>
  );
}
