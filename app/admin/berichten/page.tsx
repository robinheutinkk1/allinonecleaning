import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listMessages } from "@/lib/admin/queries";
import { MessageActions } from "@/components/admin/MessageActions";
import { EmptyState, MessageStatusBadge, PageTitle, formatDateTime } from "@/components/admin/ui";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Berichten" };

const tabs = [
  { value: "alle", label: "Alle" },
  { value: "new", label: "Nieuw" },
  { value: "read", label: "Gelezen" },
  { value: "replied", label: "Beantwoord" },
  { value: "archived", label: "Archief" },
];

export default async function MessagesPage({ searchParams }: PageProps<"/admin/berichten">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "alle";
  const messages = await listMessages(status);

  return (
    <>
      <PageTitle title="Berichten" description="Berichten via het contactformulier." />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none]">
        {tabs.map((t) => (
          <Link
            key={t.value}
            href={t.value === "alle" ? "/admin/berichten" : `/admin/berichten?status=${t.value}`}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition sm:min-h-9",
              status === t.value ? "bg-navy-900 text-white shadow-soft" : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50 active:bg-navy-100",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <EmptyState title="Geen berichten" text="Berichten via het contactformulier verschijnen hier." />
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className={cn("rounded-3xl bg-white p-5 shadow-soft ring-1", m.status === "new" ? "ring-gold-300" : "ring-navy-100")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-navy-900">{m.name}</span>
                    <MessageStatusBadge status={m.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-navy-500">
                    <a href={`mailto:${m.email}`} className="text-gold-700 hover:underline">
                      {m.email}
                    </a>
                    {m.phone && (
                      <>
                        {" · "}
                        <a href={`tel:${m.phone.replace(/[\s()-]/g, "")}`} className="text-gold-700 hover:underline">
                          {m.phone}
                        </a>
                      </>
                    )}
                    {" · "}
                    {formatDateTime(m.created_at)}
                  </p>
                </div>
                <MessageActions id={m.id} status={m.status} />
              </div>
              <p className="mt-4 whitespace-pre-line text-sm text-navy-800">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
