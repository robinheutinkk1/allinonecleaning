"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { QUOTE_STATUSES } from "@/lib/admin/statuses";
import { services } from "@/config/services";
import { serviceOptions } from "@/config/quote";
import { inputCls } from "./ui";

export function QuoteFilters({ team = [] }: { team?: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value && value !== "alle") sp.set(key, value);
    else sp.delete(key);
    sp.delete("pagina");
    router.push(`/admin/aanvragen?${sp.toString()}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        update("q", String(new FormData(e.currentTarget).get("q") ?? ""));
      }}
      className={team.length ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto]" : "grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]"}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-300" aria-hidden />
        <input name="q" defaultValue={params.get("q") ?? ""} placeholder="Zoek op nummer, naam, e-mail, telefoon, plaats…" className={`${inputCls} pl-10`} aria-label="Zoeken" />
      </div>
      <select aria-label="Status" value={params.get("status") ?? "alle"} onChange={(e) => update("status", e.target.value)} className={inputCls}>
        <option value="alle">Alle statussen</option>
        {QUOTE_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select aria-label="Dienst" value={params.get("dienst") ?? "alle"} onChange={(e) => update("dienst", e.target.value)} className={inputCls}>
        <option value="alle">Alle diensten</option>
        {serviceOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {services.find((s) => s.quoteKey === o.value)?.title ?? o.label}
          </option>
        ))}
      </select>
      {team.length > 0 && (
        <select aria-label="Toegewezen aan" value={params.get("toegewezen") ?? "alle"} onChange={(e) => update("toegewezen", e.target.value)} className={inputCls}>
          <option value="alle">Iedereen</option>
          <option value="geen">Niet toegewezen</option>
          {team.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </form>
  );
}
