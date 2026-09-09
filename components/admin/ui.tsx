import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { QUOTE_STATUSES } from "@/lib/admin/statuses";

/* Kleine, gedeelde bouwstenen voor het dashboard (server-compatibel). */

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-NL", { dateStyle: "medium", timeZone: "Europe/Amsterdam" });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "zojuist";
  if (m < 60) return `${m} min geleden`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} uur geleden`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d} dag${d === 1 ? "" : "en"} geleden`;
  return formatDate(iso);
}

const tones: Record<string, string> = {
  blue: "bg-aqua-100 text-aqua-800 ring-aqua-200",
  amber: "bg-amber-100 text-amber-800 ring-amber-200",
  violet: "bg-violet-100 text-violet-800 ring-violet-200",
  sky: "bg-sky-100 text-sky-800 ring-sky-200",
  green: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  red: "bg-red-100 text-red-800 ring-red-200",
  gray: "bg-navy-100 text-navy-600 ring-navy-200",
};

export function StatusBadge({ status }: { status: string }) {
  const def = QUOTE_STATUSES.find((s) => s.value === status);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", tones[def?.tone ?? "gray"])}>
      {def?.label ?? status}
    </span>
  );
}

export function MessageStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: string }> = {
    new: { label: "Nieuw", tone: "blue" },
    read: { label: "Gelezen", tone: "gray" },
    replied: { label: "Beantwoord", tone: "green" },
    archived: { label: "Gearchiveerd", tone: "gray" },
  };
  const def = map[status] ?? { label: status, tone: "gray" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", tones[def.tone])}>{def.label}</span>;
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: ReactNode; action?: ReactNode }) {
  return (
    <section className={cn("rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h2 className="font-display text-base font-bold text-navy-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-2 [&>a]:flex-1 [&>button]:flex-1 sm:[&>a]:flex-none sm:[&>button]:flex-none">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "default" }: { label: string; value: ReactNode; hint?: string; tone?: "default" | "accent" }) {
  return (
    <div className={cn("rounded-3xl p-5 ring-1", tone === "accent" ? "bg-navy-900 text-white ring-navy-900" : "bg-white ring-navy-100 shadow-soft")}>
      <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", tone === "accent" ? "text-aqua-300" : "text-navy-400")}>{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
      {hint && <p className={cn("mt-1 text-xs", tone === "accent" ? "text-navy-200" : "text-navy-400")}>{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-navy-200 bg-navy-50/50 p-10 text-center">
      <p className="font-display text-lg font-bold text-navy-900">{title}</p>
      {text && <p className="mt-1 text-sm text-navy-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Notice({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" | "info" }) {
  const cls = { success: "bg-emerald-50 text-emerald-800 ring-emerald-200", error: "bg-red-50 text-red-800 ring-red-200", info: "bg-aqua-50 text-aqua-900 ring-aqua-200" }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-2xl px-4 py-3 text-sm ring-1", cls)}>
      {children}
    </div>
  );
}

export function Pagination({ page, pageSize, total, basePath, params }: { page: number; pageSize: number; total: number; basePath: string; params: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    sp.set("pagina", String(p));
    return `${basePath}?${sp.toString()}`;
  };
  return (
    <nav className="mt-4 flex flex-col gap-3 text-sm text-navy-600 sm:flex-row sm:items-center sm:justify-between" aria-label="Paginering">
      <span>
        Pagina {page} van {pages} · {total} resultaten
      </span>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <Link href={href(Math.max(1, page - 1))} aria-disabled={page <= 1} className={cn(btnSecondary, btnSmall, page <= 1 && "pointer-events-none opacity-40")}>
          Vorige
        </Link>
        <Link href={href(Math.min(pages, page + 1))} aria-disabled={page >= pages} className={cn(btnSecondary, btnSmall, page >= pages && "pointer-events-none opacity-40")}>
          Volgende
        </Link>
      </div>
    </nav>
  );
}

export const inputCls =
  "block min-h-11 w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-base text-navy-900 placeholder:text-navy-300 focus:border-aqua-500 focus:outline-none focus:ring-4 focus:ring-aqua-100 sm:min-h-10 sm:text-sm";
export const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-navy-500";

/**
 * Knoppen: minimaal 44px hoog op telefoon (touch), 40px op desktop; duidelijke
 * focus-ring, lichte "indruk" bij klikken en een nette uitgeschakelde staat.
 */
const btnBase =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-all duration-200 select-none " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:min-h-10 " +
  "[&>svg]:size-4 [&>svg]:shrink-0";
export const btnPrimary = `${btnBase} bg-aqua-500 text-white shadow-[0_6px_16px_-8px_rgb(34_155_210_/_0.8)] hover:bg-aqua-600 hover:shadow-[0_8px_20px_-8px_rgb(34_155_210_/_0.9)]`;
export const btnSecondary = `${btnBase} border border-navy-200 bg-white text-navy-800 shadow-[0_1px_2px_rgb(16_28_48_/_0.04)] hover:border-navy-300 hover:bg-navy-50`;
export const btnDanger = `${btnBase} border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50`;
export const btnGhost = `${btnBase} text-navy-700 hover:bg-navy-100/70`;
/** Kleine variant (in lijsten en kaarten): iets lager en compacter, blijft goed aan te tikken. */
export const btnSmall = "min-h-10 px-3.5 text-[13px] sm:min-h-9 [&>svg]:size-3.5";
