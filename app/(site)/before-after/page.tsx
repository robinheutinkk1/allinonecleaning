import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectGallery } from "@/components/before-after/ProjectGallery";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProjects } from "@/lib/projects";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Before & After: resultaten van gevel- en dakreiniging in Enschede",
  description:
    "Bekijk echte voor-en-na-foto's van projecten van All in One Vastgoedonderhoud in Enschede en omgeving. Sleep de slider en zie het verschil van professionele gevel- en dakpanreiniging.",
  path: "/before-after",
  ogTitle: "Before & After",
  ogSubtitle: "Echte voor-en-na-resultaten van gevel- en dakreiniging in Enschede en omgeving.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Before & After", path: "/before-after" },
];

export default async function BeforeAfterPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Before & after"
        title="Kijk naar het verschil."
        description="Echte projecten, echte foto's. Sleep de slider op elk project om voor en na te vergelijken."
        breadcrumbs={crumbs}
      />
      <section className="section-y bg-white">
        <div className="container-x">
          <ProjectGallery projects={projects} />
        </div>
      </section>
      <CTASection title="Dit resultaat ook voor uw gevel of dak?" />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
