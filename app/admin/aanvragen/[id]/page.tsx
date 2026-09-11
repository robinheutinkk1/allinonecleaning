import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getQuote, getQuoteByNumber, getSettingsRow, listQuoteEvents, signedPhotoUrls } from "@/lib/admin/queries";
import { statusLabel } from "@/lib/admin/statuses";
import { AssignForm, DangerZone, NoteForm, StatusForm } from "@/components/admin/QuoteActions";
import { PhotoGallery } from "@/components/admin/PhotoGallery";
import { Card, PageTitle, StatusBadge, btnPrimary, btnSecondary, formatDateTime } from "@/components/admin/ui";
import { getServiceByQuoteKey } from "@/config/services";
import { siteConfig } from "@/config/site";
import { contaminationOptionsFor, labelFor, periodOptions, propertyTypeOptions, sizeOptions, surfaceOptionsFor } from "@/config/quote";

export const metadata: Metadata = { title: "Aanvraag" };

function Row({ label, value, stacked = false }: { label: string; value: React.ReactNode; stacked?: boolean }) {
  return (
    <div className={stacked ? "py-2.5" : "grid gap-1 py-2.5 sm:grid-cols-[160px_1fr] sm:gap-4"}>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-400">{label}</dt>
      <dd className={stacked ? "mt-1 text-sm text-navy-900" : "min-w-0 text-sm text-navy-900"}>{value ?? <span className="text-navy-300">-</span>}</dd>
    </div>
  );
}

