"use client";

import { useActionState, useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";
import { deleteReview, saveReview, toggleReviewPublished, type ActionResult } from "@/lib/admin/actions";
import type { ReviewRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";
import { btnDanger, btnPrimary, btnSecondary, btnSmall, inputCls, labelCls, Notice, formatDate } from "./ui";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} van 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("size-4", i <= rating ? "fill-sun-400 text-sun-400" : "text-navy-200")} />
      ))}
    </span>
  );
}

function ReviewForm({ review, onDone }: { review: ReviewRow | null; onDone: () => void }) {
  const fromGoogle = Boolean(review?.google_review_id);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(async (prev, fd) => {
    const r = await saveReview(prev, fd);
    if (r.ok) onDone();
    return r;
  }, null);
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-aqua-200 bg-aqua-50/40 p-5">
      {review && <input type="hidden" name="id" value={review.id} />}
      {state && !state.ok && <Notice tone="error">{state.error}</Notice>}
      {fromGoogle && <Notice tone="info">Deze review komt van Google. Naam, sterren, tekst en datum worden bij elke verversing overschreven; gepubliceerd, uitgelicht en volgorde blijven zoals u ze instelt.</Notice>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className={labelCls}>
            Naam klant
          </label>
          <input id="author" name="author" required readOnly={fromGoogle} defaultValue={review?.author ?? ""} placeholder="Bijv. J. de Vries" className={inputCls} />
        </div>
        <div>
          <label htmlFor="rating" className={labelCls}>
            Sterren
          </label>
          <select id="rating" name="rating" defaultValue={review?.rating ?? 5} disabled={fromGoogle} className={inputCls}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "ster" : "sterren"}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="text" className={labelCls}>
            Reviewtekst
          </label>
          <textarea id="text" name="text" required readOnly={fromGoogle} rows={3} defaultValue={review?.text ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="source" className={labelCls}>
            Bron
          </label>
          <input id="source" name="source" readOnly={fromGoogle} defaultValue={review?.source ?? "Google"} className={inputCls} />
        </div>
        <div>
          <label htmlFor="review_date" className={labelCls}>
            Datum
          </label>
          <input id="review_date" name="review_date" type="date" readOnly={fromGoogle} defaultValue={review?.review_date ?? ""} className={inputCls} />
        </div>
        <div>
          <label htmlFor="sort_order" className={labelCls}>
            Volgorde
          </label>
          <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={review?.sort_order ?? 0} className={inputCls} />
        </div>
        <div className="flex flex-wrap items-end gap-5">
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" name="published" defaultChecked={review?.published ?? true} className="size-4 accent-aqua-500" /> Gepubliceerd
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
            <input type="checkbox" name="featured" defaultChecked={review?.featured ?? false} className="size-4 accent-aqua-500" /> Uitgelicht
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Opslaan
        </button>
        <button type="button" onClick={onDone} className={btnSecondary}>
          <X className="size-4" /> Annuleren
        </button>
      </div>
    </form>
  );
}

export function ReviewManager({ reviews }: { reviews: ReviewRow[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-4">
      {editing === "new" ? (
        <ReviewForm review={null} onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
          <Plus className="size-4" /> Review toevoegen
        </button>
      )}

      {reviews.length === 0 && editing !== "new" && <p className="text-sm text-navy-500">Nog geen reviews. Voeg alleen echte beoordelingen van klanten toe.</p>}

      <ul className="space-y-3">
        {reviews.map((r) =>
          editing === r.id ? (
            <li key={r.id}>
              <ReviewForm review={r} onDone={() => setEditing(null)} />
            </li>
          ) : (
            <li key={r.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy-100 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="font-semibold text-navy-900">{r.author}</span>
                  <span className="text-xs text-navy-400">
                    via {r.source}
                    {r.review_date ? ` · ${formatDate(r.review_date)}` : ""}
                  </span>
                  {r.google_review_id && <span className="rounded-full bg-sun-100 px-2 py-0.5 text-[11px] font-semibold text-sun-700">Automatisch via Google</span>}
                  {!r.published && <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[11px] font-semibold text-navy-600">Verborgen</span>}
                  {r.featured && <span className="rounded-full bg-aqua-100 px-2 py-0.5 text-[11px] font-semibold text-aqua-800">Uitgelicht</span>}
                </div>
                <p className="mt-2 text-sm text-navy-700">{r.text}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => setEditing(r.id)} className={`${btnSecondary} ${btnSmall}`}>
                  <Pencil className="size-3.5" /> Bewerken
                </button>
                {r.google_review_id ? (
                  <button
                    type="button"
                    disabled={pending}
                    title={r.published ? "Verbergen op de site" : "Tonen op de site"}
                    onClick={() => start(() => toggleReviewPublished(r.id, !r.published).then(() => undefined))}
                    className={`${btnSecondary} ${btnSmall}`}
                  >
                    {r.published ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm("Deze review verwijderen?")) start(() => deleteReview(r.id).then(() => undefined));
                    }}
                    className={`${btnDanger} ${btnSmall}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
