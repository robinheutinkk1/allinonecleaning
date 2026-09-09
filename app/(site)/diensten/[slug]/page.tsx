import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { CTASection } from "@/components/sections/CTASection";
import { FAQ } from "@/components/sections/FAQ";
import { JsonLd } from "@/components/ui/JsonLd";
import { getService, services } from "@/config/services";
import { getProjectsByService } from "@/lib/projects";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export function generateStaticParams() {
  return services.filter((s) => s.href.startsWith("/diensten/")).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/diensten/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seoTitle, description: service.seoDescription, path: service.href, ogTitle: service.title, ogSubtitle: service.tagline });
}

export default async function ServicePage({ params }: PageProps<"/diensten/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  // Gevelreiniging heeft een eigen pillar-pagina - voorkom duplicate content.
  if (!service.href.startsWith("/diensten/")) permanentRedirect(service.href);

  const projects = await getProjectsByService(service.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    { name: service.title, path: service.href },
  ];

  return (
    <>
      <PageHeader eyebrow={`${service.title} · Enschede en heel Overijssel`} title={service.tagline} description={service.summary} breadcrumbs={crumbs} />
      <ServiceDetail service={service} projects={projects} />
      <FAQ />
      <CTASection title={`${service.title} laten uitvoeren?`} serviceKey={service.quoteKey} />
      <JsonLd data={[serviceJsonLd(service), breadcrumbJsonLd(crumbs)]} />
    </>
  );
}