export default async function QuoteDetailPage({ params }: PageProps<"/admin/aanvragen/[id]">) {
  const user = await requireAdmin();
  const { id } = await params;
  // De link in de notificatiemail gebruikt het aanvraagnummer (NOVA-2026-0001); zet die om naar het id.
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    const byNumber = await getQuoteByNumber(decodeURIComponent(id).toUpperCase());
    if (!byNumber) notFound();
    redirect(`/admin/aanvragen/${byNumber.id}`);
  }
  const quote = await getQuote(id);
  if (!quote) notFound();
  const [photos, events, settings] = await Promise.all([signedPhotoUrls(quote.photo_paths), listQuoteEvents(quote.id), getSettingsRow()]);
  const team = (settings?.team ?? []).map((m) => m.name);
  const me = (settings?.team ?? []).find((m) => m.email && m.email.toLowerCase() === user.email.toLowerCase())?.name ?? null;

  const service = getServiceByQuoteKey(quote.service);
  const serviceLabel = quote.service === "anders" && quote.service_other ? `Anders: ${quote.service_other}` : (service?.title ?? quote.service);
  const surface = labelFor(surfaceOptionsFor(quote.service), quote.surface_type);
  const contamination = quote.contamination_types.map((c) => labelFor(contaminationOptionsFor(quote.service), c)).join(", ");
  const phoneDigits = quote.phone.replace(/[\s()-]/g, "");
  const waNumber = phoneDigits.replace(/^0/, "31").replace(/^\+/, "");
  const mailSubject = encodeURIComponent(`Uw offerteaanvraag ${quote.quote_number} bij ${siteConfig.companyName}`);

  return (
    <>
      <Link href="/admin/aanvragen" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> Alle aanvragen
      </Link>
      <PageTitle
        title={`${quote.quote_number}`}
        description={`${quote.customer_name} · ontvangen ${formatDateTime(quote.created_at)}`}
        action={
          <>
            <a href={`tel:${phoneDigits}`} className={btnPrimary}>
              <Phone /> Bellen
            </a>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
              <MessageCircle /> WhatsApp
            </a>
            <a href={`mailto:${quote.email}?subject=${mailSubject}`} className={btnSecondary}>
              <Mail /> E-mail
            </a>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Aanvraag">
            <dl className="divide-y divide-navy-100">
              <Row label="Status" value={<StatusBadge status={quote.status} />} />
              <Row label="Dienst" value={serviceLabel} />
              <Row label="Pand" value={labelFor(propertyTypeOptions, quote.property_type)} />
              <Row label="Oppervlak" value={quote.surface_other ? `${surface}: ${quote.surface_other}` : surface} />
              <Row label="Omvang" value={quote.estimated_m2 ? `${labelFor(sizeOptions, quote.estimated_size)} · ±${quote.estimated_m2} m²` : labelFor(sizeOptions, quote.estimated_size)} />
              <Row label="Vervuiling" value={quote.contamination_other ? `${contamination} (${quote.contamination_other})` : contamination} />
              <Row label="Gewenste periode" value={quote.desired_date ? `${labelFor(periodOptions, quote.desired_period)} · ${quote.desired_date}` : labelFor(periodOptions, quote.desired_period)} />
              <Row label="Locatie" value={`${quote.postal_code} ${quote.house_number}, ${quote.city}`} />
              <Row label="Opmerkingen" value={quote.message ? <span className="whitespace-pre-line">{quote.message}</span> : null} />
            </dl>
          </Card>

          <Card title={`Foto's (${quote.photo_paths.length})`}>
            <PhotoGallery photos={photos} />
          </Card>

          <Card title="Notities">
            {quote.admin_notes ? <pre className="mb-5 whitespace-pre-wrap rounded-2xl bg-navy-50 p-4 font-sans text-sm text-navy-800">{quote.admin_notes}</pre> : <p className="mb-5 text-sm text-navy-400">Nog geen notities.</p>}
            <NoteForm quoteId={quote.id} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Contact">
            <dl className="divide-y divide-navy-100">
              <Row stacked label="Naam" value={<span className="font-semibold">{quote.customer_name}</span>} />
              <Row stacked label="Telefoon" value={<a href={`tel:${phoneDigits}`} className="whitespace-nowrap text-gold-700 hover:underline">{quote.phone}</a>} />
              <Row stacked label="E-mail" value={<a href={`mailto:${quote.email}`} className="break-words text-gold-700 hover:underline">{quote.email}</a>} />
              <Row stacked label="Adres" value={`${quote.postal_code} ${quote.house_number}, ${quote.city}`} />
            </dl>
          </Card>

          <Card title="Beheer">
            <div className="space-y-6">
              <StatusForm quoteId={quote.id} status={quote.status} />
              <AssignForm quoteId={quote.id} assignedTo={quote.assigned_to} team={team} me={me} />
            </div>
          </Card>

          <Card title="Activiteit">
            <ol className="space-y-3 text-sm">
              {events.map((e) => (
                <li key={e.id} className="border-l-2 border-navy-100 pl-3">
                  <p className="text-navy-800">
                    {e.type === "status_change" && (
                      <>
                        Status van <strong>{statusLabel(String(e.payload.from))}</strong> naar <strong>{statusLabel(String(e.payload.to))}</strong>
                      </>
                    )}
                    {e.type === "note" && "Notitie toegevoegd"}
                    {e.type === "assign" && (e.payload.to ? `Toegewezen aan ${String(e.payload.to)}` : "Toewijzing verwijderd")}
                    {e.type === "deleted_photos" && `${String(e.payload.count)} foto's verwijderd`}
                    {!["status_change", "note", "assign", "deleted_photos"].includes(e.type) && e.type}
                  </p>
                  <p className="text-xs text-navy-400">
                    {formatDateTime(e.created_at)}
                    {e.actor ? ` · ${e.actor}` : ""}
                  </p>
                </li>
              ))}
              <li className="border-l-2 border-navy-100 pl-3">
                <p className="text-navy-800">Aanvraag ontvangen via de website{quote.utm_source ? ` (${quote.utm_source})` : ""}</p>
                <p className="text-xs text-navy-400">{formatDateTime(quote.created_at)}</p>
              </li>
            </ol>
          </Card>

          <Card title="Gevarenzone">
            <DangerZone quoteId={quote.id} photoCount={quote.photo_paths.length} />
          </Card>
        </div>
      </div>
    </>
  );
}
