import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { FAQ } from "@/components/sections/FAQ";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { ctaConfig } from "@/config/site";
import { getSiteSettings, telHref } from "@/lib/settings";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact: All in One Vastgoedonderhoud",
  description:
    "Neem contact op met All in One Vastgoedonderhoud in Enschede voor vragen over gevelreiniging, dakpanreiniging, trespa of zonnepanelen. Of vraag direct een gratis offerte aan.",
  path: "/contact",
  ogTitle: "Contact",
  ogSubtitle: "Vragen over gevel, dak, trespa of zonnepanelen? Bel, mail of vraag direct een offerte aan.",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default async function ContactPage() {
  const siteConfig = await getSiteSettings();
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Vragen? Wij helpen u graag."
        description="Voor algemene vragen gebruikt u het formulier hieronder. Wilt u een klus laten uitvoeren? Dan is de offertewizard de snelste route. Daar kunt u ook direct foto's meesturen."
        breadcrumbs={crumbs}
      />

      <section className="section-y bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <div className="rounded-4xl bg-white p-6 shadow-lift ring-1 ring-navy-100 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-navy-900">Stuur een bericht</h2>
              <p className="mt-2 text-sm text-navy-500">Wij reageren zo snel mogelijk op uw bericht.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl bg-navy-900 p-7 text-white shadow-lift">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-300">Klus aanvragen?</p>
              <h2 className="mt-3 font-display text-2xl font-bold">Gratis offerte met foto&apos;s.</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-200">In twee minuten ingevuld. Wij beoordelen uw situatie en nemen contact op.</p>
              <Link href={ctaConfig.primary.href} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gold-500 px-6 font-semibold text-navy-950 transition-colors hover:bg-gold-400">
                {ctaConfig.primary.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="rounded-3xl bg-navy-50 p-7">
              <h2 className="font-display text-lg font-bold text-navy-900">Contactgegevens</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
                  {siteConfig.phone ? (
                    <a href={telHref(siteConfig.phone)} className="font-medium text-navy-900 hover:text-gold-700">
                      {siteConfig.phone}
                    </a>
                  ) : (
                    <span className="text-navy-400">[TELEFOONNUMMER]</span>
                  )}
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
                  {siteConfig.email ? (
                    <a href={`mailto:${siteConfig.email}`} className="font-medium text-navy-900 hover:text-gold-700">
                      {siteConfig.email}
                    </a>
                  ) : (
                    <span className="text-navy-400">[E-MAILADRES]</span>
                  )}
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
                  <span className="text-navy-800">
                    {siteConfig.address.street ? (
                      <>
                        {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}
                      </>
                    ) : (
                      <>
                        {siteConfig.address.city} <span className="text-navy-400">· [ADRES]</span>
                      </>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden />
                  {siteConfig.openingHours ? (
                    <ul className="space-y-0.5 text-navy-800">
                      {siteConfig.openingHours.map((o) => (
                        <li key={o.days}>
                          {o.days}: {o.hours}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-navy-400">[OPENINGSTIJDEN]</span>
                  )}
                </li>
              </ul>
              <p className="mt-5 text-xs text-navy-400">
                Werkgebied: {siteConfig.workAreas.join(", ")}. Geen reiskosten binnen {siteConfig.travel.freeRadiusKm} km van {siteConfig.travel.from}, daarbuiten €{" "}
                {siteConfig.travel.ratePerKm.toFixed(2).replace(".", ",")} per km.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FAQ />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
