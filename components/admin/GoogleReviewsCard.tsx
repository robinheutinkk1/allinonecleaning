"use client";

import { useActionState } from "react";
import { ExternalLink, Loader2, RefreshCw, Star } from "lucide-react";
import { syncGoogleReviewsAction, type ActionResult } from "@/lib/admin/actions";
import { btnPrimary, formatDateTime, Notice } from "./ui";

export type GoogleReviewsCardProps = {
  configured: boolean;
  missing: string[];
  cronConfigured: boolean;
  rating: number | null;
  count: number | null;
  url: string | null;
  placeName: string | null;
  syncedAt: string | null;
};

export function GoogleReviewsCard({ configured, missing, cronConfigured, rating, count, url, placeName, syncedAt }: GoogleReviewsCardProps) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(async () => syncGoogleReviewsAction(), null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-sun-100 text-sun-600">
            <Star className="size-6 fill-current" aria-hidden />
          </span>
          <div>
            <p className="font-display text-2xl font-bold leading-none text-navy-900">{rating !== null ? rating.toFixed(1) : "-"}</p>
            <p className="mt-1 text-xs text-navy-500">{count !== null ? `${count} Google-reviews` : "Nog geen Google-cijfers"}</p>
          </div>
        </div>
        <div className="text-sm text-navy-600">
          {placeName && <p className="font-semibold text-navy-900">{placeName}</p>}
          <p className="text-xs text-navy-400">{syncedAt ? `Laatst ververst ${formatDateTime(syncedAt)}` : "Nog nooit ververst"}</p>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-aqua-700 hover:underline">
            Bekijk op Google <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {configured ? (
        <form action={action} className="space-y-3">
          <button type="submit" disabled={pending} className={btnPrimary}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Google-reviews ophalen
          </button>
          {state && (state.ok ? <Notice>{state.message}</Notice> : <Notice tone="error">{state.error}</Notice>)}
          <p className="text-xs text-navy-500">
            Google geeft maximaal 5 reviews vrij. Nieuwe reviews worden direct gepubliceerd; u kunt ze hieronder verbergen of uitlichten.{" "}
            {cronConfigured ? "Elke nacht wordt automatisch ververst." : "Automatisch verversen staat uit: zet CRON_SECRET in Vercel voor de dagelijkse verversing."}
          </p>
        </form>
      ) : (
        <Notice tone="info">
          Google-koppeling nog niet actief. Zet {missing.join(" en ")} in Vercel en deploy opnieuw. Tot die tijd kunt u reviews handmatig toevoegen en het gemiddelde bij Instellingen invullen.
        </Notice>
      )}
    </div>
  );
}
