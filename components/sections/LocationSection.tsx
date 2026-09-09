import { MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/config/site";

const euro = (v: number) => `€ ${v.toFixed(2).replace(".", ",")}`;

/**
 * Lokale SEO-sectie. Toont het werkgebied uit de instellingen (dashboard) of config/site.ts.
 */
export async function LocationSection() {
  const settings = await getSiteSettings();
  const areas = settings.workAreas;
  const city = settings.address.city;

  return (
    <section className="section-y bg-water">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <SectionHeading
            eyebrow="Werkgebied"
            title={
              <>
                Vanuit {city}, <span className="text-gold-600">actief in heel Overijssel.</span>
              </>
            }
            description={
              <>
                <p>
                  All in One Vastgoedonderhoud werkt vanuit {city}. Wij reinigen gevels, dakpannen, trespa, bestrating en zonnepanelen bij woningen en
                  bedrijfspanden in Twente en de rest van Overijssel.
                </p>
                <p className="mt-4">
                  Binnen {siteConfig.travel.freeRadiusKm} kilometer van {siteConfig.travel.from} rekenen wij geen reiskosten. Daarbuiten geldt een
                  kilometervergoeding van {euro(siteConfig.travel.ratePerKm)} per kilometer, altijd vooraf in de offerte vermeld.
                </p>
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-4xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
            <div className="absolute inset-0 bg-navy-water" aria-hidden />
            <div className="absolute inset-0 bg-grid-faint opacity-60 [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]" aria-hidden />
            <div className="pointer-events-none absolute right-8 top-8 size-64 sm:size-80" aria-hidden>
              {[1, 0.7, 0.4].map((s) => (
                <span key={s} className="absolute inset-0 rounded-full border border-gold-400/25" style={{ transform: `scale(${s})` }} />
              ))}
              <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400 shadow-[0_0_0_8px_rgb(72_179_227_/_0.25)]" />
            </div>

            <div className="relative">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">
                <Navigation className="size-4" aria-hidden />
                Werkgebied
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {areas.map((area, i) => (
                  <li key={area} className="flex items-center gap-3 text-lg font-medium">
                    <MapPin className={i === 0 ? "size-5 text-gold-300" : "size-5 text-navy-300"} aria-hidden />
                    <span className={i === 0 ? "text-white" : "text-navy-200"}>{area}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-sm text-sm text-navy-300">
                Vestigingsplaats: {city}. Geen reiskosten binnen {siteConfig.travel.freeRadiusKm} km, daarbuiten {euro(siteConfig.travel.ratePerKm)} per km.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
