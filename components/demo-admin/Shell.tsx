"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, FolderOpen, Globe, Images, Inbox, LayoutDashboard, Loader2, LogOut, Menu, Settings, SlidersHorizontal, Star, Wrench, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { demoSignOutAction } from "@/lib/demo-admin/actions";
import { cn } from "@/lib/utils/cn";
import { DemoFeedbackProvider } from "./feedback";
import { TagPointWordmark } from "./Wordmark";

type NavItem = { href: string; label: string; short?: string; icon: ComponentType<{ className?: string }>; exact?: boolean; badge?: number };

const nav: NavItem[] = [
  { href: "/beheer", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/beheer/website", label: "Website", icon: Globe },
  { href: "/beheer/diensten", label: "Diensten", icon: Wrench },
  { href: "/beheer/projecten", label: "Projecten", icon: FolderOpen },
  { href: "/beheer/before-after", label: "Before & After", short: "Voor/na", icon: SlidersHorizontal },
  { href: "/beheer/reviews", label: "Reviews", icon: Star },
  { href: "/beheer/aanvragen", label: "Offerte-aanvragen", short: "Aanvragen", icon: Inbox, badge: 2 },
  { href: "/beheer/media", label: "Media", icon: Images },
  { href: "/beheer/instellingen", label: "Instellingen", short: "Meer", icon: Settings },
];

/** Vijf onderdelen in de tabbalk op telefoon; de rest zit in het menu. */
const mobileTabs = ["/beheer", "/beheer/aanvragen", "/beheer/projecten", "/beheer/reviews", "/beheer/instellingen"];

function isActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function PendingIcon({ icon: Icon, className }: { icon: ComponentType<{ className?: string }>; className?: string }) {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className={cn(className, "animate-spin")} aria-hidden /> : <Icon className={className} />;
}

export function DemoShell({ children }: { children: ReactNode }) {
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
              {item.badge ? <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums", active ? "bg-white/25 text-navy-950" : "bg-gold-500 text-navy-950")}>{item.badge}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="space-y-1 border-t border-white/10 pt-4">
      <div className="mb-2 rounded-2xl bg-white/5 px-3.5 py-3 text-xs text-navy-300 ring-1 ring-white/10">
        <p className="font-semibold text-white">Website</p>
        <p className="mt-0.5 truncate">{siteConfig.companyName}</p>
        <p className="mt-1 text-[11px] text-navy-400">Demo omgeving · voorbeeldgegevens</p>
      </div>
      <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-2 text-sm text-navy-200 hover:bg-white/10 hover:text-white">
        <ExternalLink className="size-4" aria-hidden />
        Website bekijken
      </Link>
      <form action={demoSignOutAction}>
        <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-sm text-navy-200 hover:bg-white/10 hover:text-white">
          <LogOut className="size-4" aria-hidden />
          Uitloggen
        </button>
      </form>
    </div>
  );

  return (
    <DemoFeedbackProvider>
      <div className="min-h-screen bg-navy-50 lg:flex">
        {/* Sidebar desktop */}
        <aside className="hidden w-72 shrink-0 flex-col bg-navy-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
          <div className="mb-8 px-1">
            <TagPointWordmark />
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
        <AnimatePresence>
          {open && (
            <>
              <motion.button type="button" aria-label="Menu sluiten" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 bg-navy-950/40 lg:hidden" />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 top-[60px] z-30 max-h-[calc(100dvh-60px)] overflow-y-auto rounded-b-3xl bg-navy-950 p-4 pb-6 shadow-lift lg:hidden"
              >
                <nav>{links}</nav>
                <div className="mt-4">{footer}</div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 lg:p-10 lg:pb-10">{children}</main>

        {/* Tabbalk onderaan op telefoon */}
        <nav aria-label="Beheer" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
          <ul className="grid grid-cols-5">
            {nav
              .filter((i) => mobileTabs.includes(i.href))
              .map((item) => {
                const active = isActive(item, pathname);
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
                      {item.badge ? <span className="absolute right-[calc(50%-1.6rem)] top-1.5 min-w-4 rounded-full bg-gold-500 px-1 text-center text-[10px] font-bold leading-4 text-navy-950">{item.badge}</span> : null}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    </DemoFeedbackProvider>
  );
}
