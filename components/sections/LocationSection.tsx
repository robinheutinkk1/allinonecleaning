import { MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

/**
 * Lokale SEO-sectie. Toont alleen het bevestigde werkgebied uit config/site.ts.
 * Voeg omliggende plaatsen pas toe aan `workAreas` als het bedrijf dit bevestigt.
 */
export function LocationSection() {
  return (
    <section className="section-y bg-water">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <SectionHeading
            eyebrow="Werkgebied"
            title={
              <>
                Actief in Enschede <span className="text-aqua-600">en omgeving.</span>
              </>
            }
            description={
              <>
                <p>
                  All in One Cleaning werkt vanuit Enschede. Wij reinigen gevels, dakpannen, trespa en zonnepanelen bij
                  woningen en bedrijfspanden in de stad en de directe omgeving.
                </p>
                <p className="mt-4">
                  Woont u iets verder weg in Twente? Vraag gerust een offerte aan — dan laten we u weten of uw locatie
                  binnen ons werkgebied valt.
                </p>
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-4xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
            <div className="absolute inset-0 bg-navy-water" aria-hidden />
            <div className="absolute inset-0 bg-grid-faint opacity-60 [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]" aria-hidden />
            {/* Abstracte "kaart": concentrische ringen rond Enschede */}
            <div className="pointer-events-none absolute right-8 top-8 size-64 sm:size-80" aria-hidden>
              {[1, 0.7, 0.4].map((s) => (
                <span
                  key={s}
                  className="absolute inset-0 rounded-full border border-aqua-400/25"
                  style={{ transform: `scale(${s})` }}
                />
              ))}
              <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aqua-400 shadow-[0_0_0_8px_rgb(72_179_227_/_0.25)]" />
            </div>

            <div className="relative">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-aqua-300">
                <Navigation className="size-4" aria-hidden />
                Werkgebied
              </p>
              <ul className="mt-6 space-y-3">
                {siteConfig.workAreas.map((area, i) => (
                  <li key={area} className="flex items-center gap-3 text-lg font-medium">
                    <MapPin className={i === 0 ? "size-5 text-aqua-300" : "size-5 text-navy-300"} aria-hidden />
                    <span className={i === 0 ? "text-white" : "text-navy-200"}>{area}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-sm text-sm text-navy-300">
                Vestigingsplaats: {siteConfig.address.city}. Andere plaatsen op aanvraag.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
