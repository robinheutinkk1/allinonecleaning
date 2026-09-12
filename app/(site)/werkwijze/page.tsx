import type { Metadata } from "next";
import { Camera, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { FAQ } from "@/components/sections/FAQ";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Werkwijze: van aanvraag tot oplevering",
  description: `Zo werkt ${siteConfig.companyName}: u vraagt online een offerte aan met foto's, wij beoordelen uw situatie persoonlijk, u ontvangt een duidelijke offerte en wij voeren het werk netjes en veilig uit.`,
  path: "/werkwijze",
  ogTitle: "Zo werken wij",
  ogSubtitle: "Aanvraag, beoordeling, offerte en uitvoering. Duidelijk en zonder verrassingen.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Werkwijze", path: "/werkwijze" },
];

const principles = [
  { icon: Camera, title: "Eerst kijken, dan beloven", text: "We beoordelen uw foto's en gegevens voordat we iets toezeggen. Bij grotere klussen komen we langs. Zo klopt de offerte met de situatie." },
  { icon: MessageSquareText, title: "Eén aanspreekpunt", text: "Van de eerste vraag tot de oplevering heeft u met dezelfde persoon te maken. Korte lijnen, duidelijke antwoorden." },
  { icon: ShieldCheck, title: "Netjes en veilig", text: "We werken met de juiste middelen en apparatuur, beschermen de omgeving en laten het terrein schoon achter." },
  { icon: Sparkles, title: "Resultaat dat u ziet", text: "Na afloop lopen we het werk samen met u na. Pas als u tevreden bent, is de klus voor ons klaar." },
];

export default function WerkwijzePage() {
  return (
    <>
      <PageHeader
        eyebrow="Werkwijze"
        title="Van aanvraag tot oplevering, zonder gedoe."
        description="Goed onderhoud begint met een duidelijk proces. U weet vooraf wat we doen, wanneer we komen en wat het kost. Hieronder leest u hoe een klus bij ons verloopt."
        breadcrumbs={crumbs}
      />

      <ProcessSteps />

      <section className="section-y bg-white">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="Waar u op kunt rekenen" title="Vier afspraken die we altijd nakomen." align="center" />
          </Reveal>
          <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <StaggerItem key={p.title}>
                <div className="h-full rounded-3xl bg-navy-50 p-6">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-white text-gold-700 shadow-soft">
                    <p.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <FAQ />
      <CTASection title="Klaar om te beginnen?" text="Vertel ons wat er moet gebeuren en voeg eventueel foto's toe. U ontvangt een persoonlijke beoordeling en een duidelijke offerte." />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
