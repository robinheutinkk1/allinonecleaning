import "server-only";
import { getServiceClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import type { ContactMessageRow, ProjectRow, QuoteEventRow, QuoteRequestRow, QuoteStatus, ReviewRow, SiteSettingsRow } from "@/lib/supabase/types";

/**
 * Leesfuncties voor het dashboard. Alleen aanroepen ná requireAdmin().
 * Gebruikt de service-client (omzeilt RLS) omdat de sessiecheck al server-side gebeurt.
 */

export { QUOTE_STATUSES, statusLabel } from "./statuses";

function client() {
  const c = getServiceClient();
  if (!c) throw new Error("Supabase is niet geconfigureerd");
  return c;
}

export type QuoteListFilters = {
  status?: string;
  service?: string;
  /** Naam van de collega, of "geen" voor niet-toegewezen aanvragen. */
  assignee?: string;
  q?: string;
  page?: number;
  pageSize?: number;
};

export async function listQuotes(filters: QuoteListFilters = {}) {
  const pageSize = filters.pageSize ?? 25;
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * pageSize;
  let query = client()
    .from("quote_requests")
    .select("id, created_at, quote_number, status, customer_name, phone, email, city, service, property_type, estimated_size, photo_paths, assigned_to, desired_period", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (filters.status && filters.status !== "alle") query = query.eq("status", filters.status as QuoteStatus);
  if (filters.service && filters.service !== "alle") query = query.eq("service", filters.service);
  if (filters.assignee && filters.assignee !== "alle") {
    query = filters.assignee === "geen" ? query.is("assigned_to", null) : query.eq("assigned_to", filters.assignee);
  }
  if (filters.q) {
    const q = filters.q.replace(/[%,]/g, " ").trim();
    query = query.or(`quote_number.ilike.%${q}%,customer_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,city.ilike.%${q}%,postal_code.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: (data ?? []) as Pick<QuoteRequestRow, "id" | "created_at" | "quote_number" | "status" | "customer_name" | "phone" | "email" | "city" | "service" | "property_type" | "estimated_size" | "photo_paths" | "assigned_to" | "desired_period">[], total: count ?? 0, page, pageSize };
}

export async function getQuote(id: string): Promise<QuoteRequestRow | null> {
  const { data, error } = await client().from("quote_requests").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getQuoteByNumber(quoteNumber: string): Promise<QuoteRequestRow | null> {
  const { data, error } = await client().from("quote_requests").select("*").eq("quote_number", quoteNumber).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listQuoteEvents(quoteId: string): Promise<QuoteEventRow[]> {
  const { data, error } = await client().from("quote_events").select("*").eq("quote_id", quoteId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Tijdelijke, ondertekende URL's voor de privéfoto's van een aanvraag (1 uur geldig). */
export async function signedPhotoUrls(paths: string[]): Promise<{ path: string; url: string | null }[]> {
  if (paths.length === 0) return [];
  const { data, error } = await client().storage.from(STORAGE_BUCKETS.quoteUploads).createSignedUrls(paths, 60 * 60);
  if (error) return paths.map((path) => ({ path, url: null }));
  return paths.map((path) => ({ path, url: data?.find((d) => d.path === path)?.signedUrl ?? null }));
}

export async function listAllQuotesForExport(): Promise<QuoteRequestRow[]> {
  const { data, error } = await client().from("quote_requests").select("*").order("created_at", { ascending: false }).limit(5000);
  if (error) throw error;
  return data ?? [];
}

export async function listMessages(status?: string): Promise<ContactMessageRow[]> {
  let query = client().from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200);
  if (status && status !== "alle") query = query.eq("status", status as "new" | "read" | "replied" | "archived");
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listProjects(): Promise<ProjectRow[]> {
  const { data, error } = await client().from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const { data, error } = await client().from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listReviews(): Promise<ReviewRow[]> {
  const { data, error } = await client().from("reviews").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getSettingsRow(): Promise<SiteSettingsRow | null> {
  const { data, error } = await client().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

/** Kerncijfers voor het overzicht. */
export async function getDashboardStats() {
  const c = client();
  const since7 = new Date(Date.now() - 7 * 86400000).toISOString();
  const since30 = new Date(Date.now() - 30 * 86400000).toISOString();

  // Alles parallel: één rondreis naar Supabase in plaats van acht.
  const [all, newOnes, week, month, won, openMessages, { data: byStatus }, { data: byService }] = await Promise.all([
    c.from("quote_requests").select("id", { count: "exact", head: true }),
    c.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    c.from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", since7),
    c.from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", since30),
    c.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "won"),
    c.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    c.from("quote_requests").select("status"),
    c.from("quote_requests").select("service").gte("created_at", since30),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const r of byStatus ?? []) statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
  const serviceCounts: Record<string, number> = {};
  for (const r of byService ?? []) serviceCounts[r.service] = (serviceCounts[r.service] ?? 0) + 1;

  const total = all.count ?? 0;
  const closed = (statusCounts.won ?? 0) + (statusCounts.lost ?? 0);
  return {
    total,
    newCount: newOnes.count ?? 0,
    weekCount: week.count ?? 0,
    monthCount: month.count ?? 0,
    wonCount: won.count ?? 0,
    conversion: closed > 0 ? Math.round(((statusCounts.won ?? 0) / closed) * 100) : null,
    openMessages: openMessages.count ?? 0,
    statusCounts,
    serviceCounts,
  };
}

export async function recentQuotes(limit = 8) {
  const { data, error } = await client()
    .from("quote_requests")
    .select("id, created_at, quote_number, status, customer_name, city, service, photo_paths")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
