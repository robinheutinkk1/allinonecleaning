import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { getServiceByQuoteKey } from "@/config/services";
import {
  labelFor,
  serviceOptions,
  propertyTypeOptions,
  sizeOptions,
  periodOptions,
  surfaceOptionsFor,
  contaminationOptionsFor,
} from "@/config/quote";
import type { QuoteRequestData } from "@/lib/validation/quote";
import type { ContactData } from "@/lib/validation/contact";

/**
 * E-mailarchitectuur (Resend).
 *
 * - Interne notificatie bij nieuwe offerteaanvraag en contactbericht.
 * - Optionele bevestigingsmail naar de klant.
 *
 * Zonder RESEND_API_KEY worden mails niet verstuurd maar wordt de aanvraag
 * WEL opgeslagen. Mailfouten blokkeren nooit een succesvolle aanvraag.
 */

const FROM = process.env.EMAIL_FROM ?? "All in One Vastgoedonderhoud <onboarding@resend.dev>";
const NOTIFY_TO = process.env.QUOTE_NOTIFICATION_EMAIL ?? null;
const SEND_CUSTOMER_CONFIRMATION = process.env.SEND_CUSTOMER_CONFIRMATION !== "false";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function row(label: string, value: string | null | undefined) {
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #e1e8f0;color:#5f7ca3;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #e1e8f0;color:#111c30;font-size:14px">${escapeHtml(value) || "-"}</td>
  </tr>`;
}

function layout(title: string, body: string) {
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#f2f5f9;font-family:Inter,Arial,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px">
    <div style="background:#111c30;border-radius:16px 16px 0 0;padding:20px 24px;color:#fff">
      <img src="${siteConfig.url}/images/logo-inverted.png" alt="${escapeHtml(siteConfig.companyName)}" width="120" height="74" style="display:block;height:74px;width:auto" />
      <div style="color:#ecc76a;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-top:10px">${escapeHtml(siteConfig.tagline)}</div>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:24px">
      <h1 style="font-size:20px;margin:0 0 16px;color:#111c30">${escapeHtml(title)}</h1>
      ${body}
    </div>
    <p style="color:#94a9c4;font-size:12px;text-align:center;margin-top:16px">${escapeHtml(siteConfig.companyName)} · ${escapeHtml(siteConfig.city)}</p>
  </div></body></html>`;
}

export function summarizeQuote(data: QuoteRequestData) {
  const service = getServiceByQuoteKey(data.service);
  const serviceLabel =
    data.service === "anders" && data.serviceOther
      ? `Anders: ${data.serviceOther}`
      : (service?.title ?? labelFor(serviceOptions, data.service));
  const surface = labelFor(surfaceOptionsFor(data.service), data.surfaceType);
  const surfaceLabel = data.surfaceType === "anders" && data.surfaceOther ? `${surface}: ${data.surfaceOther}` : surface;
  const contamination = data.contaminationTypes.map((c) => labelFor(contaminationOptionsFor(data.service), c)).join(", ");
  const contaminationLabel =
    data.contaminationTypes.includes("anders") && data.contaminationOther
      ? `${contamination} (${data.contaminationOther})`
      : contamination;
  const sizeLabel = data.estimatedM2 ? `${labelFor(sizeOptions, data.estimatedSize)} · ±${data.estimatedM2} m²` : labelFor(sizeOptions, data.estimatedSize);
  const periodLabel = data.desiredDate ? `${labelFor(periodOptions, data.desiredPeriod)} · gewenst: ${data.desiredDate}` : labelFor(periodOptions, data.desiredPeriod);

  return {
    serviceLabel,
    propertyLabel: labelFor(propertyTypeOptions, data.propertyType),
    surfaceLabel,
    sizeLabel,
    contaminationLabel,
    periodLabel,
    location: `${data.postalCode} ${data.houseNumber}, ${data.city}`,
    photoCount: data.photoPaths.length,
  };
}

