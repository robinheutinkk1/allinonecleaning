"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { signInAction, type ActionResult } from "@/lib/admin/actions";
import { btnPrimary, inputCls, labelCls, Notice } from "./ui";

export function LoginForm({ next, reason }: { next: string; reason?: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(signInAction, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="volgende" value={next} />
      {reason === "config" && <Notice tone="error">De koppeling met de database is nog niet ingesteld. Neem contact op met de beheerder van de website.</Notice>}
      {state && !state.ok && <Notice tone="error">{state.error}</Notice>}
      <div>
        <label htmlFor="email" className={labelCls}>
          E-mailadres
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>
          Wachtwoord
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      <button type="submit" disabled={pending} className={`${btnPrimary} h-12 w-full`}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
        {pending ? "Bezig met inloggen…" : "Inloggen"}
      </button>
    </form>
  );
}
