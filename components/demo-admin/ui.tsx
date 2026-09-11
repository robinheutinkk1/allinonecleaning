import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/* Kleine bouwstenen die specifiek zijn voor de demo-beheeromgeving. */

const badgeTones: Record<string, string> = {
  Online: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Actief: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Gepubliceerd: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Afgerond: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Concept: "bg-navy-100 text-navy-600 ring-navy-200",
  Nieuw: "bg-gold-100 text-gold-800 ring-gold-200",
  "In behandeling": "bg-sky-100 text-sky-800 ring-sky-200",
  "Offerte verstuurd": "bg-violet-100 text-violet-800 ring-violet-200",
};

export function DemoBadge({ label, className }: { label: string; className?: string }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", badgeTones[label] ?? "bg-navy-100 text-navy-600 ring-navy-200", className)}>{label}</span>;
}

export function StatusDot({ label = "Online" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}

/** Subtiele demo-aanduiding, boven aan elke pagina. */
export function DemoHint({ children = "Deze omgeving bevat voorbeeldgegevens." }: { children?: ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-900 ring-1 ring-gold-200">
      <span className="size-1.5 rounded-full bg-gold-500" aria-hidden />
      {children}
    </p>
  );
}

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
    </div>
  );
}
