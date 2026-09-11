"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Camera, Eye, Mail, Phone, RefreshCw, Search } from "lucide-react";
import { btnPrimary, btnSecondary, btnSmall, inputCls } from "@/components/admin/ui";
import { DemoBadge, Field } from "@/components/demo-admin/ui";
import { demoRequests, demoRequestStatuses, type DemoRequest, type DemoRequestStatus } from "@/config/demo-admin";
import { cn } from "@/lib/utils/cn";
import { DemoDrawer } from "./Drawer";
import { useDemoFeedback } from "./feedback";

export function RequestsManager() {
  const { notify } = useDemoFeedback();
  const params = useSearchParams();
  const [rows, setRows] = useState<DemoRequest[]>(demoRequests);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"alle" | DemoRequestStatus>("alle");
  const [openId, setOpenId] = useState<string | null>(params.get("aanvraag"));

  const visible = rows.filter((r) => (filter === "alle" || r.status === filter) && (query === "" || `${r.name} ${r.service} ${r.location} ${r.number}`.toLowerCase().includes(query.toLowerCase())));
  const open = rows.find((r) => r.id === openId) ?? null;

  const cycleStatus = (id: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const i = demoRequestStatuses.indexOf(r.status);
        return { ...r, status: demoRequestStatuses[(i + 1) % demoRequestStatuses.length]! };
      }),
    );
    notify("Status gewijzigd in de demo.");
  };

  const setStatus = (id: string, status: DemoRequestStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    notify("Status gewijzigd in de demo.");
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["alle", ...demoRequestStatuses] as const).map((s) => (
            <button key={s} type="button" onClick={() => setFilter(s)} aria-pressed={filter === s} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition", filter === s ? "bg-navy-900 text-white" : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50")}>
              {s === "alle" ? `Alle (${rows.length})` : `${s} (${rows.filter((r) => r.status === s).length})`}
            </button>
          ))}
        </div>
        <label className="relative block sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-400" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoeken op naam, dienst, plaats" className={`${inputCls} pl-10`} aria-label="Zoeken" />
        </label>
      </div>

      {/* Tabel op desktop, kaarten op telefoon */}
      <div className="hidden overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100 md:block">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">
            <tr>
              <th className="px-5 py-3">Naam</th>
              <th className="px-3 py-3">Dienst</th>
              <th className="px-3 py-3">Plaats</th>
              <th className="px-3 py-3">Ontvangen</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-5 py-3 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {visible.map((r) => (
              <tr key={r.id} className="transition hover:bg-navy-50/60">
                <td className="px-5 py-3">
                  <p className="font-semibold text-navy-900">{r.name}</p>
                  <p className="font-mono text-xs text-navy-400">{r.number}</p>
                </td>
                <td className="px-3 py-3 text-navy-700">
                  {r.service}
                  {r.photos > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-navy-400">
                      <Camera className="size-3" /> {r.photos}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-navy-700">{r.location}</td>
                <td className="px-3 py-3 text-navy-500">{r.receivedAt}</td>
                <td className="px-3 py-3">
                  <DemoBadge label={r.status} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => setOpenId(r.id)} className={`${btnSecondary} ${btnSmall}`}>
                      <Eye className="size-4" aria-hidden />
                      Bekijken
                    </button>
                    <a href={`mailto:${r.email}`} className={`${btnSecondary} ${btnSmall}`}>
                      <Mail className="size-4" aria-hidden />
                      Contact opnemen
                    </a>
                    <button type="button" onClick={() => cycleStatus(r.id)} className={`${btnSecondary} ${btnSmall}`}>
                      <RefreshCw className="size-4" aria-hidden />
                      Status wijzigen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="p-8 text-center text-sm text-navy-500">Geen aanvragen gevonden.</p>}
      </div>

      <ul className="space-y-3 md:hidden">
        {visible.map((r) => (
          <li key={r.id} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-navy-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{r.name}</p>
                <p className="text-sm text-navy-500">
                  {r.service} · {r.location}
                </p>
                <p className="mt-0.5 text-xs text-navy-400">{r.receivedAt}</p>
              </div>
              <DemoBadge label={r.status} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button type="button" onClick={() => setOpenId(r.id)} className={`${btnSecondary} ${btnSmall} px-2`}>
                <Eye className="size-4" aria-hidden />
                Bekijken
              </button>
              <a href={`mailto:${r.email}`} className={`${btnSecondary} ${btnSmall} px-2`}>
                <Mail className="size-4" aria-hidden />
                Contact
              </a>
              <button type="button" onClick={() => cycleStatus(r.id)} className={`${btnSecondary} ${btnSmall} px-2`}>
                <RefreshCw className="size-4" aria-hidden />
                Status
              </button>
            </div>
          </li>
        ))}
        {visible.length === 0 && <li className="rounded-3xl bg-white p-8 text-center text-sm text-navy-500 ring-1 ring-navy-100">Geen aanvragen gevonden.</li>}
      </ul>

      <DemoDrawer open={Boolean(open)} title={open?.number ?? ""} description={open ? `${open.name} · ontvangen ${open.receivedAt.toLowerCase()}` : undefined} onClose={() => setOpenId(null)}>
        {open && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${open.phone.replace(/\s/g, "")}`} className={btnPrimary}>
                <Phone className="size-4" aria-hidden />
                Bellen
              </a>
              <a href={`mailto:${open.email}`} className={btnSecondary}>
                <Mail className="size-4" aria-hidden />
                E-mailen
              </a>
            </div>
            <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-navy-500">Dienst</dt>
              <dd className="font-medium text-navy-900">{open.service}</dd>
              <dt className="text-navy-500">Pand</dt>
              <dd className="text-navy-900">{open.property}</dd>
              <dt className="text-navy-500">Plaats</dt>
              <dd className="text-navy-900">{open.location}</dd>
              <dt className="text-navy-500">Telefoon</dt>
              <dd className="text-navy-900">{open.phone}</dd>
              <dt className="text-navy-500">E-mail</dt>
              <dd className="break-all text-navy-900">{open.email}</dd>
              <dt className="text-navy-500">Foto&apos;s</dt>
              <dd className="text-navy-900">{open.photos > 0 ? `${open.photos} toegevoegd` : "Geen"}</dd>
            </dl>
            <div className="rounded-2xl bg-navy-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">Omschrijving</p>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-800">{open.message}</p>
            </div>
            {open.photos > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">Foto&apos;s</p>
                <ul className="grid grid-cols-3 gap-2">
                  {Array.from({ length: Math.min(open.photos, 3) }).map((_, i) => (
                    <li key={i} className="flex aspect-square items-center justify-center rounded-xl bg-navy-100 text-navy-400">
                      <Camera className="size-5" aria-hidden />
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-navy-400">In de demo worden geen echte foto&apos;s getoond.</p>
              </div>
            )}
            <Field id="status" label="Status">
              <select id="status" value={open.status} onChange={(e) => setStatus(open.id, e.target.value as DemoRequestStatus)} className={inputCls}>
                {demoRequestStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}
      </DemoDrawer>
    </>
  );
}