export async function sendQuoteNotification(opts: {
  quoteNumber: string;
  data: QuoteRequestData;
  adminLink?: string | null;
}): Promise<{ sent: boolean; reason?: string }> {
  const resend = getResend();
  if (!resend) return { sent: false, reason: "RESEND_API_KEY ontbreekt" };
  if (!NOTIFY_TO) return { sent: false, reason: "QUOTE_NOTIFICATION_EMAIL ontbreekt" };

  const s = summarizeQuote(opts.data);
  const d = opts.data;
  const body = `
    <p style="color:#3d5a84;font-size:14px;margin:0 0 16px">Er is een nieuwe offerteaanvraag binnengekomen via de website.</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e1e8f0;border-radius:12px;overflow:hidden">
      ${row("Aanvraagnummer", opts.quoteNumber)}
      ${row("Naam", d.customerName)}
      ${row("Telefoon", d.phone)}
      ${row("E-mail", d.email)}
      ${row("Dienst", s.serviceLabel)}
      ${row("Pand", s.propertyLabel)}
      ${row("Oppervlak", s.surfaceLabel)}
      ${row("Omvang", s.sizeLabel)}
      ${row("Vervuiling", s.contaminationLabel)}
      ${row("Locatie", s.location)}
      ${row("Gewenste periode", s.periodLabel)}
      ${row("Opmerkingen", d.message)}
      ${row("Aantal foto's", String(s.photoCount))}
    </table>
    ${
      opts.adminLink
        ? `<p style="margin:20px 0 0"><a href="${escapeHtml(opts.adminLink)}" style="display:inline-block;background:#d9a23a;color:#0a1120;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Bekijk aanvraag</a></p>`
        : `<p style="color:#94a9c4;font-size:12px;margin:16px 0 0">Foto's staan in de beveiligde opslag en zijn te bekijken via het dashboard.</p>`
    }`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: d.email,
      subject: `Nieuwe offerteaanvraag ${opts.quoteNumber}`,
      html: layout(`Nieuwe offerteaanvraag ${opts.quoteNumber}`, body),
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "unknown" };
  }
}

export async function sendQuoteConfirmation(opts: {
  quoteNumber: string;
  data: QuoteRequestData;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!SEND_CUSTOMER_CONFIRMATION) return { sent: false, reason: "uitgeschakeld" };
  const resend = getResend();
  if (!resend) return { sent: false, reason: "RESEND_API_KEY ontbreekt" };

  const s = summarizeQuote(opts.data);
  const d = opts.data;
  const firstName = d.customerName.split(" ")[0];
  const body = `
    <p style="color:#3d5a84;font-size:15px;line-height:1.6;margin:0 0 16px">Beste ${escapeHtml(firstName)},</p>
    <p style="color:#3d5a84;font-size:15px;line-height:1.6;margin:0 0 16px">Bedankt voor uw offerteaanvraag. Wij hebben uw aanvraag goed ontvangen en bekijken deze persoonlijk. Daarna nemen wij contact met u op.</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e1e8f0;border-radius:12px;overflow:hidden">
      ${row("Aanvraagnummer", opts.quoteNumber)}
      ${row("Dienst", s.serviceLabel)}
      ${row("Pand", s.propertyLabel)}
      ${row("Locatie", s.location)}
      ${row("Gewenste periode", s.periodLabel)}
      ${row("Foto's", `${s.photoCount} toegevoegd`)}
    </table>
    <p style="color:#3d5a84;font-size:15px;line-height:1.6;margin:20px 0 0">Heeft u nog vragen of wilt u iets aanvullen? Beantwoord dan deze e-mail en vermeld uw aanvraagnummer.</p>
    <p style="color:#3d5a84;font-size:15px;line-height:1.6;margin:16px 0 0">Met vriendelijke groet,<br><strong>${escapeHtml(siteConfig.companyName)}</strong><br><span style="color:#94a9c4">${escapeHtml(siteConfig.tagline)} · ${escapeHtml(siteConfig.city)}</span></p>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: d.email,
      ...(NOTIFY_TO ? { replyTo: NOTIFY_TO } : {}),
      subject: "Uw offerteaanvraag bij All in One Vastgoedonderhoud",
      html: layout("Uw offerteaanvraag is ontvangen", body),
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "unknown" };
  }
}

export async function sendContactNotification(data: ContactData): Promise<{ sent: boolean; reason?: string }> {
  const resend = getResend();
  if (!resend) return { sent: false, reason: "RESEND_API_KEY ontbreekt" };
  if (!NOTIFY_TO) return { sent: false, reason: "QUOTE_NOTIFICATION_EMAIL ontbreekt" };

  const body = `
    <table style="width:100%;border-collapse:collapse;border:1px solid #e1e8f0;border-radius:12px;overflow:hidden">
      ${row("Naam", data.name)}
      ${row("E-mail", data.email)}
      ${row("Telefoon", data.phone)}
      ${row("Bericht", data.message)}
    </table>`;
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: data.email,
      subject: `Nieuw bericht via de website van ${data.name}`,
      html: layout("Nieuw contactbericht", body),
    });
    if (error) return { sent: false, reason: error.message };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "unknown" };
  }
}
