"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { demoSignInAction, type DemoActionResult } from "@/lib/demo-admin/actions";
import { btnPrimary, inputCls, labelCls, Notice } from "@/components/admin/ui";

export function DemoLoginForm({ next, email, password }: { next: string; email: string; password: string }) {
  const [state, action, pending] = useActionState<DemoActionResult | null, FormData>(demoSignInAction, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="volgende" value={next} />
      {state && !state.ok && <Notice tone="error">{state.error}</Notice>}
      <div>
        <label htmlFor="email" className={labelCls}>
          E-mailadres
        </label>
        <input id="email" name="email" type="email" autoComplete="off" required defaultValue={email} className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>
          Wachtwoord
        </label>
        <input id="password" name="password" type="password" autoComplete="off" required defaultValue={password} className={inputCls} />
      </div>
      <button type="submit" disabled={pending} className={`${btnPrimary} h-12 w-full`}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
        {pending ? "Bezig met inloggen…" : "Inloggen in de demo"}
      </button>
    </form>
  );
}
