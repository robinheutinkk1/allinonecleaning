"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ctaConfig, siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

const subscribeNoop = () => () => {};
function getAllowVideo(): boolean {
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !(conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g");
}

/**
 * Hero met optionele achtergrondvideo (Higgsfield).
 *
 * - `videoSrc` aanwezig → autoplay/muted/loop/playsInline met poster, op desktop én mobiel.
 * - Bij databesparing (Save-Data) of een 2G-verbinding wordt de video niet geladen; de poster blijft.
 * - Bij prefers-reduced-motion wordt de video verborgen (CSS), de poster blijft.
 * - Laadt de video niet, dan blijft de poster zichtbaar.
 * - Tekst en CTA's blijven leesbaar door een navy-overlay + gradient.
 */
export function Hero({
  videoSrc = null,
  poster = "/images/hero/hero-poster.jpg",
}: {
  videoSrc?: string | null;
  poster?: string;
}) {
  // Server: altijd toestaan; client: uit bij databesparing of 2G (na hydratie, zonder mismatch).
  const allowVideo = useSyncExternalStore(subscribeNoop, getAllowVideo, () => true);

  // Geen render-branch op reduced motion (hydration!). MotionConfig regelt dat centraal.
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-950 pt-24 text-white sm:items-center">
      {/* Achtergrond: poster (altijd) + video (desktop, geen reduced motion) */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {videoSrc && allowVideo && (
          <video
            className="absolute inset-0 size-full object-cover motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
      {/* Overlay voor leesbaarheid */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30 sm:bg-gradient-to-r sm:from-navy-950/95 sm:via-navy-950/70 sm:to-navy-950/20" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid-faint opacity-40 [mask-image:radial-gradient(60%_60%_at_30%_50%,black,transparent)]" aria-hidden />

      {/* Decoratieve waterdruppel-glow */}
      <div className="pointer-events-none absolute -right-32 top-1/3 -z-10 size-[28rem] rounded-full bg-aqua-500/20 blur-3xl" aria-hidden />

      <div className="container-x relative pb-24 sm:pb-16 lg:pb-0">
        <div className="max-w-2xl lg:max-w-3xl">
          <motion.p {...fadeUp(0)} className="eyebrow text-aqua-300">
            <span className="inline-block h-px w-6 bg-current opacity-70" aria-hidden />
            {siteConfig.tagline} · {siteConfig.city}
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-5 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Een gevel die weer <span className="bg-gradient-to-r from-aqua-300 to-aqua-100 bg-clip-text text-transparent">gezien mag worden.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100 sm:text-xl">
            Veilige en milieuvriendelijke reiniging van gevels, dakpannen, trespa, bestrating en zonnepanelen in Enschede en
            omgeving. Met lage druk en biologisch afbreekbare middelen, zonder schade aan uw pand.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={ctaConfig.primary.href}
              size="lg"
              icon={<ArrowRight className="size-5" />}
              onClick={() => track({ name: "cta_click", label: "offerte", location: "hero" })}
            >
              {ctaConfig.primary.label}
            </Button>
            <Button
              href={ctaConfig.secondary.href}
              variant="outline-white"
              size="lg"
              icon={<Play className="size-4 fill-current" />}
              iconPosition="left"
              onClick={() => track({ name: "cta_click", label: "resultaten", location: "hero" })}
            >
              {ctaConfig.secondary.label}
            </Button>
          </motion.div>

          <motion.ul {...fadeUp(0.45)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-200">
            {["Gevelreiniging", "Dakpanreiniging", "Trespa", "Zonnepanelen", "Bestrating"].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-aqua-400" aria-hidden />
                {s}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.2em] text-navy-300 transition-colors hover:text-white lg:flex"
        aria-label="Scroll naar beneden"
      >
        <span>Ontdek</span>
        <ChevronDown className="size-5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
