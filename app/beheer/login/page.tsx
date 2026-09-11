import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DemoLoginForm } from "@/components/demo-admin/LoginForm";
import { demoConfig, siteConfig } from "@/config/site";
import { DEMO_CREDENTIALS } from "@/lib/demo-admin/session";
import { ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Inloggen",
  description: `Demo-beheeromgeving van ${demoConfig.platformName} voor de website van ${siteConfig.companyName}.`,
  robots: { index: false, follow: false },
  openGraph: { title: `${demoConfig.platformName} Demo`, images: [{ url: ogImageUrl({ variant: "beheer" }), width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: [ogImageUrl({ variant: "beheer" })] },
};

export default async function DemoLoginPage({ searchParams }: PageProps<"/beheer/login">) {
  const sp = await searchParams;
  const next = typeof sp.volgende === "string" ? sp.volgende : "/beheer";

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gold-500 shadow-glow">
            <svg viewBox="0 0 100 100" className="size-8" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M27 58L50 35L73 58" />
              <path d="M36 71H64" />
            </svg>
          </span>
          <p className="mt-4 font-display text-xl font-bold text-white">{demoConfig.platformName} Demo</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-400">Beheeromgeving</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lift sm:p-8">
          <h1 className="font-display text-xl font-bold text-navy-900">Inloggen</h1>
          <p className="mt-1 text-sm text-navy-500">De demogegevens zijn al ingevuld. Deze omgeving bevat alleen voorbeeldgegevens.</p>
          <div className="mt-6">
            <DemoLoginForm next={next} email={DEMO_CREDENTIALS.email} password={DEMO_CREDENTIALS.password} />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-navy-400">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-navy-300 hover:text-white">
            <ArrowLeft className="size-3.5" aria-hidden />
            Terug naar de website van {siteConfig.companyName}
          </Link>
        </p>
      </div>
    </div>
  );
}
