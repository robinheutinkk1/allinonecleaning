import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Supabase-client met cookie-sessie (Supabase Auth) voor het dashboard.
 * Alleen voor het bepalen van de ingelogde gebruiker; datamutaties gaan via de
 * service-client nadat requireAdmin() de sessie heeft gecontroleerd.
 */
export async function createSessionClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // In Server Components kunnen cookies niet gezet worden; proxy.ts ververst de sessie.
        }
      },
    },
  });
}
