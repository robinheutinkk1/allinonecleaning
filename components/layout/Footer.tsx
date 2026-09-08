import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ctaConfig, navigation, siteConfig } from "@/config/site";
import { services } from "@/config/services";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(siteConfig.socialLinks).filter(([, url]) => Boolean(url)) as [string, string][];

  return (
    <footer className="relative mt-auto bg-navy-950 text-navy-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua-500/60 to-transparent" aria-hidden />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo inverted />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-navy-300">{siteConfig.description}</p>
          <div className="mt-6">
            <Link href={ctaConfig.primary.href} className="inline-flex items-center gap-2 font-semibold text-aqua-300 transition-colors hover:text-white">
              {ctaConfig.primary.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Navigatie</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navigation.main.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ctaConfig.primary.href} className="transition-colors hover:text-white">
                Offerte aanvragen
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
              <MapPin className="mt-0.5 size-4 shrink-0 text-aqua-400" aria-hidden />
              <span>
                {siteConfig.address.street ? (
                  <>
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.postalCode} {siteConfig.address.city}
                  </>
                ) : (
                  <>
                    {siteConfig.address.city}
                    <br />
                    <span className="text-navy-400">Werkgebied: {siteConfig.workAreas.join(", ")}</span>
                  </>
                )}
              </span>
            </li>
            {siteConfig.phone ? (
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-aqua-400" aria-hidden />
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
            ) : (
              <li className="flex items-center gap-3 text-navy-400">
                <Phone className="size-4 shrink-0 text-aqua-400" aria-hidden />
                <span>[TELEFOONNUMMER]</span>
              </li>
            )}
            {siteConfig.email ? (
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-aqua-400" aria-hidden />
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
            ) : (
              <li className="flex items-center gap-3 text-navy-400">
                <Mail className="size-4 shrink-0 text-aqua-400" aria-hidden />
                <span>[E-MAILADRES]</span>
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
            © {year} {siteConfig.legalName}. {siteConfig.tagline}.
            {siteConfig.kvk && <span className="ml-2">KvK {siteConfig.kvk}</span>}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navigation.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
