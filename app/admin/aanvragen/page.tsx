import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Camera, Download } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getSettingsRow, listQuotes } from "@/lib/admin/queries";
import { QuoteFilters } from "@/components/admin/QuoteFilters";
import { Card, EmptyState, Notice, PageTitle, Pagination, StatusBadge, btnSecondary, timeAgo } from "@/components/admin/ui";
import { getServiceByQuoteKey } from "@/config/services";
import { labelFor, propertyTypeOptions, sizeOptions } from "@/config/quote";

export const metadata: Metadata = { title: "Aanvragen" };

export default async function QuotesPage({ searchParams }: PageProps<"/admin/aanvragen">) {
  await requireAdmin();
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const filters = { status: str(sp.status), service: str(sp.dienst), assignee: str(sp.toegewezen), q: str(sp.q), page: Number(str(sp.pagina) ?? 1) || 1 };
  const [{ rows, total, page, pageSize }, settings] = await Promise.all([listQuotes(filters), getSettingsRow()]);
  const team = (settings?.team ?? []).map((m) => m.name);
  const melding = str(sp.melding);

  return (
    <>
      <PageTitle
        title="Aanvragen"
        description={`${total} aanvra${total === 1 ? "ag" : "gen"}${filters.status || filters.service || filters.assignee || filters.q ? " (gefilterd)" : ""}`}
        action={
          <Link href="/admin/aanvragen/export" prefetch={false} className={btnSecondary}>
            <Download className="size-4" /> Exporteer CSV
          </Link>
        }
      />

      {melding === "verwijderd" && (
        <div className="mb-4">
          <Notice>Aanvraag verwijderd.</Notice>
        </div>
      )}

      <Card className="mb-4">
        <Suspense>
          <QuoteFilters team={team} />
        </Suspense>
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="Geen aanvragen gevonden" text="Pas de filters aan of wacht op de eerste aanvraag via de website." />
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-navy-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">
                <tr>
                  <th className="px-4 py-3">Nummer</th>
                  <th className="px-4 py-3">Klant</th>
                  <th className="px-4 py-3">Dienst</th>
                  <th className="px-4 py-3">Pand / omvang</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Toegewezen</th>
                  <th className="px-4 py-3 text-right">Ontvangen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {rows.map((q) => (
                  <tr key={q.id} className="transition hover:bg-navy-50/60">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/admin/aanvragen/${q.id}`} className="font-semibold text-aqua-700 hover:underline">
                        {q.quote_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/aanvragen/${q.id}`} className="block font-semibold text-navy-900 hover:underline">
                        {q.customer_name}
                      </Link>
                      <span className="text-xs text-navy-500">
                        {q.city} · {q.phone}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-navy-800">{getServiceByQuoteKey(q.service)?.title ?? q.service}</span>
                      {q.photo_paths.length > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-navy-400">
                          <Camera className="size-3" /> {q.photo_paths.length}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-navy-600">
                      {labelFor(propertyTypeOptions, q.property_type)} · {labelFor(sizeOptions, q.estimated_size)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-4 py-3 text-navy-600">{q.assigned_to ?? <span className="text-navy-300">-</span>}</td>
                    <td className="px-4 py-3 text-right text-xs text-navy-500">{timeAgo(q.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} basePath="/admin/aanvragen" params={{ status: filters.status, dienst: filters.service, toegewezen: filters.assignee, q: filters.q }} />
    </>
  );
}
