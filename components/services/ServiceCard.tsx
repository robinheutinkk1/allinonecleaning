"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { Service } from "@/config/services";
import { cn } from "@/lib/utils/cn";

/**
 * Interactieve dienstkaart: hover = lichte lift + image zoom + icon-animatie,
 * klik op "Voordelen" = uitklapbare extra informatie.
 */
export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100 transition-all duration-500 ease-out-expo",
        "hover:-translate-y-1 hover:shadow-lift hover:ring-aqua-200",
      )}
      style={{ transitionDelay: `${index * 30}ms` }}
    >
      <Link href={service.href} className="relative block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden>
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-xl bg-white/95 text-aqua-600 shadow-soft backdrop-blur transition-all duration-500 group-hover:bg-aqua-500 group-hover:text-white group-hover:[transform:rotate(-6deg)_scale(1.06)]">
          <ServiceIcon name={service.icon} className="size-5" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-navy-900">
          <Link href={service.href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {service.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm font-medium text-aqua-700">{service.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-navy-500">{service.summary}</p>

        <div className="relative z-10 mt-5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`service-benefits-${service.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 transition-colors hover:text-aqua-700"
          >
            Voordelen
            <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} aria-hidden />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                id={`service-benefits-${service.slug}`}
                initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 pt-2.5 text-sm text-navy-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-aqua-600" strokeWidth={2.5} aria-hidden />
                    {b}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-navy-100 pt-5">
          <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 transition-colors group-hover:text-aqua-700">
            Meer informatie
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
          <Link
            href={`/offerte-aanvragen?dienst=${service.quoteKey}`}
            className="relative z-10 rounded-full bg-navy-50 px-3.5 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-aqua-500 hover:text-white"
          >
            Offerte
          </Link>
        </div>
      </div>
    </article>
  );
}
