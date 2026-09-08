import { getServiceClient, isSupabaseConfigured, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { getClientIp, rateLimit } from "@/lib/utils/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Check = { ok: boolean; detail: string };

/**
 * GET /api/health: controleert de koppelingen zonder geheimen te tonen.
 * Handig direct na het instellen van de env-variabelen in Vercel.
 */
export async function GET(request: Request) {
  const rl = rateLimit(`health:${getClientIp(request)}`, 20, 10 * 60 * 1000);
  if (!rl.ok) return Response.json({ ok: false, error: "Te veel verzoeken." }, { status: 429 });

  const checks: Record<string, Check> = {};

  checks.supabaseEnv = isSupabaseConfigured()
    ? { ok: true, detail: "NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY aanwezig" }
    : { ok: false, detail: "NEXT_PUBLIC_SUPABASE_URL of NEXT_PUBLIC_SUPABASE_ANON_KEY ontbreekt" };

  checks.serviceRoleEnv = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? { ok: true, detail: "SUPABASE_SERVICE_ROLE_KEY aanwezig" }
    : { ok: false, detail: "SUPABASE_SERVICE_ROLE_KEY ontbreekt" };

  const client = getServiceClient();
  if (client) {
    for (const table of ["quote_requests", "contact_messages", "projects"] as const) {
      const { error, count } = await client.from(table).select("id", { count: "exact", head: true });
      checks[`table:${table}`] = error
        ? { ok: false, detail: `Tabel niet bereikbaar: ${error.message}. Is de migratie uitgevoerd?` }
        : { ok: true, detail: `Tabel aanwezig, ${count ?? 0} rijen` };
    }

    const { data: buckets, error: bucketError } = await client.storage.listBuckets();
    const names = new Set((buckets ?? []).map((b) => b.name));
    for (const bucket of Object.values(STORAGE_BUCKETS)) {
      checks[`bucket:${bucket}`] = bucketError
        ? { ok: false, detail: bucketError.message }
        : names.has(bucket)
          ? { ok: true, detail: `Bucket aanwezig${bucket === STORAGE_BUCKETS.quoteUploads ? (buckets?.find((b) => b.name === bucket)?.public ? ", LET OP: staat op publiek" : ", privé") : ""}` }
          : { ok: false, detail: "Bucket ontbreekt. Is de migratie uitgevoerd?" };
    }
  } else {
    checks.connection = { ok: false, detail: "Geen Supabase-client: env-variabelen ontbreken" };
  }

  checks.resendEnv = process.env.RESEND_API_KEY
    ? { ok: true, detail: `RESEND_API_KEY aanwezig, notificaties naar ${process.env.QUOTE_NOTIFICATION_EMAIL ? "ingesteld adres" : "GEEN adres (QUOTE_NOTIFICATION_EMAIL ontbreekt)"}` }
    : { ok: false, detail: "RESEND_API_KEY ontbreekt: aanvragen worden wel opgeslagen, maar er gaan geen mails uit" };

  const ok = Object.values(checks).every((c) => c.ok);
  return Response.json({ ok, checks, checkedAt: new Date().toISOString() }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
