import { getServiceClient, isSupabaseConfigured, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { describeSupabaseEnv } from "@/lib/supabase/env";
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
  const env = describeSupabaseEnv();

  checks.supabaseUrl = env.url
    ? { ok: true, detail: `Gevonden als ${env.url}` }
    : { ok: false, detail: `Ontbreekt. Verwachte naam: ${env.expected.url.join(" of ")}` };

  checks.supabaseAnonKey = env.anonKey
    ? { ok: true, detail: `Gevonden als ${env.anonKey}` }
    : { ok: false, detail: `Ontbreekt. Verwachte naam: ${env.expected.anonKey.join(" of ")}` };

  checks.serviceRoleEnv = env.serviceKey
    ? { ok: true, detail: `Gevonden als ${env.serviceKey}` }
    : { ok: false, detail: `Ontbreekt. Verwachte naam: ${env.expected.serviceKey.join(" of ")}` };

  checks.envNames = {
    ok: true,
    detail: env.presentNames.length ? `Aanwezige variabelen: ${env.presentNames.join(", ")}` : "Geen Supabase/Resend-variabelen gevonden",
  };

  if (!isSupabaseConfigured()) {
    checks.connection = { ok: false, detail: "Geen publieke Supabase-client: URL of anon/publishable key ontbreekt" };
  }

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
    checks.serviceConnection = { ok: false, detail: "Geen service-client: URL of service/secret key ontbreekt" };
  }

  const resendKey = (process.env.RESEND_API_KEY ?? "").trim();
  const notifyTo = (process.env.QUOTE_NOTIFICATION_EMAIL ?? "").trim();
  const emailFrom = (process.env.EMAIL_FROM ?? "").trim();
  checks.resendEnv = resendKey
    ? resendKey.startsWith("re_")
      ? { ok: true, detail: `RESEND_API_KEY aanwezig${notifyTo ? ", notificaties naar ingesteld adres" : ", maar QUOTE_NOTIFICATION_EMAIL is leeg"}${emailFrom ? "" : ", EMAIL_FROM is leeg"}` }
      : { ok: false, detail: "RESEND_API_KEY heeft niet het verwachte formaat (begint normaal met re_)" }
    : "RESEND_API_KEY" in process.env
      ? { ok: false, detail: "RESEND_API_KEY bestaat in Vercel maar is leeg: vul de waarde in en deploy opnieuw" }
      : { ok: false, detail: "RESEND_API_KEY ontbreekt: aanvragen worden wel opgeslagen, maar er gaan geen mails uit" };


  const ok = Object.values(checks).every((c) => c.ok);
  return Response.json({ ok, checks, checkedAt: new Date().toISOString() }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
