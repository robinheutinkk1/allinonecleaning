"use client";

import { useActionState, useState, useTransition } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { deleteProject, saveProject, type ActionResult } from "@/lib/admin/actions";
import { services } from "@/config/services";
import type { ProjectRow } from "@/lib/supabase/types";
import { btnDanger, btnPrimary, inputCls, labelCls, Notice } from "./ui";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ProjectForm({ project, imageBase }: { project: ProjectRow | null; imageBase: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveProject, null);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();

  const resolve = (p: string | undefined) => (!p ? null : /^https?:\/\//.test(p) || p.startsWith("/") ? p : `${imageBase}/${p}`);

  const preview = (file: File | undefined, set: (v: string | null) => void) => set(file ? URL.createObjectURL(file) : null);

  return (
    <form action={action} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="before_image" value={project?.before_image ?? ""} />
      <input type="hidden" name="after_image" value={project?.after_image ?? ""} />

      {state && <Notice tone={state.ok ? "success" : "error"}>{state.ok ? state.message : state.error}</Notice>}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelCls}>
            Titel
          </label>
          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Bijv. Gevelreiniging vrijstaande woning"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelCls}>
            Slug (URL-naam)
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="service" className={labelCls}>
            Dienst
          </label>
          <select id="service" name="service" defaultValue={project?.service ?? services[0].slug} className={inputCls}>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className={labelCls}>
            Locatie
          </label>
          <input id="location" name="location" defaultValue={project?.location ?? ""} placeholder="Bijv. Hengelo" className={inputCls} />
        </div>
        <div>
          <label htmlFor="sort_order" className={labelCls}>
            Volgorde (laag = eerst)
          </label>
          <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={project?.sort_order ?? 0} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className={labelCls}>
            Omschrijving van de situatie
          </label>
          <textarea id="description" name="description" rows={3} defaultValue={project?.description ?? ""} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="result" className={labelCls}>
            Resultaat (één zin)
          </label>
          <input id="result" name="result" defaultValue={project?.result ?? ""} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {(["before", "after"] as const).map((kind) => {
          const current = resolve(kind === "before" ? project?.before_image : project?.after_image);
          const previewUrl = kind === "before" ? beforePreview : afterPreview;
          const shown = previewUrl ?? current;
          return (
            <div key={kind} className="rounded-2xl border border-navy-100 p-4">
              <p className={labelCls}>{kind === "before" ? "Voor-foto" : "Na-foto"}</p>
              <div className="mb-3 aspect-[16/10] overflow-hidden rounded-xl bg-navy-50">
                {shown ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={shown} alt="" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-sm text-navy-400">Nog geen foto</div>
                )}
              </div>
              <input
                type="file"
                name={`${kind}_file`}
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => preview(e.target.files?.[0], kind === "before" ? setBeforePreview : setAfterPreview)}
                className="block w-full text-sm text-navy-600 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
              />
              <input name={`${kind}_alt`} defaultValue={(kind === "before" ? project?.before_alt : project?.after_alt) ?? ""} placeholder="Alt-tekst (voor Google en screenreaders)" className={`${inputCls} mt-3`} />
              <p className="mt-2 text-xs text-navy-400">JPG, PNG of WEBP, max. 15 MB. Zonder VOOR/NA-tekst in beeld; de slider voegt die zelf toe.</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="size-4 rounded border-navy-300 accent-gold-500" />
          Gepubliceerd op de site
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="size-4 rounded border-navy-300 accent-gold-500" />
          Uitgelicht op de homepage
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-5">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Bezig met opslaan…" : "Project opslaan"}
        </button>
        {project && (
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              if (window.confirm("Dit project en de bijbehorende foto's verwijderen?")) startDelete(() => deleteProject(project.id).then(() => undefined));
            }}
            className={btnDanger}
          >
            <Trash2 className="size-4" /> Verwijderen
          </button>
        )}
      </div>
    </form>
  );
}
