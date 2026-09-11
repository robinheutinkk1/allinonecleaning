import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { demoConfig, siteConfig } from "@/config/site";
import { ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Inloggen voor medewerkers",
  description: `Dashboard van ${siteConfig.companyName}: aanvragen, projecten, reviews en instellingen beheren.`,
  robots: { index: false, follow: false },
  openGraph: { title: "Inloggen voor medewerkers", images: [{ url: ogImageUrl({ variant: "login" }), width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: [ogImageUrl({ variant: "login" })] },
};
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = typeof sp.volgende === "string" ? sp.volgende : "/admin";
  const reason = typeof sp.reden === "string" ? sp.reden : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo inverted href={null} className="h-16" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-400">Dashboard</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lift sm:p-8">
          <h1 className="font-display text-xl font-bold text-navy-900">Inloggen</h1>
          <p className="mt-1 text-sm text-navy-500">Alleen voor medewerkers van {siteConfig.companyName}.</p>
          <div className="mt-6">
            <LoginForm next={next} reason={reason} />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-navy-400">
          Wilt u de beheeromgeving bekijken?{" "}
          <Link href={`${demoConfig.adminPath}/login`} className="font-semibold text-gold-300 hover:text-white">
            Open de demo
          </Link>
        </p>
      </div>
    </div>
  );
}
