import "server-only";
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

/** Huidige ingelogde beheerder, of null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createSessionClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAllowedEmail(user.email)) return null;
  return { id: user.id, email: user.email };
}

/** Voor pagina's en server actions: redirect naar login als er geen geldige beheerder is. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
