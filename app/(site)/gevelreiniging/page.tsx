import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceDetail } from "@/components/services/ServiceDetail";
import { CTASection } from "@/components/sections/CTASection";
import { FAQ } from "@/components/sections/FAQ";
import { LocationSection } from "@/components/sections/LocationSection";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { getService } from "@/config/services";
import { getProjectsByService } from "@/lib/projects";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

export const revalidate = 3600;

const service = getService("gevelreiniging")!;

export const metadata: Metadata = pageMetadata({
  title: service.seoTitle,
  description: service.seoDescription,
  path: "/gevelreiniging",
  ogTitle: "Gevelreiniging Enschede",
  ogSubtitle: service.tagline,
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Gevelreiniging", path: "/gevelreiniging" },
];

/**
 * Pillar-pagina voor de belangrijkste zoekintentie: "gevelreiniging Enschede".
 * Bevat naast de dienstinformatie extra, unieke inhoud over gevelvervuiling
 * en de lokale context - geen lege SEO-pagina.
 */
export default async function GevelreinigingPage() {
  const projects = await getProjectsByService("gevelreiniging");

  return (
    <>
      <PageHeader
        eyebrow="Gevelreiniging · Enschede en omgeving"
        title="Gevelreiniging in Enschede, veilig en zonder hogedruk."
        description="Groene aanslag, algen en vuil maken een gevel dof en verouderd. All in One Vastgoedonderhoud reinigt gevels van woningen en bedrijfspanden in Enschede en omgeving, met een aanpak die past bij uw metselwerk."
        breadcrumbs={crumbs}
      />

      <ServiceDetail service={service} projects={projects} />

      <section className="section-y bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="Herkent u dit?" title="Hoe een gevel vervuild raakt." description="Vervuiling op een gevel ontstaat geleidelijk. Vaak valt het pas op als het verschil met een schone gevel groot is." />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <dl className="grid gap-5 sm:grid-cols-2">
              {[
                { t: "Groene aanslag en algen", d: "Vooral op de noord- en schaduwzijde, waar de gevel langer vochtig blijft. Zichtbaar als een groene waas op de stenen en voegen." },
                { t: "Vuil en roet", d: "Langs drukke wegen zet fijnstof zich af op de gevel. De steen wordt grauw en verliest zijn oorspronkelijke kleur." },
                { t: "Witte uitslag", d: "Witte, poederige vlekken op metselwerk. Vaak een gevolg van vocht dat door de steen trekt." },
                { t: "Mos in voegen en op dorpels", d: "Op plekken waar water blijft staan groeit mos. Dat houdt vocht vast en ziet er verwaarloosd uit." },
              ].map((item) => (
                <div key={item.t} className="rounded-3xl bg-navy-50 p-6">
                  <dt className="font-display text-lg font-bold text-navy-900">{item.t}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-navy-600">{item.d}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-navy-500">
              Welke methode geschikt is, hangt af van het type steen, de voegen en de soort vervuiling. Daarom beoordelen wij elke gevel eerst aan de hand van foto&apos;s
              voordat we een offerte maken.
            </p>
          </Reveal>
        </div>
      </section>

      <LocationSection />
      <FAQ />
      <CTASection title="Uw gevel laten reinigen in Enschede?" serviceKey={service.quoteKey} />
      <JsonLd data={[serviceJsonLd(service), breadcrumbJsonLd(crumbs)]} />
    </>
  );
}
