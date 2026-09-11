import "server-only";
import { unstable_cache } from "next/cache";
import { demoConfig, siteConfig } from "@/config/site";
import { getAnonServerClient } from "@/lib/supabase/server";
import type { OpeningHour, StatItem } from "@/lib/supabase/types";

/**
 * Site-instellingen: config/site.ts als basis, overschreven door de rij in
 * `site_settings` (beheerd via het dashboard). Gecached met tag "site-settings";
 * het dashboard maakt de cache ongeldig na opslaan.
 */

export type SiteSettings = {
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: { street: string | null; postalCode: string | null; city: string };
  kvk: string | null;
  btw: string | null;
  openingHours: OpeningHour[] | null;
  workAreas: string[];
  socialLinks: { instagram: string | null; facebook: string | null; linkedin: string | null; google: string | null };
  googleRating: { rating: number; count: number; url: string } | null;
  stats: StatItem[];
  heroVideoEnabled: boolean;
};

function defaults(): SiteSettings {
  return {
    phone: siteConfig.phone,
    email: siteConfig.email,
    whatsapp: siteConfig.whatsapp,
    address: { ...siteConfig.address },
    kvk: siteConfig.kvk,
    btw: siteConfig.btw,
    openingHours: siteConfig.openingHours,
    workAreas: [...siteConfig.workAreas],
    socialLinks: { ...siteConfig.socialLinks },
    googleRating: null,
    stats: [],
    heroVideoEnabled: true,
  };
}

async function loadSettings(): Promise<SiteSettings> {
  const base = defaults();
  // Demo: de site toont altijd de demogegevens uit config/site.ts, tenzij expliciet
  // ingesteld dat de database leidend is (DEMO_USE_DATABASE_CONTENT=true).
  const client = demoConfig.useDatabaseContent ? getAnonServerClient() : null;
  if (!client) return base;
  try {
    const { data, error } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return base;
    return {
      phone: data.phone ?? base.phone,
      email: data.email ?? base.email,
      whatsapp: data.whatsapp ?? base.whatsapp,
      address: {
        street: data.street ?? base.address.street,
        postalCode: data.postal_code ?? base.address.postalCode,
        city: data.city ?? base.address.city,
      },
      kvk: data.kvk ?? base.kvk,
      btw: data.btw ?? base.btw,
      openingHours: data.opening_hours && data.opening_hours.length ? data.opening_hours : base.openingHours,
      workAreas: data.work_areas && data.work_areas.length ? data.work_areas : base.workAreas,
      socialLinks: {
        instagram: data.social_instagram ?? base.socialLinks.instagram,
        facebook: data.social_facebook ?? base.socialLinks.facebook,
        linkedin: data.social_linkedin ?? base.socialLinks.linkedin,
        google: data.social_google ?? base.socialLinks.google,
      },
      googleRating:
        data.google_rating && data.google_review_count
          ? { rating: Number(data.google_rating), count: data.google_review_count, url: data.google_reviews_url ?? data.social_google ?? "#" }
          : null,
      stats: data.stats ?? [],
      heroVideoEnabled: data.hero_video_enabled ?? true,
    };
  } catch {
    return base;
  }
}

export const getSiteSettings = unstable_cache(loadSettings, ["site-settings"], { tags: ["site-settings"], revalidate: 3600 });

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s()-]/g, "")}`;
}
