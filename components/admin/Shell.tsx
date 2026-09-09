"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ExternalLink, Images, Inbox, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, Star, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { signOutAction } from "@/lib/admin/actions";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/admin", label: "Overzicht", icon: LayoutDashboard, exact: true },
  { href: "/admin/aanvragen", label: "Aanvragen", icon: Inbox },
  { href: "/admin/berichten", label: "Berichten", icon: MessageSquare },
  { href: "/admin/projecten", label: "Projecten", icon: Images },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/instellingen", label: "Instellingen", icon: Settings },
];

export function AdminShell({ children, email, badges }: { children: ReactNode; email: string; badges?: Record<string, number> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <ul className="space-y-1">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const badge = badges?.[item.href];
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition",
                active ? "bg-aqua-500 text-white shadow-soft" : "text-navy-200 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="size-4.5" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {badge ? <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", active ? "bg-white/20 text-white" : "bg-aqua-500 text-white")}>{badge}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const footer = (
    <div className="space-y-2 border-t border-white/10 pt-4">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-3.5 py-2 text-sm text-navy-200 hover:bg-white/10 hover:text-white">
        <ExternalLink className="size-4" aria-hidden />
        Website bekijken
      </Link>
      <form action={signOutAction}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-sm text-navy-200 hover:bg-white/10 hover:text-white">
          <LogOut className="size-4" aria-hidden />
          Uitloggen
        </button>
      </form>
      <p className="truncate px-3.5 pt-1 text-xs text-navy-400" title={email}>
        {email}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-50 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-72 shrink-0 flex-col bg-navy-950 p-5 lg:flex lg:min-h-screen lg:sticky lg:top-0 lg:h-screen">
        <div className="mb-8">
          <Logo inverted multiline />
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-400">Dashboard</p>
        </div>
        <nav className="flex-1">{links}</nav>
        {footer}
      </aside>

      {/* Topbar mobiel */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-navy-950 px-4 py-3 lg:hidden">
        <Logo inverted compactHide />
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menu" className="rounded-full p-2 text-white hover:bg-white/10">
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-x-0 top-[60px] z-30 bg-navy-950 p-5 lg:hidden">
          <nav>{links}</nav>
          <div className="mt-4">{footer}</div>
        </div>
      )}

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
