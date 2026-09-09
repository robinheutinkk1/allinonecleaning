"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/ssr";
import { getServiceClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { isAllowedEmail, requireAdmin } from "@/lib/admin/auth";
import { getQuote } from "@/lib/admin/queries";
import { syncGoogleReviews } from "@/lib/google/sync";
import { QUOTE_STATUSES } from "@/lib/admin/statuses";
import type { QuoteStatus } from "@/lib/supabase/types";

/**
 * Server actions voor het dashboard. Elke actie controleert eerst de sessie.
 * Resultaat: { ok: true } of { ok: false, error: "…" } zodat formulieren
 * nette meldingen kunnen tonen.
 */

export type ActionResult = { ok: true; message?: string; id?: string } | { ok: false; error: string };

function svc() {
  const c = getServiceClient();
  if (!c) throw new Error("Supabase is niet geconfigureerd");
  return c;
}

function revalidateSite() {
  revalidateTag("site-settings", "max");
  revalidateTag("reviews", "max");
  revalidateTag("projects", "max");
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signInAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("volgende") ?? "/admin");
  if (!email || !password) return { ok: false, error: "Vul uw e-mailadres en wachtwoord in." };
  if (!isAllowedEmail(email)) return { ok: false, error: "Dit e-mailadres heeft geen toegang tot het dashboard." };

  const supabase = await createSessionClient();
  if (!supabase) return { ok: false, error: "Supabase is niet geconfigureerd." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "Inloggen mislukt. Controleer uw e-mailadres en wachtwoord." };
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase?.auth.signOut();
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Aanvragen
// ---------------------------------------------------------------------------

async function logEvent(quoteId: string, type: string, actor: string, payload: Record<string, unknown> = {}) {
  await svc().from("quote_events").insert({ quote_id: quoteId, type, actor, payload });
}

export async function updateQuoteStatus(quoteId: string, status: string): Promise<ActionResult> {
  const user = await requireAdmin();
  if (!QUOTE_STATUSES.some((s) => s.value === status)) return { ok: false, error: "Ongeldige status." };
  const current = await getQuote(quoteId);
  if (!current) return { ok: false, error: "Aanvraag niet gevonden." };
  const { error } = await svc().from("quote_requests").update({ status: status as QuoteStatus }).eq("id", quoteId);
  if (error) return { ok: false, error: error.message };
  await logEvent(quoteId, "status_change", user.email, { from: current.status, to: status });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Status bijgewerkt." };
}

export async function addQuoteNote(quoteId: string, note: string): Promise<ActionResult> {
  const user = await requireAdmin();
  const text = note.trim();
  if (!text) return { ok: false, error: "Schrijf eerst een notitie." };
  if (text.length > 4000) return { ok: false, error: "Notitie is te lang." };
  const current = await getQuote(quoteId);
  if (!current) return { ok: false, error: "Aanvraag niet gevonden." };
  const stamp = new Date().toLocaleString("nl-NL", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Amsterdam" });
  const combined = `${current.admin_notes ? current.admin_notes + "\n\n" : ""}[${stamp} · ${user.email}]\n${text}`;
  const { error } = await svc().from("quote_requests").update({ admin_notes: combined }).eq("id", quoteId);
  if (error) return { ok: false, error: error.message };
  await logEvent(quoteId, "note", user.email, { note: text });
  revalidatePath(`/admin/aanvragen/${quoteId}`);
  return { ok: true, message: "Notitie toegevoegd." };
}

export async function assignQuote(quoteId: string, assignee: string): Promise<ActionResult> {
  const user = await requireAdmin();
  const value = assignee.trim().slice(0, 120) || null;
  const { error } = await svc().from("quote_requests").update({ assigned_to: value }).eq("id", quoteId);
  if (error) return { ok: false, error: error.message };
  await logEvent(quoteId, "assign", user.email, { to: value });
  revalidatePath("/admin", "layout");
  return { ok: true, message: value ? `Toegewezen aan ${value}.` : "Toewijzing verwijderd." };
}

export async function deleteQuotePhotos(quoteId: string): Promise<ActionResult> {
  const user = await requireAdmin();
  const current = await getQuote(quoteId);
  if (!current) return { ok: false, error: "Aanvraag niet gevonden." };
  if (current.photo_paths.length) {
    const { error } = await svc().storage.from(STORAGE_BUCKETS.quoteUploads).remove(current.photo_paths);
    if (error) return { ok: false, error: error.message };
  }
  await svc().from("quote_requests").update({ photo_paths: [] }).eq("id", quoteId);
  await logEvent(quoteId, "deleted_photos", user.email, { count: current.photo_paths.length });
  revalidatePath(`/admin/aanvragen/${quoteId}`);
  return { ok: true, message: "Foto's verwijderd." };
}

export async function deleteQuote(quoteId: string): Promise<ActionResult> {
  await requireAdmin();
  const current = await getQuote(quoteId);
  if (!current) return { ok: false, error: "Aanvraag niet gevonden." };
  if (current.photo_paths.length) await svc().storage.from(STORAGE_BUCKETS.quoteUploads).remove(current.photo_paths);
  const { error } = await svc().from("quote_requests").delete().eq("id", quoteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin", "layout");
  redirect("/admin/aanvragen?melding=verwijderd");
}

// ---------------------------------------------------------------------------
// Berichten
// ---------------------------------------------------------------------------

export async function updateMessageStatus(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  if (!["new", "read", "replied", "archived"].includes(status)) return { ok: false, error: "Ongeldige status." };
  const { error } = await svc().from("contact_messages").update({ status: status as "new" | "read" | "replied" | "archived" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  const { error } = await svc().from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/berichten");
  return { ok: true, message: "Bericht verwijderd." };
}

// ---------------------------------------------------------------------------
// Projecten
// ---------------------------------------------------------------------------

const projectSchema = z.object({
  title: z.string().trim().min(3, "Titel is te kort").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten")
    .max(120),
  service: z.string().trim().min(1, "Kies een dienst"),
  location: z.string().trim().max(120).optional().nullable(),
  description: z.string().trim().max(1500).optional().nullable(),
  result: z.string().trim().max(600).optional().nullable(),
  before_alt: z.string().trim().max(200).optional().nullable(),
  after_alt: z.string().trim().max(200).optional().nullable(),
  published: z.boolean(),
  featured: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

async function uploadProjectImage(file: File, slug: string, kind: "voor" | "na"): Promise<string> {
  if (file.size > 15 * 1024 * 1024) throw new Error("Afbeelding is groter dan 15 MB");
  const buffer = Buffer.from(await file.arrayBuffer());
  const processed = await sharp(buffer, { failOn: "error", limitInputPixels: 80_000_000 })
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  const path = `${slug}/${kind}-${randomUUID().slice(0, 8)}.jpg`;
  const { error } = await svc().storage.from(STORAGE_BUCKETS.projectImages).upload(path, processed, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

export async function saveProject(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    service: formData.get("service"),
    location: formData.get("location") || null,
    description: formData.get("description") || null,
    result: formData.get("result") || null,
    before_alt: formData.get("before_alt") || null,
    after_alt: formData.get("after_alt") || null,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Controleer de invoer." };
  const data = parsed.data;

  try {
    const beforeFile = formData.get("before_file");
    const afterFile = formData.get("after_file");
    let before_image = String(formData.get("before_image") ?? "");
    let after_image = String(formData.get("after_image") ?? "");
    if (beforeFile instanceof File && beforeFile.size > 0) before_image = await uploadProjectImage(beforeFile, data.slug, "voor");
    if (afterFile instanceof File && afterFile.size > 0) after_image = await uploadProjectImage(afterFile, data.slug, "na");
    if (!before_image || !after_image) return { ok: false, error: "Upload zowel een voor- als een na-foto." };

    const payload = {
      title: data.title,
      slug: data.slug,
      service: data.service,
      location: data.location ?? null,
      description: data.description ?? null,
      result: data.result ?? null,
      before_alt: data.before_alt ?? null,
      after_alt: data.after_alt ?? null,
      published: data.published,
      featured: data.featured,
      sort_order: data.sort_order,
      before_image,
      after_image,
      gallery_images: null,
    };
    if (id) {
      const { error } = await svc().from("projects").update(payload).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data: row, error } = await svc().from("projects").insert(payload).select("id").single();
      if (error) return { ok: false, error: error.message.includes("duplicate") ? "Deze slug bestaat al." : error.message };
      revalidateSite();
      revalidatePath("/admin/projecten");
      redirect(`/admin/projecten/${row.id}?melding=opgeslagen`);
    }
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e; // redirect doorlaten
    return { ok: false, error: e instanceof Error ? e.message : "Opslaan mislukt." };
  }
  revalidateSite();
  revalidatePath("/admin/projecten");
  return { ok: true, message: "Project opgeslagen." };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const { data: project } = await svc().from("projects").select("before_image, after_image").eq("id", id).maybeSingle();
  const { error } = await svc().from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  const paths = [project?.before_image, project?.after_image].filter((p): p is string => Boolean(p) && !p!.startsWith("http") && !p!.startsWith("/"));
  if (paths.length) await svc().storage.from(STORAGE_BUCKETS.projectImages).remove(paths);
  revalidateSite();
  revalidatePath("/admin/projecten");
  redirect("/admin/projecten?melding=verwijderd");
}

export async function toggleProjectFlag(id: string, field: "published" | "featured", value: boolean): Promise<ActionResult> {
  await requireAdmin();
  const patch = field === "published" ? { published: value } : { featured: value };
  const { error } = await svc().from("projects").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateSite();
  revalidatePath("/admin/projecten");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

const reviewSchema = z.object({
  author: z.string().trim().min(2, "Naam is te kort").max(80),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(5, "Tekst is te kort").max(1500),
  source: z.string().trim().min(1).max(40),
  review_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  published: z.boolean(),
  featured: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export async function saveReview(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  // Google-reviews: inhoud komt van Google, alleen zichtbaarheid en volgorde zijn aanpasbaar.
  if (id) {
    const { data: existing } = await svc().from("reviews").select("google_review_id").eq("id", id).maybeSingle();
    if (existing?.google_review_id) {
      const { error } = await svc()
        .from("reviews")
        .update({ published: formData.get("published") === "on", featured: formData.get("featured") === "on", sort_order: Number(formData.get("sort_order") ?? 0) || 0 })
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      revalidateSite();
      revalidatePath("/admin/reviews");
      return { ok: true, message: "Review opgeslagen." };
    }
  }

  const parsed = reviewSchema.safeParse({
    author: formData.get("author"),
    rating: Number(formData.get("rating")),
    text: formData.get("text"),
    source: formData.get("source") || "Google",
    review_date: formData.get("review_date") || null,
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Controleer de invoer." };
  const review = { ...parsed.data, review_date: parsed.data.review_date ?? null };
  const { error } = id ? await svc().from("reviews").update(review).eq("id", id) : await svc().from("reviews").insert(review);
  if (error) return { ok: false, error: error.message };
  revalidateSite();
  revalidatePath("/admin/reviews");
  return { ok: true, message: "Review opgeslagen." };
}

/** Google-reviews kunnen niet verwijderd worden (komen bij verversing terug), wel verborgen. */
export async function toggleReviewPublished(id: string, published: boolean): Promise<ActionResult> {
  await requireAdmin();
  const { error } = await svc().from("reviews").update({ published }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateSite();
  revalidatePath("/admin/reviews");
  return { ok: true };
}

/** Knop "Google-reviews ophalen" in het dashboard. */
export async function syncGoogleReviewsAction(): Promise<ActionResult> {
  await requireAdmin();
  try {
    const r = await syncGoogleReviews();
    const parts = [`${r.received} reviews ontvangen van Google`, `${r.imported} nieuw`, `${r.updated} bijgewerkt`];
    if (r.skipped) parts.push(`${r.skipped} zonder tekst overgeslagen`);
    const score = r.rating !== null && r.reviewCount !== null ? ` Gemiddelde ${r.rating.toFixed(1)} op basis van ${r.reviewCount} reviews.` : "";
    return { ok: true, message: `${parts.join(", ")}.${score}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ophalen mislukt." };
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  await requireAdmin();
  const { error } = await svc().from("reviews").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateSite();
  revalidatePath("/admin/reviews");
  return { ok: true, message: "Review verwijderd." };
}

// ---------------------------------------------------------------------------
// Instellingen
// ---------------------------------------------------------------------------

const optionalText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

const settingsSchema = z.object({
  phone: optionalText(30),
  email: z.union([z.literal(""), z.string().trim().email("Ongeldig e-mailadres")]).optional().nullable().transform((v) => (v ? v : null)),
  whatsapp: optionalText(30),
  street: optionalText(120),
  postal_code: optionalText(10),
  city: optionalText(80),
  kvk: optionalText(20),
  btw: optionalText(30),
  social_instagram: optionalText(200),
  social_facebook: optionalText(200),
  social_linkedin: optionalText(200),
  social_google: optionalText(300),
  google_reviews_url: optionalText(300),
  google_rating: z.number().min(1).max(5).optional().nullable(),
  google_review_count: z.number().int().min(0).optional().nullable(),
  notification_email: z.union([z.literal(""), z.string().trim().email("Ongeldig e-mailadres")]).optional().nullable().transform((v) => (v ? v : null)),
  hero_video_enabled: z.boolean(),
  work_areas: z.array(z.string().trim().min(1).max(60)).max(30),
  opening_hours: z.array(z.object({ days: z.string().trim().min(1).max(30), hours: z.string().trim().min(1).max(30) })).max(7),
  stats: z.array(z.object({ label: z.string().trim().min(1).max(60), value: z.string().trim().min(1).max(20) })).max(4),
  team: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Naam van een collega ontbreekt").max(60),
        email: z.union([z.literal(""), z.string().trim().email("Ongeldig e-mailadres bij een collega")]).transform((v) => (v ? v.toLowerCase() : null)),
      }),
    )
    .max(25),
});

/** "Naam | e-mail" per regel; e-mail mag ontbreken. */
function parseTeam(value: FormDataEntryValue | null): { name: string; email: string }[] {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.split("|").map((s) => s.trim()))
    .filter((parts) => parts[0])
    .map(([name, email]) => ({ name, email: email ?? "" }));
}

function parseLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePairs(value: FormDataEntryValue | null, keys: [string, string]): Record<string, string>[] {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.split("|").map((s) => s.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map(([a, b]) => ({ [keys[0]]: a, [keys[1]]: b }));
}

export async function saveSettings(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const num = (v: FormDataEntryValue | null) => (v === null || v === "" ? null : Number(v));
  const parsed = settingsSchema.safeParse({
    phone: formData.get("phone"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    street: formData.get("street"),
    postal_code: formData.get("postal_code"),
    city: formData.get("city"),
    kvk: formData.get("kvk"),
    btw: formData.get("btw"),
    social_instagram: formData.get("social_instagram"),
    social_facebook: formData.get("social_facebook"),
    social_linkedin: formData.get("social_linkedin"),
    social_google: formData.get("social_google"),
    google_reviews_url: formData.get("google_reviews_url"),
    google_rating: num(formData.get("google_rating")),
    google_review_count: num(formData.get("google_review_count")),
    notification_email: formData.get("notification_email"),
    hero_video_enabled: formData.get("hero_video_enabled") === "on",
    work_areas: parseLines(formData.get("work_areas")),
    opening_hours: parsePairs(formData.get("opening_hours"), ["days", "hours"]),
    stats: parsePairs(formData.get("stats"), ["label", "value"]),
    team: parseTeam(formData.get("team")),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Controleer de invoer." };

  const { error } = await svc()
    .from("site_settings")
    .upsert({
      id: 1,
      ...parsed.data,
      opening_hours: parsed.data.opening_hours as { days: string; hours: string }[],
      stats: parsed.data.stats as { label: string; value: string }[],
      team: parsed.data.team as { name: string; email: string | null }[],
    });
  if (error) return { ok: false, error: error.message };
  revalidateSite();
  revalidatePath("/admin/instellingen");
  return { ok: true, message: "Instellingen opgeslagen. De website is bijgewerkt." };
}
