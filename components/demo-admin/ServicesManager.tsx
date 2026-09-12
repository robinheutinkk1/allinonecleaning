"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Save } from "lucide-react";
import { btnGhost, btnPrimary, btnSecondary, btnSmall, inputCls } from "@/components/admin/ui";
import { DemoBadge, Field } from "@/components/demo-admin/ui";
import { demoServices, type DemoServiceRow } from "@/config/demo-admin";
import { DemoDrawer } from "./Drawer";
import { DEMO_SAVED, useDemoFeedback } from "./feedback";

export function ServicesManager() {
  const { notify } = useDemoFeedback();
  const [rows, setRows] = useState<DemoServiceRow[]>(demoServices);
  const [editing, setEditing] = useState<DemoServiceRow | null>(null);
  const [draft, setDraft] = useState<DemoServiceRow | null>(null);

  const openEdit = (row: DemoServiceRow | null) => {
    const base: DemoServiceRow = row ?? { id: `new-${Date.now()}`, name: "", description: "", image: "/images/services/periodiek-onderhoud.jpg", status: "Concept", order: rows.length + 1 };
    setEditing(base);
    setDraft({ ...base });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setRows((prev) => (prev.some((r) => r.id === draft.id) ? prev.map((r) => (r.id === draft.id ? draft : r)) : [...prev, draft]));
    setEditing(null);
    notify(DEMO_SAVED);
  };

  const move = (id: string, dir: -1 | 1) => {
    setRows((prev) => {
      const i = prev.findIndex((r) => r.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next.map((r, k) => ({ ...r, order: k + 1 }));
    });
  };

  const toggle = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: r.status === "Actief" ? "Concept" : "Actief" } : r)));
    notify("Status gewijzigd in de demo.");
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-500">
          {rows.filter((r) => r.status === "Actief").length} van {rows.length} diensten actief op de website.
        </p>
        <button type="button" onClick={() => openEdit(null)} className={btnPrimary}>
          <Plus className="size-4" aria-hidden />
          Dienst toevoegen
        </button>
      </div>

      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={r.id} className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-navy-100 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4 sm:flex-1">
              <span className="w-6 shrink-0 text-center font-mono text-xs text-navy-400">{String(r.order).padStart(2, "0")}</span>
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-navy-50">
                <Image src={r.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{r.name}</p>
                <p className="line-clamp-2 text-sm text-navy-500">{r.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button type="button" onClick={() => toggle(r.id)} className="-mx-1 inline-flex min-h-11 items-center rounded-full px-1 sm:min-h-0" aria-label={`Status wijzigen van ${r.name}`}>
                <DemoBadge label={r.status} />
              </button>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(r.id, -1)} disabled={i === 0} aria-label="Omhoog" className={`${btnGhost} ${btnSmall} px-2.5`}>
                  <ArrowUp className="size-4" />
                </button>
                <button type="button" onClick={() => move(r.id, 1)} disabled={i === rows.length - 1} aria-label="Omlaag" className={`${btnGhost} ${btnSmall} px-2.5`}>
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" onClick={() => openEdit(r)} className={`${btnSecondary} ${btnSmall}`}>
                  <Pencil className="size-4" aria-hidden />
                  Bewerken
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DemoDrawer open={Boolean(editing)} title={editing && rows.some((r) => r.id === editing.id) ? "Dienst bewerken" : "Dienst toevoegen"} description="Wijzigingen zijn direct zichtbaar in de lijst, maar worden in de demo niet bewaard." onClose={() => setEditing(null)}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <Field id="s-name" label="Naam">
              <input id="s-name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
            </Field>
            <Field id="s-desc" label="Korte omschrijving">
              <textarea id="s-desc" rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
            </Field>
            <Field id="s-image" label="Afbeelding">
              <select id="s-image" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className={inputCls}>
                {demoServices.map((s) => (
                  <option key={s.id} value={s.image}>
                    {s.image.split("/").pop()}
                  </option>
                ))}
              </select>
            </Field>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-50">
              <Image src={draft.image} alt="" fill sizes="480px" className="object-cover" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="s-status" label="Status">
                <select id="s-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as DemoServiceRow["status"] })} className={inputCls}>
                  <option value="Actief">Actief</option>
                  <option value="Concept">Concept</option>
                </select>
              </Field>
              <Field id="s-order" label="Volgorde">
                <input id="s-order" type="number" min={1} value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} className={inputCls} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-navy-100 pt-4">
              <button type="submit" className={btnPrimary}>
                <Save className="size-4" aria-hidden />
                Opslaan
              </button>
              <button type="button" onClick={() => setEditing(null)} className={btnSecondary}>
                Annuleren
              </button>
            </div>
          </form>
        )}
      </DemoDrawer>
    </>
  );
}
