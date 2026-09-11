import type { Metadata } from "next";
import { DemoShell } from "@/components/demo-admin/Shell";
import { demoConfig } from "@/config/site";
import { hasDemoSession } from "@/lib/demo-admin/session";

export const metadata: Metadata = {
  title: { default: `${demoConfig.platformName} Demo`, template: `%s | ${demoConfig.platformName} Demo` },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Demo-beheeromgeving. Zonder demo-sessie wordt alleen de kale pagina getoond
 * (in de praktijk de loginpagina; proxy.ts stuurt andere routes daarheen).
 */
export default async function BeheerLayout({ children }: LayoutProps<"/beheer">) {
  const authed = await hasDemoSession();
  if (!authed) return <div className="min-h-screen bg-navy-950">{children}</div>;
  return <DemoShell>{children}</DemoShell>;
}
