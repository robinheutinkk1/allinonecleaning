"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormAlert, TextArea, TextInput } from "@/components/ui/Field";
import { contactSchema } from "@/lib/validation/contact";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", privacyAccepted: false, website: "" });

  const set = (key: keyof typeof values, value: string | boolean) => setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError(null);

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        setServerError(json.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setStatus("error");
        return;
      }
      setStatus("success");
      track({ name: "contact_submitted" });
    } catch {
      setServerError("Geen verbinding. Controleer uw internet en probeer het opnieuw.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-aqua-50 p-8 text-center ring-1 ring-aqua-100" role="status">
        <CheckCircle2 className="mx-auto size-12 text-aqua-600" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold text-navy-900">Bedankt voor uw bericht!</h3>
        <p className="mt-2 text-navy-600">Wij hebben uw bericht ontvangen en nemen contact met u op.</p>
        <Button href="/" variant="secondary" className="mt-6">
          Terug naar home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput id="name" name="name" label="Naam" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} error={errors.name} required />
        <TextInput id="phone" name="phone" type="tel" label="Telefoonnummer" autoComplete="tel" optional value={values.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
      </div>
      <TextInput id="email" name="email" type="email" label="E-mailadres" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} error={errors.email} required />
      <TextArea id="message" name="message" label="Bericht" placeholder="Waar kunnen wij u mee helpen?" value={values.message} onChange={(e) => set("message", e.target.value)} error={errors.message} required />

      {/* Honeypot — onzichtbaar voor mensen */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <Checkbox
        id="privacyAccepted"
        name="privacyAccepted"
        checked={values.privacyAccepted}
        onChange={(e) => set("privacyAccepted", e.target.checked)}
        error={errors.privacyAccepted}
        label={
          <>
            Ik ga akkoord met de{" "}
            <Link href="/privacy" className="font-semibold text-aqua-700 underline-offset-2 hover:underline" target="_blank">
              privacyverklaring
            </Link>
            .
          </>
        }
      />

      {serverError && <FormAlert type="error">{serverError}</FormAlert>}

      <Button type="submit" size="lg" disabled={status === "submitting"} icon={status === "submitting" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />}>
        {status === "submitting" ? "Bezig met verzenden…" : "Verstuur bericht"}
      </Button>
    </form>
  );
}
