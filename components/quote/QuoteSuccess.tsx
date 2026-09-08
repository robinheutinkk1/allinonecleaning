"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Home, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export function QuoteSuccess({ quoteNumber, serviceLabel, photoCount }: { quoteNumber: string; serviceLabel: string; photoCount: number }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(quoteNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard niet beschikbaar */
    }
  };

  return (
    <div className="text-center" role="status" aria-live="polite">
      <motion.span
        initial={reduce ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex size-20 items-center justify-center rounded-full bg-aqua-500 text-white shadow-glow"
      >
        <Check className="size-10" strokeWidth={3} aria-hidden />
      </motion.span>

      <h2 className="mt-6 font-display text-3xl font-bold text-navy-900 sm:text-4xl">Bedankt voor uw aanvraag!</h2>
      <p className="mx-auto mt-3 max-w-md text-navy-600">
        Uw offerteaanvraag is goed ontvangen. Wij bekijken uw gegevens en foto&apos;s persoonlijk en nemen daarna contact met u op.
      </p>

      <dl className="mx-auto mt-8 max-w-md divide-y divide-navy-100 rounded-3xl bg-navy-50 text-left ring-1 ring-navy-100">
        <div className="flex items-center justify-between gap-4 p-4">
          <dt className="text-sm text-navy-500">Aanvraagnummer</dt>
          <dd className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
            {quoteNumber}
            <button type="button" onClick={copy} aria-label="Aanvraagnummer kopiëren" className="rounded-full p-1.5 text-navy-500 transition-colors hover:bg-white hover:text-navy-900">
              {copied ? <Check className="size-4 text-aqua-600" /> : <Copy className="size-4" />}
            </button>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 p-4">
          <dt className="text-sm text-navy-500">Aangevraagde dienst</dt>
          <dd className="font-semibold text-navy-900">{serviceLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 p-4">
          <dt className="text-sm text-navy-500">Foto&apos;s</dt>
          <dd className="font-semibold text-navy-900">{photoCount} toegevoegd</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-navy-400">Bewaar uw aanvraagnummer. Dat is handig als u ons belt of mailt over deze aanvraag.</p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/" variant="secondary" icon={<Home className="size-4" />} iconPosition="left">
          Terug naar home
        </Button>
        {siteConfig.phone && (
          <Button href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} variant="ghost" icon={<Phone className="size-4" />} iconPosition="left">
            Bel ons direct
          </Button>
        )}
      </div>
    </div>
  );
}
