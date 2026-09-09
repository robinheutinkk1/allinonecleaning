"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/settings";

/**
 * Maakt de (deels uit het dashboard beheerde) site-instellingen beschikbaar
 * in client components zoals de navbar en de sticky mobiele balk.
 */
const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettings {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings moet binnen SiteSettingsProvider worden gebruikt");
  return ctx;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s()-]/g, "")}`;
}
