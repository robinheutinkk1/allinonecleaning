import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ctaConfig } from "@/config/site";

export function Intro() {
  return (
    <section id="intro" className="section-y bg-water scroll-mt-20">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <SectionHeading
            eyebrow="Eén team voor uw pand"
            title={
              <>
                Onderhoud dat u <span className="text-gold-600">ziet en voelt.</span>
              </>
            }
            description={
              <>
                <p>
                  Weer, vocht en tijd laten sporen na. Aanslag op de gevel, mos op het dak, verweerd houtwerk en
                  bladderende verf. Vaak sluipt het erin, tot het verschil met een verzorgd pand groot is.
                </p>
                <p className="mt-4">
                  NOVA Onderhoud brengt dat in één keer op orde. We reinigen gevel, dak, zonnepanelen en bestrating,
                  herstellen houtrot en verzorgen schilderwerk en renovatie. Eén team, één aanspreekpunt en een
                  resultaat dat gezien mag worden.
                </p>
              </>
            }
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={ctaConfig.secondary.href} variant="secondary" icon={<ArrowRight className="size-4" />}>
              {ctaConfig.secondary.label}
            </Button>
            <Button href={ctaConfig.primary.href} variant="ghost">
              {ctaConfig.primary.label}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-6">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-4xl shadow-lift">
              <Image
                src="/images/over-ons/team-aan-het-werk.jpg"
                alt="Onderhoudsmedewerker aan het werk bij een woning"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lift sm:-left-8">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-navy-900">Lokaal en persoonlijk</span>
                <span className="block text-xs text-navy-400">Actief in Twente en omgeving</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
