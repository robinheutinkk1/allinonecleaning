import type { Metadata } from "next";
import Image from "next/image";
import { Handshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Over ons: professioneel onderhoud in Twente",
  description: `${siteConfig.companyName} verzorgt reiniging, schilderwerk, houtrotherstel en renovatie van woningen en bedrijfspanden in Twente. Eén team, persoonlijk contact en zichtbaar resultaat.`,
  path: "/over-ons",
  ogTitle: "Over ons",
  ogSubtitle: "Eén team voor reiniging, schilderwerk, herstel en renovatie. Persoonlijk contact en zichtbaar resultaat.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Over ons", path: "/over-ons" },
];

const values = [
  { icon: Sparkles, title: "Resultaat dat u ziet", text: "We doen wat we zeggen: een gevel, dak of kozijn dat zichtbaar beter is dan ervoor. Bekijk de voorbeelden bij Ons werk." },
  { icon: Handshake, title: "Persoonlijk contact", text: "U heeft één aanspreekpunt. Van de eerste foto tot de oplevering weet u met wie u te maken heeft." },
  { icon: ShieldCheck, title: "Veilig en zorgvuldig", text: "Per oppervlak de passende methode, de juiste apparatuur en aandacht voor de omgeving. Geen schade, geen verrassingen." },
  { icon: MapPin, title: "Lokaal in Twente", text: "We werken in Hengelo, Borne, Enschede, Oldenzaal, Almelo en omgeving. Snel ter plaatse en bekend met de panden in de regio." },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Over ${siteConfig.companyName}`}
        title="Onderhoud met oog voor het gebouw en de mensen erin."
        description={`${siteConfig.companyName} is een onderhoudsbedrijf voor woningen en bedrijfspanden in Twente. Reiniging, schilderwerk, houtrotherstel en renovatie, uitgevoerd door één team dat het werk serieus neemt. Geen grote organisatie, wel korte lijnen en een verzorgd resultaat.`}
        breadcrumbs={crumbs}
      />

      <section className="section-y bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-4xl shadow-lift">
              <Image src="/images/over-ons/team-aan-het-werk.jpg" alt="Twee onderhoudsmedewerkers aan het werk bij een woning" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <SectionHeading
              eyebrow="Wie wij zijn"
              title="Eén team voor het complete onderhoud."
              description={
                <>
                  <p>
                    Een pand vraagt om aandacht. De gevel raakt vervuild, het dak groeit dicht met mos, houtwerk verweert en verf laat los. Wij pakken dat
                    in samenhang aan: reinigen, herstellen, schilderen en waar nodig renoveren.
                  </p>
                  <p className="mt-4">
                    We werken professioneel, veilig en met oog voor detail, zodat u verzekerd bent van een duurzaam en strak eindresultaat. U kunt rekenen op
                    eerlijk advies, snelle service en duidelijke communicatie.
                  </p>
                </>
              }
            />
            <div className="mt-8 rounded-3xl bg-navy-50 p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">Voor wie wij werken</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {siteConfig.audiences.map((a) => (
                  <li key={a} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-navy-700 ring-1 ring-navy-100">
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-navy-600">
                Van een rijtjeswoning tot een bedrijfspand of appartementencomplex: wij leveren strak werk tot in de kleinste details.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-water">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="Waar wij voor staan" title="Vier dingen die u van ons mag verwachten." align="center" />
          </Reveal>
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-3xl bg-white p-6 shadow-soft ring-1 ring-navy-100">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                    <v.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <ProcessSteps />
      <ReviewsSection />
      <CTASection title="Kennismaken? Vertel ons over uw pand." text="Laat weten wat er moet gebeuren en voeg een paar foto's toe. U hoort snel van ons." />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
