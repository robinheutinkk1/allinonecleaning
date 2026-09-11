"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Film, Trash2, Upload } from "lucide-react";
import { btnDanger, btnPrimary, btnSecondary, btnSmall } from "@/components/admin/ui";
import { demoMedia, type DemoMediaItem } from "@/config/demo-admin";
import { cn } from "@/lib/utils/cn";
import { useDemoFeedback } from "./feedback";

const types = ["Alle", "Afbeelding", "Video", "Logo", "Before & after"] as const;

export function MediaLibrary() {
  const { notify } = useDemoFeedback();
  const [items, setItems] = useState<DemoMediaItem[]>(demoMedia);
  const [type, setType] = useState<(typeof types)[number]>("Alle");
  const [selected, setSelected] = useState<string | null>(null);

  const visible = type === "Alle" ? items : items.filter((i) => i.type === type);
  const current = items.find((i) => i.id === selected) ?? null;

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected(null);
    notify("Bestand verwijderd in de demo.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} aria-pressed={type === t} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold transition", type === t ? "bg-navy-900 text-white" : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50")}>
                {t}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => notify("Uploaden is in de demo uitgeschakeld.", "info")} className={btnPrimary}>
            <Upload className="size-4" aria-hidden />
            Uploaden
          </button>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {visible.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelected(m.id)}
                aria-pressed={selected === m.id}
                className={cn("group relative block w-full overflow-hidden rounded-2xl bg-white text-left ring-1 transition", selected === m.id ? "ring-2 ring-gold-500 shadow-lift" : "ring-navy-100 hover:ring-gold-300")}
              >
                <div className={cn("relative aspect-[4/3]", m.type === "Logo" ? "bg-navy-50 p-4" : "bg-navy-100")}>
                  {m.type === "Video" ? (
                    <>
                      <Image src={m.poster ?? m.src} alt="" fill sizes="(min-width: 1280px) 15vw, (min-width: 640px) 25vw, 50vw" className="object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-navy-950/30 text-white">
                        <Film className="size-6" aria-hidden />
                      </span>
                    </>
                  ) : (
                    <Image src={m.src} alt="" fill sizes="(min-width: 1280px) 15vw, (min-width: 640px) 25vw, 50vw" className={m.type === "Logo" ? "object-contain p-4" : "object-cover"} />
                  )}
                  {selected === m.id && (
                    <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-navy-900">{m.name}</p>
                  <p className="text-xs text-navy-400">
                    {m.type} · {m.size}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
        {visible.length === 0 && <p className="rounded-3xl bg-white p-8 text-center text-sm text-navy-500 ring-1 ring-navy-100">Geen bestanden in deze categorie.</p>}
      </div>

      <aside className="lg:sticky lg:top-10 lg:self-start">
        <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100">
          {current ? (
            <>
              <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl", current.type === "Logo" ? "bg-navy-50" : "bg-navy-100")}>
                <Image src={current.type === "Video" ? (current.poster ?? current.src) : current.src} alt="" fill sizes="400px" className={current.type === "Logo" ? "object-contain p-6" : "object-cover"} />
              </div>
              <p className="mt-4 break-all font-semibold text-navy-900">{current.name}</p>
              <dl className="mt-2 space-y-1 text-sm text-navy-600">
                <div className="flex justify-between gap-3">
                  <dt className="text-navy-400">Type</dt>
                  <dd>{current.type}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy-400">Grootte</dt>
                  <dd>{current.size}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-navy-400">Gebruikt op</dt>
                  <dd className="text-right">{current.usedOn.join(", ")}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => notify(`"${current.name}" gekoppeld aan de website (demo).`)} className={`${btnSecondary} ${btnSmall}`}>
                  Gebruiken op website
                </button>
                <button type="button" onClick={() => remove(current.id)} className={`${btnDanger} ${btnSmall}`}>
                  <Trash2 className="size-4" aria-hidden />
                  Verwijderen
                </button>
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-sm text-navy-500">Selecteer een bestand om details te bekijken.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
