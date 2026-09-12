"use client";

import { useState } from "react";
import { Eye, EyeOff, MapPin, Pencil, Plus, Save, Star, Trash2 } from "lucide-react";
import { btnDanger, btnPrimary, btnSecondary, btnSmall, inputCls } from "@/components/admin/ui";
import { DemoBadge, Field } from "@/components/demo-admin/ui";
import { demoReviews, type DemoReviewRow } from "@/config/demo-admin";
import { cn } from "@/lib/utils/cn";
import { DemoDrawer } from "./Drawer";
import { DEMO_SAVED, useDemoFeedback } from "./feedback";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} van 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("size-4", i <= rating ? "fill-sun-400 text-sun-400" : "text-navy-200")} />
      ))}
    </span>
  );
}

export function ReviewsManager() {
  const { notify } = useDemoFeedback();
  const [rows, setRows] = useState<DemoReviewRow[]>(demoReviews);
  const [editing, setEditing] = useState<DemoReviewRow | null>(null);
  const [draft, setDraft] = useState<DemoReviewRow | null>(null);

  const openEdit = (row: DemoReviewRow | null) => {
    const base: DemoReviewRow = row ?? { id: `new-${Date.now()}`, name: "", place: "", text: "", rating: 5, status: "Concept", date: "" };
    setEditing(base);
    setDraft({ ...base });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setRows((prev) => (prev.some((r) => r.id === draft.id) ? prev.map((r) => (r.id === draft.id ? draft : r)) : [draft, ...prev]));
    setEditing(null);
    notify(DEMO_SAVED);
  };

  const toggle = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: r.status === "Gepubliceerd" ? "Concept" : "Gepubliceerd" } : r)));
    notify("Status gewijzigd in de demo.");
  };

  const remove = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    notify("Review verwijderd in de demo.");
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-500">{rows.filter((r) => r.status === "Gepubliceerd").length} gepubliceerd op de website (maximaal 3 tegelijk zichtbaar).</p>
        <button type="button" onClick={() => openEdit(null)} className={btnPrimary}>
          <Plus className="size-4" aria-hidden />
          Review toevoegen
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{r.name}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-navy-500">
                  <MapPin className="size-3" aria-hidden />
                  {r.place}
                  {r.date ? ` · ${r.date}` : ""}
                </p>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-700">{r.text}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 pt-4">
              <DemoBadge label={r.status} />
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => toggle(r.id)} className={`${btnSecondary} ${btnSmall}`}>
                  {r.status === "Gepubliceerd" ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  {r.status === "Gepubliceerd" ? "Verbergen" : "Publiceren"}
                </button>
                <button type="button" onClick={() => openEdit(r)} className={`${btnSecondary} ${btnSmall}`}>
                  <Pencil className="size-4" aria-hidden />
                  Bewerken
                </button>
                <button type="button" onClick={() => remove(r.id)} aria-label={`Review van ${r.name} verwijderen`} className={`${btnDanger} ${btnSmall} px-2.5`}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DemoDrawer open={Boolean(editing)} title={editing && rows.some((r) => r.id === editing.id) ? "Review bewerken" : "Review toevoegen"} description="Wijzigingen worden in de demo niet bewaard." onClose={() => setEditing(null)}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="r-name" label="Naam">
                <input id="r-name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} placeholder="Bijv. Mark V." />
              </Field>
              <Field id="r-place" label="Plaats">
                <input id="r-place" value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} className={inputCls} placeholder="Bijv. Hengelo" />
              </Field>
            </div>
            <Field id="r-text" label="Review">
              <textarea id="r-text" required rows={4} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field id="r-rating" label="Sterren">
                <select id="r-rating" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })} className={inputCls}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="r-date" label="Datum">
                <input id="r-date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className={inputCls} placeholder="Bijv. juni 2026" />
              </Field>
              <Field id="r-status" label="Status">
                <select id="r-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as DemoReviewRow["status"] })} className={inputCls}>
                  <option value="Gepubliceerd">Gepubliceerd</option>
                  <option value="Concept">Concept</option>
                </select>
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
