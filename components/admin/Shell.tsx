"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type ReactNode } from "react";
import { ExternalLink, Images, Inbox, LayoutDashboard, Loader2, LogOut, Menu, MessageSquare, Settings, Star, X } from "lucide-react";
import { TagPointWordmark } from "@/components/demo-admin/Wordmark";
import { siteConfig } from "@/config/site";
import { signOutAction } from "@/lib/admin/actions";
import { cn } from "@/lib/utils/cn";

type NavItem = { href: string; label: string; short?: string; icon: ComponentType<{ className?: string }>; exact?: boolean };

const nav: NavItem[] = [
  { href: "/admin", label: "Overzicht", icon: LayoutDashboard, exact: true },
  { href: "/admin/aanvragen", label: "Aanvragen", icon: Inbox },
  { href: "/admin/berichten", label: "Berichten", icon: MessageSquare },
  { href: "/admin/projecten", label: "Projecten", icon: Images },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/instellingen", label: "Instellingen", short: "Meer", icon: Settings },
];

function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/** Toont een spinner in de link zolang de nieuwe pagina laadt (directe feedback bij klikken). */
function PendingIcon({ icon: Icon, className }: { icon: ComponentType<{ className?: string }>; className?: string }) {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className={cn(className, "animate-spin")} aria-hidden /> : <Icon className={className} />;
}

function Badge({ n, active }: { n?: number; active: boolean }) {
  if (!n) return null;
  return <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums", active ? "bg-white/20 text-white" : "bg-gold-500 text-navy-950")}>{n > 99 ? "99+" : n}</span>;
}

export function AdminShell({ children, email, badges, demoMode = false }: { children: ReactNode; email: string; badges?: Record<string, number>; demoMode?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <ul className="space-y-1">
      {nav.map((item) => {
        const active = isActive(item, pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition",
                active ? "bg-gold-500 text-navy-950 shadow-soft" : "text-navy-200 hover:bg-white/10 hover:text-white active:bg-white/15",
              )}
            >
              <PendingIcon icon={item.icon} className="size-4.5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              <Badge n={badges?.[item.href]} active={active} />
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="space-y-1 border-t border-white/10 pt-4">
      <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-2 text-sm text-navy-200 hover:bg-white/10 hover:text-white">
        <ExternalLink className="size-4" aria-hidden />
        Website bekijken
      </Link>
      <form action={signOutAction}>
        <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-sm text-navy-200 hover:bg-white/10 hover:text-white">
          <LogOut className="size-4" aria-hidden />
          Uitloggen
        </button>
      </form>
      <p className="truncate px-3.5 pt-2 text-xs text-navy-400" title={email}>
        {email}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-50 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-72 shrink-0 flex-col bg-navy-950 p-5 lg:flex lg:min-h-screen lg:sticky lg:top-0 lg:h-screen">
        <div className="mb-8 px-1">
          <TagPointWordmark subtitle="Dashboard" />
          <p className="mt-4 rounded-2xl bg-white/5 px-3.5 py-2.5 text-xs text-navy-300 ring-1 ring-white/10">
            <span className="block font-semibold text-white">Website</span>
            <span className="block truncate">{siteConfig.companyName}</span>
          </p>
        </div>
        <nav className="flex-1">{links}</nav>
        {footer}
      </aside>

      {/* Topbar mobiel */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-navy-950 px-4 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] lg:hidden">
        <TagPointWordmark compact />
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Menu sluiten" : "Menu openen"} className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10 active:bg-white/15">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <>
          <button type="button" aria-label="Menu sluiten" onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-navy-950/40 lg:hidden" />
          <div className="fixed inset-x-0 top-[60px] z-30 max-h-[calc(100dvh-60px)] overflow-y-auto rounded-b-3xl bg-navy-950 p-4 pb-6 shadow-lift lg:hidden">
            <nav>{links}</nav>
            <div className="mt-4">{footer}</div>
          </div>
        </>
      )}

      <main className="min-w-0 flex-1 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 lg:p-10 lg:pb-10">
        {demoMode && (
          <p role="status" className="mb-5 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-navy-800">
            <span className="font-semibold text-navy-950">Demo-modus.</span> De website toont de vaste demo-inhoud. Wat u hier bij projecten, reviews en instellingen wijzigt, wordt bewaard in de database maar niet op de website getoond.
          </p>
        )}
        {children}
      </main>

      {/* Tabbalk onderaan op telefoon: de vijf belangrijkste onderdelen altijd binnen duimbereik */}
      <nav aria-label="Dashboard" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
        <ul className="grid grid-cols-6">
          {nav.map((item) => {
            const active = isActive(item, pathname);
            const n = badges?.[item.href];
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition", active ? "text-gold-700" : "text-navy-500 active:text-navy-900")}
                >
                  <span className={cn("flex h-7 w-11 items-center justify-center rounded-full transition", active && "bg-gold-100")}>
                    <PendingIcon icon={item.icon} className="size-[18px]" />
                  </span>
                  {item.short ?? item.label}
                  {n ? <span className="absolute right-[calc(50%-1.6rem)] top-1.5 min-w-4 rounded-full bg-gold-500 px-1 text-center text-[10px] font-bold leading-4 text-navy-950">{n > 99 ? "99+" : n}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
