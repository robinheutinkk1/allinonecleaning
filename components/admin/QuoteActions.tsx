"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, Trash2, UserCheck } from "lucide-react";
import { addQuoteNote, assignQuote, deleteQuote, deleteQuotePhotos, updateQuoteStatus, type ActionResult } from "@/lib/admin/actions";
import { QUOTE_STATUSES } from "@/lib/admin/statuses";
import { btnDanger, btnPrimary, btnSecondary, inputCls, labelCls, Notice } from "./ui";

function useAction() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setResult(null);
      try {
        setResult(await fn());
      } catch (e) {
        if (e && typeof e === "object" && "digest" in e) throw e;
        setResult({ ok: false, error: "Er ging iets mis." });
      }
    });
  return { pending, result, run };
}

export function StatusForm({ quoteId, status }: { quoteId: string; status: string }) {
  const [value, setValue] = useState(status);
  const { pending, result, run } = useAction();
  return (
    <div className="space-y-3">
      <label htmlFor="status" className={labelCls}>
        Status
      </label>
      <div className="flex gap-2">
        <select id="status" value={value} onChange={(e) => setValue(e.target.value)} className={inputCls}>
          {QUOTE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="button" disabled={pending || value === status} onClick={() => run(() => updateQuoteStatus(quoteId, value))} className={btnPrimary}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Opslaan
        </button>
      </div>
      {result && <Notice tone={result.ok ? "success" : "error"}>{result.ok ? result.message : result.error}</Notice>}
    </div>
  );
}

export function AssignForm({ quoteId, assignedTo }: { quoteId: string; assignedTo: string | null }) {
  const [value, setValue] = useState(assignedTo ?? "");
  const { pending, result, run } = useAction();
  return (
    <div className="space-y-3">
      <label htmlFor="assignee" className={labelCls}>
        Toegewezen aan
      </label>
      <div className="flex gap-2">
        <input id="assignee" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Naam medewerker" className={inputCls} />
        <button type="button" disabled={pending} onClick={() => run(() => assignQuote(quoteId, value))} className={btnSecondary}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <UserCheck className="size-4" />}
          Toewijzen
        </button>
      </div>
      {result && <Notice tone={result.ok ? "success" : "error"}>{result.ok ? result.message : result.error}</Notice>}
    </div>
  );
}

export function NoteForm({ quoteId }: { quoteId: string }) {
  const [value, setValue] = useState("");
  const { pending, result, run } = useAction();
  return (
    <div className="space-y-3">
      <label htmlFor="note" className={labelCls}>
        Nieuwe notitie
      </label>
      <textarea id="note" value={value} onChange={(e) => setValue(e.target.value)} rows={4} placeholder="Bijv. gebeld, klant wil offerte per mail…" className={inputCls} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending || !value.trim()}
          onClick={() =>
            run(async () => {
              const r = await addQuoteNote(quoteId, value);
              if (r.ok) setValue("");
              return r;
            })
          }
          className={btnPrimary}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Notitie opslaan
        </button>
        {result && <span className={result.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{result.ok ? result.message : result.error}</span>}
      </div>
    </div>
  );
}

export function DangerZone({ quoteId, photoCount }: { quoteId: string; photoCount: number }) {
  const { pending, result, run } = useAction();
  const confirmAnd = (message: string, fn: () => Promise<ActionResult>) => {
    if (window.confirm(message)) run(fn);
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {photoCount > 0 && (
          <button type="button" disabled={pending} onClick={() => confirmAnd(`Alle ${photoCount} foto's van deze aanvraag definitief verwijderen?`, () => deleteQuotePhotos(quoteId))} className={btnDanger}>
            <Trash2 className="size-4" />
            Foto&apos;s verwijderen
          </button>
        )}
        <button type="button" disabled={pending} onClick={() => confirmAnd("Deze aanvraag inclusief foto's definitief verwijderen? Dit kan niet ongedaan worden gemaakt.", () => deleteQuote(quoteId))} className={btnDanger}>
          <Trash2 className="size-4" />
          Aanvraag verwijderen
        </button>
      </div>
      <p className="text-xs text-navy-400">Gebruik dit voor AVG-verzoeken of testaanvragen. Verwijderde gegevens zijn niet terug te halen.</p>
      {result && <Notice tone={result.ok ? "success" : "error"}>{result.ok ? result.message : result.error}</Notice>}
    </div>
  );
}
