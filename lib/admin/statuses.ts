import type { QuoteStatus } from "@/lib/supabase/types";

/** Statussen van een offerteaanvraag. Client-safe (geen server-only imports). */
export const QUOTE_STATUSES: { value: QuoteStatus; label: string; tone: "blue" | "amber" | "violet" | "sky" | "green" | "red" | "gray" }[] = [
  { value: "new", label: "Nieuw", tone: "blue" },
  { value: "reviewing", label: "In beoordeling", tone: "amber" },
  { value: "contacted", label: "Contact gehad", tone: "violet" },
  { value: "quoted", label: "Offerte verstuurd", tone: "sky" },
  { value: "won", label: "Gewonnen", tone: "green" },
  { value: "lost", label: "Verloren", tone: "red" },
  { value: "cancelled", label: "Geannuleerd", tone: "gray" },
];

export function statusLabel(status: string): string {
  return QUOTE_STATUSES.find((s) => s.value === status)?.label ?? status;
}
