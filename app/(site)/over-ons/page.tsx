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
  title: "Over ons: uw gevelspecialist in Enschede",
  description:
    "All in One Cleaning is een lokaal reinigingsbedrijf uit Enschede, gespecialiseerd in gevels, dakpannen, trespa en zonnepanelen. Persoonlijk contact en zichtbaar resultaat.",
  path: "/over-ons",
  ogTitle: "Over ons",
  ogSubtitle: "Lokaal reinigingsbedrijf uit Enschede. Persoonlijk contact en zichtbaar resultaat.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Over ons", path: "/over-ons" },
];

const values = [
  { icon: Sparkles, title: "Resultaat dat u ziet", text: "We doen wat we zeggen: een gevel, dak of oppervlak dat zichtbaar schoner is. Bekijk onze before & after-foto's." },
  { icon: Handshake, title: "Persoonlijk contact", text: "U heeft één aanspreekpunt. Van de eerste foto tot de laatste spoelbeurt weet u met wie u te maken heeft." },
  { icon: ShieldCheck, title: "Veilig en duurzaam", text: "Lage druk en biologisch afbreekbare middelen. Geen hogedruk, geen stoom, geen schade aan uw pand of de omgeving." },
  { icon: MapPin, title: "Lokaal uit Enschede", text: "We werken in Enschede en omgeving. Dichtbij, snel ter plaatse en bekend met de huizen en panden in de regio." },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Over All in One Cleaning"
        title="Uw gevelspecialist uit Enschede."
        description="All in One Cleaning is een lokaal reinigingsbedrijf, gespecialiseerd in het veilig en milieuvriendelijk reinigen van gevels, dakpannen, trespa, bestrating en zonnepanelen. Geen grote organisatie, wel korte lijnen en een verzorgd resultaat."
        breadcrumbs={crumbs}
      />

      <section className="section-y bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-4xl shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image src="/images/over-ons/bedrijfsbus.jpg" alt="Bedrijfsbus van All in One Cleaning voor een woning tijdens werkzaamheden" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <SectionHeading
              eyebrow="Wie wij zijn"
              title="Schoonmaken met oog voor het gebouw."
              description={
                <>
                  <p>
                    Een gevel of dak reinigen is meer dan er water tegenaan spuiten. Wij werken met lage druk en biologisch afbreekbare
                    reinigingsmiddelen, nooit met hogedruk of stoom. Zo verwijderen we schimmel, algen, mos en aanslag zonder voegen uit te blazen of
                    stenen, dakpannen en beplating te beschadigen.
                  </p>
                  <p className="mt-4">
                    We werken vanuit {siteConfig.city} voor particulieren, VvE&apos;s en bedrijven in de regio. U stuurt ons foto&apos;s, wij beoordelen de situatie en
                    doen een duidelijk voorstel. Zo simpel mag het zijn.
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
                Van een rijtjeswoning tot een bedrijfspand, school of appartementencomplex: wij leveren schoon werk tot in de kleinste details.
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
                  <span className="flex size-12 items-center justify-center rounded-xl bg-aqua-100 text-aqua-700">
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
      <CTASection title="Kennismaken? Stuur ons uw foto's." text="Vertel ons wat u wilt laten reinigen en voeg een paar foto's toe. U hoort van ons." />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
