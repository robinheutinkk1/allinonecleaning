import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/config/services";
import { ctaConfig } from "@/config/site";
import { ServiceCard } from "./ServiceCard";

export function ServiceGrid({
  showHeading = true,
  limit,
  exclude,
}: {
  showHeading?: boolean;
  limit?: number;
  exclude?: string;
}) {
  const list = services.filter((s) => s.slug !== exclude).slice(0, limit ?? services.length);

  return (
    <section id="diensten" className="section-y bg-white">
      <div className="container-x">
        {showHeading && (
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Onze diensten"
              title="Reiniging van gevel tot dak."
              description="Elke ondergrond vraagt om een eigen aanpak. Wij reinigen metselwerk, dakpannen, trespa en zonnepanelen met een methode die past bij het materiaal."
            />
            <Button href="/diensten" variant="ghost" className="shrink-0" icon={<ArrowRight className="size-4" />}>
              Alle diensten
            </Button>
          </Reveal>
        )}

        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((service, i) => (
            <StaggerItem key={service.slug} className="flex">
              <ServiceCard service={service} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-navy-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-navy-700">
            <span className="font-semibold text-navy-900">Iets anders laten reinigen?</span> Vertel ons wat u wilt laten aanpakken, wij
            beoordelen of wij u kunnen helpen.
          </p>
          <Button href={`${ctaConfig.primary.href}?dienst=anders`} variant="secondary" size="sm" className="shrink-0">
            Vraag het ons
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
