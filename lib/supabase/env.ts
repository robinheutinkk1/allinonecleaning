/**
 * Supabase-configuratie uit environment variables, tolerant voor de
 * verschillende namen die Supabase en Vercel gebruiken.
 *
 * Wordt bewust dynamisch gelezen (process.env[naam]) zodat Next.js de waarde
 * niet bij de build "inbakt": alle gebruik is server-side.
 */

const URL_NAMES = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"];

const ANON_NAMES = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
];

const SERVICE_NAMES = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_KEY"];

function firstPresent(names: string[]): { name: string; value: string } | null {
  for (const name of names) {
    const value = (process.env[name] ?? "").trim();
    if (value) return { name, value };
  }
  return null;
}

export function getSupabaseUrl(): string | null {
  const found = firstPresent(URL_NAMES);
  if (!found) return null;
  const value = found.value.replace(/\/+$/, "");
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSupabaseAnonKey(): string | null {
  return firstPresent(ANON_NAMES)?.value ?? null;
}

export function getSupabaseServiceKey(): string | null {
  return firstPresent(SERVICE_NAMES)?.value ?? null;
}

/** Namen (geen waarden) van gevonden variabelen, voor /api/health. */
export function describeSupabaseEnv() {
  return {
    url: firstPresent(URL_NAMES)?.name ?? null,
    anonKey: firstPresent(ANON_NAMES)?.name ?? null,
    serviceKey: firstPresent(SERVICE_NAMES)?.name ?? null,
    /** Alle env-namen met SUPABASE of RESEND erin, zodat een typefout direct opvalt. */
    presentNames: Object.keys(process.env)
      .filter((k) => /SUPABASE|RESEND|QUOTE_NOTIFICATION|EMAIL_FROM/i.test(k))
      .sort(),
    expected: { url: URL_NAMES, anonKey: ANON_NAMES, serviceKey: SERVICE_NAMES },
  };
}
