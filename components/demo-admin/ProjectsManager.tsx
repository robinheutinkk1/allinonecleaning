"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Pencil, Plus, Save } from "lucide-react";
import { btnPrimary, btnSecondary, btnSmall, inputCls } from "@/components/admin/ui";
import { DemoBadge, Field } from "@/components/demo-admin/ui";
import { demoProjects, type DemoProjectRow } from "@/config/demo-admin";
import { services } from "@/config/services";
import { DemoDrawer } from "./Drawer";
import { DEMO_SAVED, useDemoFeedback } from "./feedback";

export function ProjectsManager() {
  const { notify } = useDemoFeedback();
  const [rows, setRows] = useState<DemoProjectRow[]>(demoProjects);
  const [editing, setEditing] = useState<DemoProjectRow | null>(null);
  const [draft, setDraft] = useState<DemoProjectRow | null>(null);

  const openEdit = (row: DemoProjectRow | null) => {
    const base: DemoProjectRow =
      row ?? { id: `new-${Date.now()}`, title: "", category: services[0]!.title, location: "", status: "Concept", beforeImage: "/images/projects/gevelreiniging-voor.jpg", afterImage: "/images/projects/gevelreiniging-na.jpg", description: "", result: "" };
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

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-500">
          {rows.filter((r) => r.status === "Gepubliceerd").length} gepubliceerd · {rows.filter((r) => r.status === "Concept").length} concept
        </p>
        <button type="button" onClick={() => openEdit(null)} className={btnPrimary}>
          <Plus className="size-4" aria-hidden />
          Project toevoegen
        </button>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((p) => (
          <li key={p.id} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100">
            <div className="grid grid-cols-2 gap-0.5 bg-navy-100">
              <div className="relative aspect-[4/3]">
                <Image src={p.beforeImage} alt={`Voor: ${p.title}`} fill sizes="(min-width: 1280px) 20vw, (min-width: 640px) 25vw, 50vw" className="object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-navy-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Voor</span>
              </div>
              <div className="relative aspect-[4/3]">
                <Image src={p.afterImage} alt={`Na: ${p.title}`} fill sizes="(min-width: 1280px) 20vw, (min-width: 640px) 25vw, 50vw" className="object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-950">Na</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-gold-100 px-2.5 py-0.5 font-semibold text-gold-800">{p.category}</span>
                <span className="inline-flex items-center gap-1 text-navy-500">
                  <MapPin className="size-3" aria-hidden />
                  {p.location}
                </span>
              </div>
              <h3 className="mt-2 font-display text-base font-bold text-navy-900">{p.title}</h3>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <button type="button" onClick={() => toggle(p.id)} aria-label={`Status wijzigen van ${p.title}`}>
                  <DemoBadge label={p.status} />
                </button>
                <button type="button" onClick={() => openEdit(p)} className={`${btnSecondary} ${btnSmall}`}>
                  <Pencil className="size-4" aria-hidden />
                  Bewerken
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <DemoDrawer open={Boolean(editing)} title={editing && rows.some((r) => r.id === editing.id) ? "Project bewerken" : "Project toevoegen"} description="Wijzigingen zijn direct zichtbaar, maar worden in de demo niet bewaard." onClose={() => setEditing(null)}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <Field id="p-title" label="Titel">
              <input id="p-title" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={inputCls} placeholder="Bijv. Gevelreiniging vrijstaande woning" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="p-cat" label="Categorie">
                <select id="p-cat" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={inputCls}>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="p-loc" label="Locatie">
                <input id="p-loc" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={inputCls} placeholder="Bijv. Hengelo" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">Voor</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-50">
                  <Image src={draft.beforeImage} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">Na</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-50">
                  <Image src={draft.afterImage} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </div>
            </div>
            <button type="button" onClick={() => notify("Uploaden is in de demo uitgeschakeld.", "info")} className={`${btnSecondary} ${btnSmall}`}>
              Andere foto&apos;s kiezen
            </button>
            <Field id="p-desc" label="Situatie vooraf">
              <textarea id="p-desc" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
            </Field>
            <Field id="p-result" label="Resultaat">
              <input id="p-result" value={draft.result} onChange={(e) => setDraft({ ...draft, result: e.target.value })} className={inputCls} />
            </Field>
            <Field id="p-status" label="Status">
              <select id="p-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as DemoProjectRow["status"] })} className={inputCls}>
                <option value="Gepubliceerd">Gepubliceerd</option>
                <option value="Concept">Concept</option>
              </select>
            </Field>
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
