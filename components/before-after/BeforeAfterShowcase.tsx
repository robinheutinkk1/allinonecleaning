import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ctaConfig } from "@/config/site";
import type { Project } from "@/config/projects";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

/**
 * Het belangrijkste visuele moment van de homepage: één grote slider met het
 * uitgelichte project, plus kleinere sliders daaronder. Direct gevolgd door
 * de conversie-CTA ("Dit wilt u ook?").
 */
export function BeforeAfterShowcase({ projects }: { projects: Project[] }) {
  const [main, ...rest] = projects;
  if (!main) return null;

  return (
    <section id="before-after" className="section-y relative overflow-hidden bg-navy-50">
      <div className="pointer-events-none absolute -left-40 top-20 size-[30rem] rounded-full bg-gold-200/40 blur-3xl" aria-hidden />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            eyebrow="Before & after"
            title="Kijk naar het verschil."
            description="Bekijk wat een professionele reiniging kan doen. Sleep de slider en vergelijk zelf. Dit zijn echte projecten van All in One Vastgoedonderhoud."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <BeforeAfterSlider
            beforeSrc={main.beforeImage}
            afterSrc={main.afterImage}
            beforeAlt={main.beforeAlt}
            afterAlt={main.afterAlt}
            aspect="aspect-[16/10] sm:aspect-[2/1] lg:aspect-[21/9]"
            rounded="rounded-3xl sm:rounded-4xl"
            sizes="(min-width: 1280px) 1200px, 100vw"
            trackId={main.slug}
          />
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-navy-900">{main.title}</h3>
              <p className="text-sm text-navy-500">{main.result}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm text-navy-500">
              <MapPin className="size-4 text-gold-600" aria-hidden />
              {main.location}
            </span>
          </div>
        </Reveal>

        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {rest.slice(0, 2).map((p, i) => (
              <Reveal key={p.id} delay={0.1 + i * 0.1}>
                <BeforeAfterSlider
                  beforeSrc={p.beforeImage}
                  afterSrc={p.afterImage}
                  beforeAlt={p.beforeAlt}
                  afterAlt={p.afterAlt}
                  aspect="aspect-[16/10]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  trackId={p.slug}
                />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <h3 className="font-display text-base font-bold text-navy-900">{p.title}</h3>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-600 ring-1 ring-navy-100">{p.serviceLabel}</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.2} className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="max-w-lg font-display text-2xl font-bold text-navy-900 sm:text-3xl">Ook benieuwd wat er met uw gevel of dak mogelijk is?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={ctaConfig.primary.href} size="lg" icon={<ArrowRight className="size-5" />}>
              {ctaConfig.primary.label}
            </Button>
            <Button href="/before-after" variant="ghost" size="lg">
              Alle projecten bekijken
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
