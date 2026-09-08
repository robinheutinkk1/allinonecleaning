/**
 * Offertenummer-formaat: AIC-2026-0001
 *
 * In productie wordt het nummer atomisch gegenereerd door de Postgres-functie
 * `next_quote_number()` (default op de kolom quote_number). Deze helper is
 * de fallback wanneer Supabase niet geconfigureerd is (lokale ontwikkeling),
 * zodat de wizard end-to-end getest kan worden.
 */
export function fallbackQuoteNumber(prefix = "AIC"): string {
  const year = new Date().getFullYear();
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}-T${n}`; // "T" markeert een test-/fallbacknummer
}

export function isQuoteNumber(value: string): boolean {
  return /^[A-Z]{2,5}-\d{4}-T?\d{4,}$/.test(value);
}
