import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectGallery } from "@/components/before-after/ProjectGallery";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { getProjects } from "@/lib/projects";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Ons werk: voor en na",
  description: `Bekijk voorbeeldprojecten van ${siteConfig.companyName}: gevelreiniging, dakreiniging, terrasreiniging en schilderwerk in Twente. Sleep de slider en zie het verschil.`,
  path: "/ons-werk",
  ogTitle: "Ons werk",
  ogSubtitle: "Voor en na: sleep de slider en zie wat professioneel onderhoud met een pand doet.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Ons werk", path: "/ons-werk" },
];

export default async function OnsWerkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Ons werk"
        title="Kijk naar het verschil."
        description="Sleep de slider op elk project om voor en na te vergelijken. De projecten hieronder zijn voorbeeldprojecten die laten zien wat u van ons werk mag verwachten."
        breadcrumbs={crumbs}
      />
      <section className="section-y bg-white">
        <div className="container-x">
          <ProjectGallery projects={projects} />
        </div>
      </section>
      <CTASection title="Dit resultaat ook voor uw pand?" />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
