import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diensten: reiniging, schilderwerk, houtrotherstel en renovatie",
  description: `Overzicht van de diensten van ${siteConfig.companyName}: gevelreiniging, dakreiniging, zonnepanelen reinigen, terras en bestrating, schilderwerk, houtrotherstel, periodiek onderhoud en renovatie in Twente.`,
  path: "/diensten",
  ogTitle: "Onze diensten",
  ogSubtitle: "Reiniging, schilderwerk, houtrotherstel, periodiek onderhoud en renovatie. Eén team voor uw hele pand.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Diensten", path: "/diensten" },
];

export default function DienstenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Onze diensten"
        title="Alles voor uw pand, door één team."
        description="Van reiniging tot schilderwerk, houtrotherstel en renovatie. Hieronder ziet u wat wij doen en voor wie het geschikt is. Twijfelt u welke dienst u nodig heeft? Stuur ons foto's, wij denken graag mee."
        breadcrumbs={crumbs}
      />
      <ServiceGrid showHeading={false} />
      <ProcessSteps />
      <CTASection title="Weet u niet zeker welke dienst u nodig heeft?" text="Geen probleem. Vertel ons in de offerteaanvraag wat er moet gebeuren, voeg een paar foto's toe en wij beoordelen wat de beste aanpak is." />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
