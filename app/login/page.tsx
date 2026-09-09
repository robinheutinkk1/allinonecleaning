import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Inloggen voor medewerkers",
  description: "Dashboard van All in One Cleaning: aanvragen, projecten, reviews en instellingen beheren.",
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
          <Logo inverted />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-400">Dashboard</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lift sm:p-8">
          <h1 className="font-display text-xl font-bold text-navy-900">Inloggen</h1>
          <p className="mt-1 text-sm text-navy-500">Alleen voor medewerkers van All in One Cleaning.</p>
          <div className="mt-6">
            <LoginForm next={next} reason={reason} />
          </div>
        </div>
      </div>
    </div>
  );
}
