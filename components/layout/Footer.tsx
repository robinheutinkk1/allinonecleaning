import Link from "next/link";
import { ArrowUpRight, LockKeyhole, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ctaConfig, demoConfig, navigation, siteConfig } from "@/config/site";
import { services } from "@/config/services";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/settings";

export function Footer({ settings }: { settings: SiteSettings }) {
  const year = Math.max(2026, new Date().getFullYear());
  const socials = Object.entries(settings.socialLinks).filter(([, url]) => Boolean(url)) as [string, string][];

  return (
    <footer className="relative mt-auto bg-navy-950 text-navy-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" aria-hidden />
      <div className="container-x grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo inverted className="h-14" />
          <p className="mt-5 font-display text-base font-semibold text-white">{siteConfig.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy-300">{siteConfig.description}</p>
          <div className="mt-6">
            <Link href={ctaConfig.primary.href} className="inline-flex items-center gap-2 font-semibold text-gold-300 transition-colors hover:text-white">
              {ctaConfig.primary.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Navigatie</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navigation.footer.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ctaConfig.primary.href} className="transition-colors hover:text-white">
                {ctaConfig.primary.label}
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Diensten</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={s.href} className="transition-colors hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden />
              <span>
                {settings.address.street ? (
                  <>
                    {settings.address.street}
                    <br />
                    {settings.address.postalCode} {settings.address.city}
                  </>
                ) : (
                  <>
                    {settings.address.city}
                    <br />
                    <span className="text-navy-400">Actief in {settings.workAreas.join(", ")}</span>
                  </>
                )}
              </span>
            </li>
            {settings.phone && (
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-gold-400" aria-hidden />
                <a href={telHref(settings.phone)} className="transition-colors hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-gold-400" aria-hidden />
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.openingHours && settings.openingHours.length > 0 && (
              <li className="pt-1 text-navy-300">
                {settings.openingHours.map((o) => (
                  <span key={o.days} className="block">
                    {o.days}: {o.hours}
                  </span>
                ))}
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3 text-sm">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize transition-colors hover:text-white">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.legalName}
            {settings.kvk && <span className="ml-2">KvK {settings.kvk}</span>}
            {settings.btw && <span className="ml-2">Btw {settings.btw}</span>}
            <span className="mx-2 text-navy-600" aria-hidden>
              ·
            </span>
            <a href={demoConfig.platformUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              {demoConfig.credit}
            </a>
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {navigation.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`${demoConfig.adminPath}/login`} rel="nofollow" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 transition-colors hover:border-gold-400/60 hover:text-white">
                <LockKeyhole className="size-3" aria-hidden />
                Beheeromgeving
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
