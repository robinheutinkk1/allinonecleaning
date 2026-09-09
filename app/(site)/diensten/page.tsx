import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Diensten: reiniging, schilderwerk, houtrotherstel en renovatie in Enschede",
  description:
    "Overzicht van de diensten van All in One Vastgoedonderhoud: gevel-, dak-, trespa-, zonnepanelen- en bestratingreiniging, schilderwerk binnen en buiten, houtrotherstel, vloerwerk en renovatie. Vraag een vrijblijvende offerte aan.",
  path: "/diensten",
  ogTitle: "Onze diensten",
  ogSubtitle: "Reiniging, schilderwerk, houtrotherstel, vloerwerk en renovatie. Eén partij voor uw hele pand.",
});

export default function DienstenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Onze diensten"
        title="Onderhoud van gevel tot dak."
        description="Van reiniging tot schilderwerk, houtrotherstel, vloerwerk en renovatie. Hieronder ziet u wat wij doen en voor wie het geschikt is. Twijfelt u? Stuur ons foto's, wij denken graag mee."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
        ]}
      />
      <ServiceGrid showHeading={false} />
      <ProcessSteps />
      <CTASection title="Weet u niet zeker welke dienst u nodig heeft?" text="Geen probleem. Kies in de offertewizard wat u wilt laten doen, voeg een paar foto's toe en wij beoordelen wat de beste aanpak is." />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
        ])}
      />
    </>
  );
}
