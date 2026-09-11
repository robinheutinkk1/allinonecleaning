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
              title="Alles voor uw pand, door één team."
              description="Reiniging van gevel, dak, zonnepanelen en bestrating, schilderwerk, houtrotherstel, periodiek onderhoud en renovatie. Voor woningen en bedrijfspanden."
            />
            <Button href="/diensten" variant="ghost" className="shrink-0" icon={<ArrowRight className="size-4" />}>
              Alle diensten
            </Button>
          </Reveal>
        )}

        {/* items-start: een uitgeklapte kaart rekt de buren in dezelfde rij niet mee op. */}
        <StaggerGroup className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <StaggerItem key={service.slug} className="flex">
              <ServiceCard service={service} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-navy-50 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-navy-700">
            <span className="font-semibold text-navy-900">Staat uw klus er niet bij?</span> Vertel ons wat er moet gebeuren, dan kijken wij
            of we u kunnen helpen.
          </p>
          <Button href={`${ctaConfig.primary.href}?dienst=anders`} variant="secondary" size="sm" className="shrink-0">
            Vraag het ons
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
