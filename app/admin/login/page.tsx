import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Inloggen" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
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
