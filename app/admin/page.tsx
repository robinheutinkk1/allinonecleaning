import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardStats, recentQuotes } from "@/lib/admin/queries";
import { QUOTE_STATUSES } from "@/lib/admin/statuses";
import { Card, PageTitle, StatCard, StatusBadge, timeAgo, EmptyState } from "@/components/admin/ui";
import { getServiceByQuoteKey } from "@/config/services";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [stats, recent] = await Promise.all([getDashboardStats(), recentQuotes(8)]);

  const serviceRows = Object.entries(stats.serviceCounts).sort((a, b) => b[1] - a[1]);
  const maxService = Math.max(1, ...serviceRows.map(([, n]) => n));

  return (
    <>
      <PageTitle title="Overzicht" description="Wat er speelt bij All in One Vastgoedonderhoud." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Nieuwe aanvragen" value={stats.newCount} hint="Nog niet opgepakt" tone="accent" />
        <StatCard label="Afgelopen 7 dagen" value={stats.weekCount} hint={`${stats.monthCount} in de afgelopen 30 dagen`} />
        <StatCard label="Gewonnen" value={stats.wonCount} hint={stats.conversion !== null ? `${stats.conversion}% van afgeronde aanvragen` : "Nog geen afgeronde aanvragen"} />
        <StatCard label="Open berichten" value={stats.openMessages} hint="Via het contactformulier" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Laatste aanvragen"
          action={
            <Link href="/admin/aanvragen" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-gold-800">
              Alle aanvragen <ArrowRight className="size-4" />
            </Link>
          }
        >
          {recent.length === 0 ? (
            <EmptyState title="Nog geen aanvragen" text="Zodra iemand de offertewizard invult, verschijnt de aanvraag hier." />
          ) : (
            <ul className="divide-y divide-navy-100">
              {recent.map((q) => (
                <li key={q.id}>
                  <Link href={`/admin/aanvragen/${q.id}`} className="flex items-center gap-4 py-3 transition hover:bg-navy-50/60 sm:px-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-navy-900">{q.customer_name}</span>
                        <span className="font-mono text-xs text-navy-400">{q.quote_number}</span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-navy-500">
                        {getServiceByQuoteKey(q.service)?.title ?? q.service} · {q.city}
                        {q.photo_paths.length > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-navy-400">
                            <Camera className="size-3" /> {q.photo_paths.length}
                          </span>
                        )}
                      </p>
                    </div>
                    <StatusBadge status={q.status} />
                    <span className="hidden w-28 text-right text-xs text-navy-400 sm:block">{timeAgo(q.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Per status">
            <ul className="space-y-2">
              {QUOTE_STATUSES.map((s) => (
                <li key={s.value} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/aanvragen?status=${s.value}`} className="hover:underline">
                    <StatusBadge status={s.value} />
                  </Link>
                  <span className="font-semibold text-navy-900">{stats.statusCounts[s.value] ?? 0}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Diensten, afgelopen 30 dagen">
            {serviceRows.length === 0 ? (
              <p className="text-sm text-navy-400">Nog geen gegevens.</p>
            ) : (
              <ul className="space-y-3">
                {serviceRows.map(([key, n]) => (
                  <li key={key}>
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-700">{getServiceByQuoteKey(key)?.title ?? key}</span>
                      <span className="font-semibold text-navy-900">{n}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-navy-100">
                      <div className="h-full rounded-full bg-gold-500" style={{ width: `${Math.round((n / maxService) * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
