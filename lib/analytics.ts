/**
 * Conversiemeting — provider-agnostisch.
 *
 * Events worden gepusht naar `window.dataLayer` (Google Tag Manager / GA4)
 * en, indien aanwezig, naar Plausible of Vercel Analytics. Koppel later
 * een provider door het bijbehorende script in app/layout.tsx te laden;
 * de code hoeft niet te veranderen.
 */

export type AnalyticsEvent =
  | { name: "quote_started" }
  | { name: "quote_step_completed"; step: string; stepIndex: number }
  | { name: "quote_photo_uploaded"; count: number }
  | { name: "quote_submitted"; quoteNumber: string; service: string }
  | { name: "quote_failed"; reason: string }
  | { name: "contact_submitted" }
  | { name: "cta_click"; label: string; location: string }
  | { name: "before_after_interaction"; project?: string }
  | { name: "phone_click"; location: string };

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
    va?: (event: "event", data: { name: string; data?: Record<string, string | number> }) => void;
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const { name, ...props } = event;
  const data = props as Record<string, string | number>;

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: name, ...data });
    window.plausible?.(name, { props: data });
    window.va?.("event", { name, data });
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", name, data);
    }
  } catch {
    // analytics mag nooit de site breken
  }
}

/** UTM-parameters uit de URL lezen en bewaren voor de offerteaanvraag. */
export function captureUtm(): { source: string | null; medium: string | null; campaign: string | null } {
  if (typeof window === "undefined") return { source: null, medium: null, campaign: null };
  const params = new URLSearchParams(window.location.search);
  const key = "aic_utm";
  const fromUrl = {
    source: params.get("utm_source"),
    medium: params.get("utm_medium"),
    campaign: params.get("utm_campaign"),
  };
  try {
    if (fromUrl.source || fromUrl.medium || fromUrl.campaign) {
      sessionStorage.setItem(key, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    /* sessionStorage niet beschikbaar */
  }
  return fromUrl;
}
