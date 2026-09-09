import { getAdminUser } from "@/lib/admin/auth";
import { listAllQuotesForExport } from "@/lib/admin/queries";
import { statusLabel } from "@/lib/admin/statuses";
import { getServiceByQuoteKey } from "@/config/services";
import { labelFor, periodOptions, propertyTypeOptions, sizeOptions } from "@/config/quote";

export const dynamic = "force-dynamic";

/** GET /admin/aanvragen/export: alle aanvragen als CSV (Excel-vriendelijk, UTF-8 met BOM). */
export async function GET() {
  const user = await getAdminUser();
  if (!user) return new Response("Niet ingelogd", { status: 401 });

  const rows = await listAllQuotesForExport();
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ["Nummer", "Ontvangen", "Status", "Naam", "Telefoon", "E-mail", "Postcode", "Huisnummer", "Plaats", "Dienst", "Pand", "Omvang", "m²", "Vervuiling", "Periode", "Gewenste datum", "Foto's", "Toegewezen", "Opmerkingen", "Notities"];
  const lines = rows.map((q) =>
    [
      q.quote_number,
      new Date(q.created_at).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" }),
      statusLabel(q.status),
      q.customer_name,
      q.phone,
      q.email,
      q.postal_code,
      q.house_number,
      q.city,
      q.service === "anders" && q.service_other ? `Anders: ${q.service_other}` : (getServiceByQuoteKey(q.service)?.title ?? q.service),
      labelFor(propertyTypeOptions, q.property_type),
      labelFor(sizeOptions, q.estimated_size),
      q.estimated_m2 ?? "",
      q.contamination_types.join(", "),
      labelFor(periodOptions, q.desired_period),
      q.desired_date ?? "",
      q.photo_paths.length,
      q.assigned_to ?? "",
      q.message ?? "",
      q.admin_notes ?? "",
    ]
      .map(esc)
      .join(";"),
  );
  const csv = "﻿" + [header.join(";"), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aanvragen-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
