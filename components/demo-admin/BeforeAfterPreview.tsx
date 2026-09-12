"use client";

import { useState } from "react";
import { BeforeAfterSlider } from "@/components/before-after/BeforeAfterSlider";
import { cn } from "@/lib/utils/cn";
import { demoProjects } from "@/config/demo-admin";
import { DemoBadge } from "./ui";

/** Voorbeeld van de before/after-slider zoals bezoekers die zien, per project. */
export function BeforeAfterPreview() {
  const published = demoProjects.filter((p) => p.status === "Gepubliceerd");
  const [active, setActive] = useState(published[0]!);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <BeforeAfterSlider beforeSrc={active.beforeImage} afterSrc={active.afterImage} beforeAlt={`Voor: ${active.title}`} afterAlt={`Na: ${active.title}`} aspect="aspect-[16/10] sm:aspect-[2/1]" sizes="(min-width: 1024px) 60vw, 100vw" trackId={`demo-${active.id}`} />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold text-navy-900">{active.title}</p>
            <p className="text-sm text-navy-500">{active.result}</p>
          </div>
          <DemoBadge label={active.status} />
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy-500">Kies een project</p>
        <ul className="space-y-2">
          {published.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActive(p)}
                aria-pressed={active.id === p.id}
                className={cn("flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm transition", active.id === p.id ? "bg-navy-900 text-white shadow-soft" : "bg-white text-navy-800 ring-1 ring-navy-100 hover:bg-navy-50")}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{p.title}</span>
                  <span className={cn("block text-xs", active.id === p.id ? "text-navy-300" : "text-navy-400")}>
                    {p.category} · {p.location}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-navy-400">Sleep de slider om voor en na te vergelijken. Zo ziet een bezoeker het op de website.</p>
      </div>
    </div>
  );
}
