import Image from "next/image";
import { ArrowRight, Droplets } from "lucide-react";
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
            eyebrow="Schone gevel. Frisse uitstraling."
            title={
              <>
                Uw gevel is het eerste wat <span className="text-gold-600">mensen zien.</span>
              </>
            }
            description={
              <>
                <p>
                  Regen, vocht en verkeer laten sporen na. Groene aanslag, mos en vuil zetten zich langzaam vast op
                  metselwerk, dakpannen en gevelbekleding. Vaak valt het pas op als het verschil met de buren groot wordt.
                </p>
                <p className="mt-4">
                  Wij halen die laag weg met lage druk en biologisch afbreekbare reinigingsmiddelen. Geen hogedruk, geen
                  stoom, dus geen uitgeblazen voegen of beschadigde stenen. Wat overblijft is de oorspronkelijke kleur en
                  structuur van uw pand. Geen verbouwing, wel een eerste indruk die weer klopt.
                </p>
              </>
            }
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={ctaConfig.secondary.href} variant="secondary" icon={<ArrowRight className="size-4" />}>
              Bekijk het verschil
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
                src="/images/over-ons/bedrijfsbus.jpg"
                alt="De bedrijfsbus van All in One Vastgoedonderhoud bij een woning in Enschede tijdens een dakreiniging"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lift sm:-left-8">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
                <Droplets className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-navy-900">Lokaal & persoonlijk</span>
                <span className="block text-xs text-navy-400">Vanuit Enschede, voor heel Overijssel</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
