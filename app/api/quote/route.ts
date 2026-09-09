import { siteConfig } from "@/config/site";
import { quoteRequestSchema } from "@/lib/validation/quote";
import { getServiceClient } from "@/lib/supabase/server";
import { sendQuoteConfirmation, sendQuoteNotification } from "@/lib/email";
import { fallbackQuoteNumber } from "@/lib/utils/quote-number";
import { getClientIp, hashIp, jsonError, pruneRateLimits, rateLimit } from "@/lib/utils/request";

export const runtime = "nodejs";

/**
 * POST /api/quote - offerteaanvraag opslaan + e-mails versturen.
 *
 * 1. Rate limit per IP
 * 2. Zod-validatie (server-side, identiek aan client-regels)
 * 3. Honeypot
 * 4. Insert in Supabase (service role) → quote_number via DB-functie
 * 5. Mails (nooit blokkerend voor de aanvraag)
 */
export async function POST(request: Request) {
  pruneRateLimits();
  const ip = getClientIp(request);
  const rl = rateLimit(`quote:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return jsonError("U heeft al meerdere aanvragen gedaan. Probeer het over een kwartier opnieuw.", 429);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError("Ongeldige aanvraag.");
  }

  const parsed = quoteRequestSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return jsonError("Controleer uw gegevens.", 422, { fieldErrors });
  }

  const data = parsed.data;

  // Honeypot gevuld → doe alsof het gelukt is, maar sla niets op.
  if (data.website) {
    return Response.json({ ok: true, quoteNumber: fallbackQuoteNumber(siteConfig.quotePrefix) });
  }

  const client = getServiceClient();
  let quoteNumber: string;

  if (client) {
    const { data: row, error } = await client
      .from("quote_requests")
      .insert({
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email,
        address: null,
        postal_code: data.postalCode,
        house_number: data.houseNumber,
        city: data.city,
        service: data.service,
        service_other: data.serviceOther ?? null,
        property_type: data.propertyType,
        surface_type: data.surfaceType,
        surface_other: data.surfaceOther ?? null,
        estimated_size: data.estimatedSize,
        estimated_m2: data.estimatedM2 ?? null,
        contamination_types: data.contaminationTypes,
        contamination_other: data.contaminationOther ?? null,
        desired_period: data.desiredPeriod,
        desired_date: data.desiredDate ?? null,
        message: data.message ?? null,
        photo_paths: data.photoPaths,
        source: "website",
        utm_source: data.utm?.source ?? null,
        utm_medium: data.utm?.medium ?? null,
        utm_campaign: data.utm?.campaign ?? null,
        admin_notes: null,
        assigned_to: null,
        privacy_accepted_at: new Date().toISOString(),
        ip_hash: hashIp(ip),
        user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      })
      .select("quote_number")
      .single();

    if (error || !row) {
      console.error("[quote] insert error:", error?.message);
      return jsonError("Er ging iets mis bij het verzenden. Probeer het opnieuw.", 500);
    }
    quoteNumber = row.quote_number;
  } else {
    if (process.env.NODE_ENV === "production") {
      console.error("[quote] Supabase niet geconfigureerd in productie.");
      return jsonError("Het aanvragen is tijdelijk niet mogelijk. Probeer het later opnieuw.", 503);
    }
    quoteNumber = fallbackQuoteNumber(siteConfig.quotePrefix);
    console.info("[quote] (dev, geen Supabase) aanvraag ontvangen:", quoteNumber, {
      ...data,
      email: "***",
      phone: "***",
    });
  }

  // E-mails: fouten loggen, aanvraag is al veilig opgeslagen.
  // Dashboard-link: ADMIN_URL of standaard <site>/admin. De detailpagina accepteert ook het aanvraagnummer.
  const adminBase = (process.env.ADMIN_URL?.trim() || `${siteConfig.url}/admin`).replace(/\/+$/, "");
  const [notify, confirm] = await Promise.all([
    sendQuoteNotification({ quoteNumber, data, adminLink: `${adminBase}/aanvragen/${quoteNumber}` }),
    sendQuoteConfirmation({ quoteNumber, data }),
  ]);
  if (!notify.sent) console.warn("[quote] notificatiemail niet verstuurd:", notify.reason);
  if (!confirm.sent) console.warn("[quote] bevestigingsmail niet verstuurd:", confirm.reason);

  return Response.json({ ok: true, quoteNumber });
}
