import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/ssr";

export type AdminUser = { id: string; email: string };

/** E-mailadressen die het dashboard mogen gebruiken (ADMIN_EMAILS, kommagescheiden). Leeg = iedere ingelogde gebruiker. */
export function allowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = allowedAdminEmails();
  return allowed.length === 0 || allowed.includes(email.toLowerCase());
}

/**
 * Huidige ingelogde beheerder, of null.
 *
 * - `getClaims()` controleert de JWT lokaal (met gecachte publieke sleutels) en valt
 *   alleen terug op een netwerkverzoek als het project nog symmetrische sleutels gebruikt.
 * - `cache()` zorgt dat layout, pagina en server actions binnen één request maar
 *   één keer controleren.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createSessionClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email : null;
  const id = typeof claims?.sub === "string" ? claims.sub : null;
  if (!id || !email || !isAllowedEmail(email)) return null;
  return { id, email };
});

/** Voor pagina's en server actions: redirect naar login als er geen geldige beheerder is. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/login");
  return user;
}
