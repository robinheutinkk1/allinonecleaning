import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diensten: gevel, dak, trespa & zonnepanelen reinigen in Enschede",
  description:
    "Overzicht van de reinigingsdiensten van All in One Cleaning Enschede: gevelreiniging, dakpanreiniging, trespa reiniging en zonnepanelen reiniging. Vraag gratis een offerte aan.",
  path: "/diensten",
});

export default function DienstenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Onze diensten"
        title="Reiniging van gevel tot dak."
        description="Elk oppervlak vraagt om een eigen aanpak. Hieronder ziet u wat wij reinigen en voor wie het geschikt is. Twijfelt u? Stuur ons foto's — wij denken graag mee."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
        ]}
      />
      <ServiceGrid showHeading={false} />
      <ProcessSteps />
      <CTASection title="Weet u niet zeker welke dienst u nodig heeft?" text="Geen probleem. Kies in de offertewizard wat u wilt laten reinigen, voeg een paar foto's toe en wij beoordelen wat de beste aanpak is." />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
        ])}
      />
    </>
  );
}
