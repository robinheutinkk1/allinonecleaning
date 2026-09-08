import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseAnonKey, getSupabaseServiceKey, getSupabaseUrl } from "./env";

/**
 * Server-side Supabase clients.
 *
 * - `getServiceClient()`  → service role, ALLEEN in route handlers / server code.
 *                           Omzeilt RLS; nooit naar de client lekken.
 * - `getAnonServerClient()` → anon key, voor publieke leesacties (projecten).
 *
 * Beide geven `null` terug als de env-variabelen ontbreken, zodat de site
 * ook zonder Supabase blijft werken (met statische fallback-data).
 */

let serviceClient: SupabaseClient<Database> | null | undefined;
let anonClient: SupabaseClient<Database> | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function getServiceClient(): SupabaseClient<Database> | null {
  if (serviceClient !== undefined) return serviceClient;
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    serviceClient = null;
    return null;
  }
  serviceClient = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

export function getAnonServerClient(): SupabaseClient<Database> | null {
  if (anonClient !== undefined) return anonClient;
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    anonClient = null;
    return null;
  }
  anonClient = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonClient;
}

/** Storage bucket-namen, gescheiden: offerte-uploads (privé) vs projectfoto's (publiek). */
export const STORAGE_BUCKETS = {
  quoteUploads: "quote-uploads",
  projectImages: "project-images",
} as const;
