import Link from "next/link";
import { ArrowRight, Camera, Globe, Inbox, Star, Wrench } from "lucide-react";
import { Card, PageTitle, StatCard } from "@/components/admin/ui";
import { DemoBadge, DemoHint, StatusDot } from "@/components/demo-admin/ui";
import { demoActivity, demoRequests, demoStats, demoVisitorsSeries } from "@/config/demo-admin";
import { siteConfig } from "@/config/site";

const quickLinks = [
  { href: "/beheer/website", label: "Website bewerken", text: "Hero, logo, kleuren en contactgegevens", icon: Globe },
  { href: "/beheer/diensten", label: "Diensten beheren", text: "Teksten, beelden en volgorde", icon: Wrench },
  { href: "/beheer/reviews", label: "Reviews", text: "Publiceren of als concept bewaren", icon: Star },
];

export default function DemoDashboardPage() {
  const max = Math.max(...demoVisitorsSeries);
  const recent = demoRequests.slice(0, 5);

  return (
    <>
      <DemoHint>Demo omgeving · deze omgeving bevat voorbeeldgegevens.</DemoHint>
      <PageTitle
        title="Dashboard"
        description="Een overzicht van hoe de website presteert en wat er speelt."
        action={
          <Link href="/" target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50 sm:min-h-10">
            <Globe className="size-4" aria-hidden />
            Website bekijken
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <StatusDot label="Online" />
          <span className="hidden h-5 w-px bg-navy-100 sm:block" aria-hidden />
          <div className="text-sm">
            <span className="text-navy-500">Website: </span>
            <span className="font-semibold text-navy-900">{siteConfig.companyName}</span>
          </div>
        </div>
        <p className="text-xs text-navy-400">Laatste publicatie: vandaag 08:12 · Alle pagina&apos;s bereikbaar</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {demoStats.map((s) => (
          <StatCard key={s.key} label={s.label} value={s.value} hint={s.delta} tone={s.tone ?? "default"} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Laatste offerte-aanvragen"
          action={
            <Link href="/beheer/aanvragen" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:text-gold-800">
              Alle aanvragen <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="divide-y divide-navy-100">
            {recent.map((q) => (
              <li key={q.id}>
                <Link href={`/beheer/aanvragen?aanvraag=${q.id}`} className="flex items-center gap-4 py-3 transition hover:bg-navy-50/60 sm:px-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-navy-900">{q.name}</span>
                      <span className="font-mono text-xs text-navy-400">{q.number}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-navy-500">
                      {q.service} · {q.location}
                      {q.photos > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-navy-400">
                          <Camera className="size-3" /> {q.photos}
                        </span>
                      )}
                    </p>
                  </div>
                  <DemoBadge label={q.status} />
                  <span className="hidden w-28 text-right text-xs text-navy-400 sm:block">{q.receivedAt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card title="Bezoekers, laatste 14 dagen">
            <div className="flex h-28 items-end gap-1.5" role="img" aria-label="Bezoekers per dag, stijgende trend">
              {demoVisitorsSeries.map((v, i) => (
                <span key={i} className={`flex-1 rounded-t-md ${i === demoVisitorsSeries.length - 1 ? "bg-gold-500" : "bg-navy-200"}`} style={{ height: `${Math.round((v / max) * 100)}%` }} />
              ))}
            </div>
            <p className="mt-3 text-xs text-navy-400">Gemiddeld 51 bezoekers per dag. Drukste dag: 70 bezoekers.</p>
          </Card>
          <Card title="Recente activiteit">
            <ul className="space-y-3">
              {demoActivity.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-14 shrink-0 text-xs text-navy-400">{a.when}</span>
                  <span className="text-navy-700">{a.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {quickLinks.map((q) => (
          <Link key={q.href} href={q.href} className="group flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy-100 transition hover:-translate-y-0.5 hover:shadow-lift hover:ring-gold-200">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <q.icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-navy-900">{q.label}</span>
              <span className="block truncate text-xs text-navy-500">{q.text}</span>
            </span>
            <ArrowRight className="size-4 text-navy-300 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        ))}
      </div>

      <p className="mt-8 flex items-center gap-2 text-xs text-navy-400">
        <Inbox className="size-3.5" aria-hidden />
        Nieuwe aanvragen komen binnen via het offerteformulier op de website en worden hier direct getoond.
      </p>
    </>
  );
}
