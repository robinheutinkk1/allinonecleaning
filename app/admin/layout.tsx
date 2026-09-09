import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/Shell";
import { getAdminUser } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function badgeCounts(): Promise<Record<string, number>> {
  const client = getServiceClient();
  if (!client) return {};
  const [q, m] = await Promise.all([
    client.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    client.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return { "/admin/aanvragen": q.count ?? 0, "/admin/berichten": m.count ?? 0 };
}

/**
 * Zonder geldige beheerder wordt alleen de kale pagina getoond (in de praktijk
 * de loginpagina, want proxy.ts stuurt alle andere /admin-routes daarheen).
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdminUser();
  if (!user) return <div className="min-h-screen bg-navy-50">{children}</div>;
  const badges = await badgeCounts();
  return (
    <AdminShell email={user.email} badges={badges}>
      {children}
    </AdminShell>
  );
}
