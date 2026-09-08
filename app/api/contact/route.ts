import { contactSchema } from "@/lib/validation/contact";
import { getServiceClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/email";
import { getClientIp, hashIp, jsonError, rateLimit } from "@/lib/utils/request";

export const runtime = "nodejs";

/** POST /api/contact - eenvoudig contactformulier. */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) return jsonError("U heeft al meerdere berichten verstuurd. Probeer het later opnieuw.", 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError("Ongeldig bericht.");
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return jsonError("Controleer uw gegevens.", 422, { fieldErrors });
  }

  const data = parsed.data;
  if (data.website) return Response.json({ ok: true }); // honeypot

  const client = getServiceClient();
  if (client) {
    const { error } = await client.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      ip_hash: hashIp(ip),
    });
    if (error) {
      console.error("[contact] insert error:", error.message);
      return jsonError("Er ging iets mis bij het verzenden. Probeer het opnieuw.", 500);
    }
  } else if (process.env.NODE_ENV === "production") {
    return jsonError("Het versturen is tijdelijk niet mogelijk. Probeer het later opnieuw.", 503);
  } else {
    console.info("[contact] (dev, geen Supabase) bericht ontvangen van", data.name);
  }

  const mail = await sendContactNotification(data);
  if (!mail.sent) console.warn("[contact] notificatiemail niet verstuurd:", mail.reason);

  return Response.json({ ok: true });
}
