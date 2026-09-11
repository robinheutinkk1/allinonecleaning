"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_CREDENTIALS, DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE } from "./session";

export type DemoActionResult = { ok: true } | { ok: false; error: string };

/** Demo-login: controleert de vooringevulde demogegevens en zet de demo-cookie. */
export async function demoSignInAction(_prev: DemoActionResult | null, formData: FormData): Promise<DemoActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("volgende") ?? "/beheer");
  if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
    return { ok: false, error: "Gebruik de demogegevens die al zijn ingevuld." };
  }
  const store = await cookies();
  store.set(DEMO_SESSION_COOKIE, DEMO_SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(next.startsWith("/beheer") ? next : "/beheer");
}

export async function demoSignOutAction(): Promise<void> {
  const store = await cookies();
  store.delete(DEMO_SESSION_COOKIE);
  redirect("/beheer/login");
}
