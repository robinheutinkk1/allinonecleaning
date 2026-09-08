"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems, type FaqItem } from "@/config/faq";
import { cn } from "@/lib/utils/cn";

export function FAQ({ items = faqItems, compact = false }: { items?: FaqItem[]; compact?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section className={cn("bg-white", compact ? "py-12" : "section-y")}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        {!compact && (
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Veelgestelde vragen"
              title="Goed om te weten."
              description="Staat uw vraag er niet bij? Neem gerust contact op, we helpen u graag verder."
            />
          </Reveal>
        )}
        <Reveal className={compact ? "lg:col-span-12" : "lg:col-span-8"}>
          <ul className="divide-y divide-navy-100 rounded-3xl border border-navy-100 bg-white px-2 shadow-soft sm:px-4">
            {items.map((item, i) => {
              const open = openIndex === i;
              const id = `faq-${i}`;
              return (
                <li key={item.question}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`${id}-panel`}
                      id={`${id}-button`}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-semibold text-navy-900 transition-colors hover:text-aqua-700 sm:text-lg"
                    >
                      <span className="px-2">{item.question}</span>
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition-all duration-300",
                          open && "rotate-45 bg-aqua-500 text-white",
                        )}
                      >
                        <Plus className="size-4" aria-hidden />
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
                        <p className="px-2 pb-6 pr-14 text-[15px] leading-relaxed text-navy-500">{item.answer}</p>
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
