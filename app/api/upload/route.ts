import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { uploadConfig } from "@/config/quote";
import { getServiceClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import { getClientIp, jsonError, rateLimit } from "@/lib/utils/request";

export const runtime = "nodejs";

/**
 * POST /api/upload  (multipart/form-data: file, session)
 *
 * - Valideert type (magic bytes), grootte en aantal.
 * - Hercodeert de afbeelding met sharp → EXIF (incl. GPS) wordt gestript,
 *   ongeldige bestanden falen hier, en de opslag blijft compact (webp).
 * - Slaat op in de PRIVÉ bucket `quote-uploads/<session>/<uuid>.webp`.
 * - Geeft alleen het pad terug (geen publieke URL — de bucket is niet publiek).
 */

const SESSION_RE = /^[a-f0-9]{32}$/;

function sniffMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`upload:${ip}`, 40, 10 * 60 * 1000);
  if (!rl.ok) return jsonError("Te veel uploads. Probeer het over een paar minuten opnieuw.", 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Ongeldige upload.");
  }

  const file = form.get("file");
  const session = String(form.get("session") ?? "");

  if (!(file instanceof File)) return jsonError("Geen bestand ontvangen.");
  if (!SESSION_RE.test(session)) return jsonError("Ongeldige sessie.");
  if (file.size === 0) return jsonError("Het bestand is leeg.");
  if (file.size > uploadConfig.maxFileSizeBytes) {
    return jsonError(`Het bestand is te groot (max. ${Math.round(uploadConfig.maxFileSizeBytes / 1024 / 1024)} MB).`, 413);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buffer);
  if (!mime || !(uploadConfig.acceptedMimeTypes as readonly string[]).includes(mime)) {
    return jsonError("Alleen JPG, PNG of WEBP foto's zijn toegestaan.", 415);
  }

  let processed: Buffer;
  try {
    processed = await sharp(buffer, { failOn: "error", limitInputPixels: 50_000_000 })
      .rotate() // EXIF-oriëntatie toepassen, daarna wordt EXIF weggelaten
      .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return jsonError("De foto kon niet worden verwerkt. Probeer een andere foto.", 422);
  }

  const path = `${session}/${randomUUID()}.webp`;
  const client = getServiceClient();

  if (!client) {
    // Lokale ontwikkeling zonder Supabase: gedrag simuleren zodat de wizard testbaar is.
    if (process.env.NODE_ENV !== "production") {
      return Response.json({ ok: true, path, stored: false });
    }
    return jsonError("Uploaden is tijdelijk niet mogelijk. Probeer het later opnieuw.", 503);
  }

  const { error } = await client.storage.from(STORAGE_BUCKETS.quoteUploads).upload(path, processed, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("[upload] storage error:", error.message);
    return jsonError("Er ging iets mis bij het uploaden. Probeer het opnieuw.", 500);
  }

  return Response.json({ ok: true, path, stored: true });
}

export async function DELETE(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`upload-del:${ip}`, 60, 10 * 60 * 1000);
  if (!rl.ok) return jsonError("Te veel verzoeken.", 429);

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Ongeldig verzoek.");
  }
  const path = body.path ?? "";
  if (!/^[a-f0-9]{32}\/[a-f0-9-]{36}\.webp$/.test(path)) return jsonError("Ongeldig pad.");

  const client = getServiceClient();
  if (!client) return Response.json({ ok: true });

  const { error } = await client.storage.from(STORAGE_BUCKETS.quoteUploads).remove([path]);
  if (error) console.error("[upload] delete error:", error.message);
  return Response.json({ ok: true });
}
