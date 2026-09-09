"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems, type FaqItem } from "@/config/faq";
import { cn } from "@/lib/utils/cn";

/**
 * Veelgestelde vragen als accordeon.
 * - Alle vragen starten ingeklapt; één tegelijk open.
 * - Elke vraag heeft een "V"-markering en een pijl die omklapt; het antwoord
 *   krijgt een "A"-markering, zodat direct duidelijk is dat er een antwoord
 *   onder zit.
 */
export function FAQ({ items = faqItems, compact = false }: { items?: FaqItem[]; compact?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section className={cn("bg-white", compact ? "py-12" : "section-y")}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        {!compact && (
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Veelgestelde vragen"
              title="Goed om te weten."
              description="Klik op een vraag om het antwoord te lezen. Staat uw vraag er niet bij? Neem gerust contact op, we helpen u graag verder."
            />
            <p className="mt-6 hidden items-center gap-2 text-sm text-navy-400 lg:flex">
              <MessageCircleQuestion className="size-4 text-aqua-500" aria-hidden />
              {items.length} vragen en antwoorden
            </p>
          </Reveal>
        )}
        <Reveal className={compact ? "lg:col-span-12" : "lg:col-span-8"}>
          <ul className="space-y-3">
            {items.map((item, i) => {
              const open = openIndex === i;
              const id = `faq-${i}`;
              return (
                <li
                  key={item.question}
                  className={cn(
                    "rounded-2xl border bg-white transition-colors duration-300",
                    open ? "border-aqua-300 shadow-soft" : "border-navy-100 hover:border-aqua-200",
                  )}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`${id}-panel`}
                      id={`${id}-button`}
                      className="group flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold transition-colors duration-300",
                          open ? "bg-aqua-500 text-white" : "bg-navy-50 text-navy-500 group-hover:bg-aqua-50 group-hover:text-aqua-700",
                        )}
                        aria-hidden
                      >
                        V
                      </span>
                      <span className={cn("flex-1 font-display text-base font-semibold transition-colors sm:text-lg", open ? "text-navy-900" : "text-navy-800 group-hover:text-aqua-700")}>
                        {item.question}
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-navy-400">
                        <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline">{open ? "Sluiten" : "Antwoord"}</span>
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full border transition-all duration-300",
                            open ? "rotate-180 border-aqua-500 bg-aqua-500 text-white" : "border-navy-200 text-navy-600 group-hover:border-aqua-400 group-hover:text-aqua-700",
                          )}
                        >
                          <ChevronDown className="size-4" aria-hidden />
                        </span>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`${id}-panel`}
                        role="region"
                        aria-labelledby={`${id}-button`}
                        initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 border-t border-navy-100 px-4 pb-5 pt-4 sm:px-5">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sun-100 font-display text-sm font-bold text-sun-700" aria-hidden>
                            A
                          </span>
                          <p className="flex-1 pt-1.5 text-[15px] leading-relaxed text-navy-600">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
