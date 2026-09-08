"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ctaConfig, navigation, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Sticky navbar: transparant boven de (donkere) hero, solid wit na scrollen.
 * Op pagina's zonder donkere hero start hij direct solid.
 */
/** Pagina's met een donkere hero waar de navbar transparant over start. */
const DARK_HERO_PATHS = new Set(["/"]);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const transparentOnTop = DARK_HERO_PATHS.has(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu sluiten bij routewissel (state aanpassen tijdens render, geen effect nodig)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !transparentOnTop || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
        solid ? "bg-white/90 shadow-[0_1px_0_rgb(16_28_48_/_0.06),0_8px_24px_-16px_rgb(16_28_48_/_0.25)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav aria-label="Hoofdnavigatie" className="container-x flex h-[72px] items-center justify-between gap-4 sm:h-20">
        <Logo inverted={!solid} priority compactHide />

        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.main.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors",
                    solid ? "text-navy-700 hover:text-navy-900 hover:bg-navy-50" : "text-white/85 hover:text-white hover:bg-white/10",
                    active && (solid ? "text-aqua-700" : "text-white"),
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden
                      className={cn("absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full", solid ? "bg-aqua-500" : "bg-aqua-300")}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {siteConfig.phone && (
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className={cn(
                "hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors md:inline-flex",
                solid ? "text-navy-800 hover:bg-navy-50" : "text-white hover:bg-white/10",
              )}
            >
              <Phone className="size-4" aria-hidden />
              {siteConfig.phone}
            </a>
          )}
          <Button href={ctaConfig.primary.href} size="sm" className="hidden sm:inline-flex" icon={<ArrowRight className="size-4" />}>
            {ctaConfig.primaryShort.label}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full transition-colors lg:hidden",
              solid ? "text-navy-900 hover:bg-navy-50" : "text-white hover:bg-white/10",
            )}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-navy-100 bg-white lg:hidden"
          >
            <div className="container-x flex flex-col py-6">
              <ul className="flex flex-col">
                {navigation.main.map((item, i) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-4 font-display text-xl font-semibold text-navy-900 hover:bg-navy-50",
                          active && "text-aqua-700",
                        )}
                      >
                        {item.label}
                        <ArrowRight className="size-5 text-navy-300" aria-hidden />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-col gap-3 border-t border-navy-100 pt-6">
                <Button href={ctaConfig.primary.href} size="lg" icon={<ArrowRight className="size-5" />}>
                  {ctaConfig.primary.label}
                </Button>
                {siteConfig.phone ? (
                  <Button href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} variant="ghost" size="lg" icon={<Phone className="size-5" />} iconPosition="left">
                    {siteConfig.phone}
                  </Button>
                ) : (
                  <Button href={ctaConfig.contact.href} variant="ghost" size="lg">
                    {ctaConfig.contact.label}
                  </Button>
                )}
              </div>
              <p className="mt-8 text-center text-xs uppercase tracking-[0.2em] text-navy-400">{siteConfig.tagline} · {siteConfig.city}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
