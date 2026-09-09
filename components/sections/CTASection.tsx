import { ArrowRight, Camera, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ctaConfig } from "@/config/site";
import { getSiteSettings, telHref } from "@/lib/settings";

export async function CTASection({
  title = "Dit resultaat ook voor uw gevel?",
  text = "Stuur een paar foto's mee en vertel ons wat u wilt laten doen. Wij beoordelen uw situatie en nemen contact met u op, geheel vrijblijvend.",
  serviceKey,
}: {
  title?: string;
  text?: string;
  serviceKey?: string;
}) {
  const settings = await getSiteSettings();
  const href = serviceKey ? `${ctaConfig.primary.href}?dienst=${serviceKey}` : ctaConfig.primary.href;

  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-navy-900 px-6 py-14 text-white shadow-lift sm:px-12 lg:px-16 lg:py-20">
            <div className="absolute inset-0 bg-navy-water" aria-hidden />
            <div className="absolute -right-24 -top-24 size-96 rounded-full bg-gold-500/25 blur-3xl" aria-hidden />
            <div className="absolute -bottom-32 left-1/4 size-80 rounded-full bg-gold-400/10 blur-3xl" aria-hidden />

            <div className="relative grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="eyebrow text-gold-300">
                  <Camera className="size-4" aria-hidden />
                  Gratis offerte met foto&apos;s
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-200 sm:text-lg">{text}</p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                <Button href={href} size="lg" className="w-full sm:w-auto" icon={<ArrowRight className="size-5" />}>
                  {ctaConfig.primary.label}
                </Button>
                {settings.phone ? (
                  <Button href={telHref(settings.phone)} variant="outline-white" size="lg" className="w-full sm:w-auto" icon={<Phone className="size-4" />} iconPosition="left">
                    {settings.phone}
                  </Button>
                ) : (
                  <Button href={ctaConfig.contact.href} variant="outline-white" size="lg" className="w-full sm:w-auto">
                    {ctaConfig.contact.label}
                  </Button>
                )}
                <p className="text-xs text-navy-300 lg:text-right">Binnen 2 minuten ingevuld · Geen automatische prijs, wél een persoonlijke beoordeling</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
