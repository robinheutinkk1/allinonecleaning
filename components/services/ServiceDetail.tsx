import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { BeforeAfterSlider } from "@/components/before-after/BeforeAfterSlider";
import { services, type Service } from "@/config/services";
import type { Project } from "@/config/projects";
import { ctaConfig, siteConfig } from "@/config/site";

/** Inhoud van een dienstpagina (/diensten/[slug]). */
export function ServiceDetail({ service, projects }: { service: Service; projects: Project[] }) {
  const others = services.filter((s) => s.slug !== service.slug);
  const [project] = projects;

  return (
    <>
      <section className="section-y bg-white">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden rounded-4xl shadow-lift">
              <Image src={service.image} alt={service.imageAlt} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
            <div className="prose-aic mt-10 max-w-none">
              <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">Waarom {service.title.toLowerCase()}?</h2>
              <p className="mt-4 text-lg leading-relaxed text-navy-600">{service.intro}</p>
              <p className="mt-4 leading-relaxed text-navy-600">
                Wij werken niet met een standaardaanpak. Voordat we een offerte maken, bekijken we uw foto&apos;s en beoordelen we het materiaal, de huidige
                staat en de bereikbaarheid. Zo weet u vooraf precies wat u kunt verwachten.
              </p>
            </div>

            {service.category === "reiniging" ? (
              <div className="mt-10 rounded-3xl bg-navy-900 p-6 text-white sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-300">Onze reinigingsmethode</p>
                <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">Grondig resultaat, zonder schade.</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-200 sm:text-[15px]">{siteConfig.method.long}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {siteConfig.method.removes.map((r) => (
                    <li key={r} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15">
                      Verwijdert {r.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-10 rounded-3xl bg-navy-900 p-6 text-white sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-300">Onze werkwijze</p>
                <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">Professioneel, veilig en met oog voor detail.</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-200 sm:text-[15px]">{siteConfig.workStyle.long}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {siteConfig.workStyle.promises.map((r) => (
                    <li key={r} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-navy-50 p-6">
                <h3 className="font-display text-lg font-bold text-navy-900">Voordelen</h3>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-navy-700">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={2.5} aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-gold-50 p-6">
                <h3 className="font-display text-lg font-bold text-navy-900">Geschikt voor</h3>
                <ul className="mt-4 space-y-3">
                  {service.suitableFor.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-navy-700">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <aside className="lg:col-span-5">
            <Reveal delay={0.1} className="sticky top-28 space-y-6">
              <div className="rounded-3xl bg-navy-900 p-7 text-white shadow-lift">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold-300">
                  <Camera className="size-4" aria-hidden />
                  Gratis offerte
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold">Laat ons meekijken.</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">
                  Stuur een paar foto&apos;s mee en beantwoord een paar korte vragen. Wij beoordelen uw situatie persoonlijk, zonder automatische prijs.
                </p>
                <Button href={`${ctaConfig.primary.href}?dienst=${service.quoteKey}`} className="mt-6 w-full" size="lg" icon={<ArrowRight className="size-5" />}>
                  Offerte voor {service.shortTitle.toLowerCase()}
                </Button>
              </div>

              <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-100">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-navy-500">Andere diensten</h3>
                <ul className="mt-4 divide-y divide-navy-100">
                  {others.map((s) => (
                    <li key={s.slug}>
                      <Link href={s.href} className="group flex items-center gap-3 py-3 text-navy-800 transition-colors hover:text-gold-700">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-navy-50 text-navy-600 group-hover:bg-gold-100 group-hover:text-gold-700">
                          <ServiceIcon name={s.icon} className="size-4" />
                        </span>
                        <span className="flex-1 font-medium">{s.title}</span>
                        <ArrowRight className="size-4 text-navy-300 transition-transform group-hover:translate-x-1" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {project && (
        <section className="section-y bg-navy-50">
          <div className="container-x">
            <Reveal>
              <SectionHeading eyebrow="Voorbeeldproject" title={`Kijk naar het verschil: ${service.title.toLowerCase()}.`} description="Sleep de slider en vergelijk voor en na. Dit is een voorbeeldproject om te laten zien wat het resultaat kan zijn." />
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <BeforeAfterSlider
                beforeSrc={project.beforeImage}
                afterSrc={project.afterImage}
                beforeAlt={project.beforeAlt}
                afterAlt={project.afterAlt}
                aspect="aspect-[16/10] sm:aspect-[2/1]"
                sizes="(min-width: 1280px) 1200px, 100vw"
                trackId={project.slug}
              />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-navy-700">
                  <span className="font-semibold text-navy-900">{project.title}</span>: {project.result}
                </p>
                <Link href={ctaConfig.secondary.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-gold-800">
                  {ctaConfig.secondary.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
