import type { Metadata } from "next";
import { Suspense } from "react";
import { Camera, Clock, Lock, ShieldCheck } from "lucide-react";
import { QuoteWizardLoader, WizardSkeleton } from "@/components/quote/QuoteWizardLoader";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gratis offerte aanvragen",
  description: `Vraag in twee minuten een gratis offerte aan bij ${siteConfig.companyName}. Vertel ons wat er moet gebeuren, voeg eventueel foto's toe en ontvang een persoonlijke beoordeling.`,
  path: "/offerte-aanvragen",
  ogTitle: "Gratis offerte aanvragen",
  ogSubtitle: "Vertel ons wat er moet gebeuren, voeg foto's toe en ontvang een persoonlijke beoordeling.",
});

const reassurance = [
  { icon: Clock, text: "In ±2 minuten ingevuld" },
  { icon: Camera, text: "Foto's direct vanaf uw telefoon" },
  { icon: Lock, text: "Foto's blijven privé" },
  { icon: ShieldCheck, text: "Vrijblijvend, geen automatische prijs" },
];

export default function OffertePage() {
  return (
    <section className="bg-water min-h-screen pb-16 pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(60%_50%_at_50%_0%,rgb(236_199_106_/_0.35),transparent_70%)]" aria-hidden />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo variant="mark" className="mb-4 lg:hidden" />
            <p className="eyebrow">
              <span className="inline-block h-px w-6 bg-current opacity-60" aria-hidden />
              {siteConfig.companyName} · {siteConfig.city}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">Gratis offerte aanvragen</h1>
            <p className="mt-3 max-w-xl text-navy-500">Vertel ons wat er moet gebeuren. Voeg eventueel foto&apos;s toe en ontvang een persoonlijke beoordeling.</p>
          </div>

          <Suspense fallback={<WizardSkeleton />}>
            <QuoteWizardLoader />
          </Suspense>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-navy-600 sm:grid-cols-4">
            {reassurance.map((r) => (
              <li key={r.text} className="flex items-center gap-2">
                <r.icon className="size-4 shrink-0 text-gold-600" aria-hidden />
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
