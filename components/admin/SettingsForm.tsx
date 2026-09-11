"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettings, type ActionResult } from "@/lib/admin/actions";
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { siteConfig } from "@/config/site";
import { btnPrimary, inputCls, labelCls, Notice } from "./ui";

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettingsRow | null }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveSettings, null);
  const s = settings;

  return (
    <form action={action} className="space-y-8">
      {state && <Notice tone={state.ok ? "success" : "error"}>{state.ok ? state.message : state.error}</Notice>}

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">Contactgegevens</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="phone" label="Telefoonnummer" hint="Verschijnt in navbar, footer, contactpagina en de knop 'Bel direct'.">
            <input id="phone" name="phone" defaultValue={s?.phone ?? ""} placeholder="06 12345678" className={inputCls} />
          </Field>
          <Field id="whatsapp" label="WhatsApp-nummer">
            <input id="whatsapp" name="whatsapp" defaultValue={s?.whatsapp ?? ""} placeholder="06 12345678" className={inputCls} />
          </Field>
          <Field id="email" label="E-mailadres (zichtbaar op de site)">
            <input id="email" name="email" type="email" defaultValue={s?.email ?? ""} placeholder="info@…" className={inputCls} />
          </Field>
          <Field id="notification_email" label="Notificatie-adres" hint="Alleen ter informatie; het adres waar de meldingen echt naartoe gaan staat in de serverinstellingen (QUOTE_NOTIFICATION_EMAIL).">
            <input id="notification_email" name="notification_email" type="email" defaultValue={s?.notification_email ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">Adres en bedrijfsgegevens</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="street" label="Straat en huisnummer">
            <input id="street" name="street" defaultValue={s?.street ?? ""} className={inputCls} />
          </Field>
          <Field id="postal_code" label="Postcode">
            <input id="postal_code" name="postal_code" defaultValue={s?.postal_code ?? ""} className={inputCls} />
          </Field>
          <Field id="city" label="Plaats">
            <input id="city" name="city" defaultValue={s?.city ?? siteConfig.address.city} className={inputCls} />
          </Field>
          <Field id="kvk" label="KvK-nummer">
            <input id="kvk" name="kvk" defaultValue={s?.kvk ?? ""} className={inputCls} />
          </Field>
          <Field id="btw" label="Btw-nummer">
            <input id="btw" name="btw" defaultValue={s?.btw ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">Werkgebied en openingstijden</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="work_areas" label="Werkgebied" hint="Eén plaats per regel. De eerste is de vestigingsplaats.">
            <textarea id="work_areas" name="work_areas" rows={5} defaultValue={(s?.work_areas ?? [...siteConfig.workAreas]).join("\n")} className={inputCls} />
          </Field>
          <Field id="opening_hours" label="Openingstijden" hint="Per regel: dagen | tijden. Bijv. Ma-Vr | 08:00-18:00">
            <textarea id="opening_hours" name="opening_hours" rows={5} defaultValue={(s?.opening_hours ?? []).map((o) => `${o.days} | ${o.hours}`).join("\n")} placeholder={"Ma-Vr | 08:00-18:00\nZa | 09:00-13:00"} className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">Google en social media</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="google_rating" label="Google-beoordeling (gemiddelde)" hint="Alleen echte cijfers uit Google Business Profile. Met de Google-koppeling (pagina Reviews) wordt dit automatisch bijgewerkt.">
            <input id="google_rating" name="google_rating" type="number" step="0.1" min={1} max={5} defaultValue={s?.google_rating ?? ""} className={inputCls} />
          </Field>
          <Field id="google_review_count" label="Aantal Google-reviews">
            <input id="google_review_count" name="google_review_count" type="number" min={0} defaultValue={s?.google_review_count ?? ""} className={inputCls} />
          </Field>
          <Field id="google_reviews_url" label="Link naar Google-reviews">
            <input id="google_reviews_url" name="google_reviews_url" type="url" defaultValue={s?.google_reviews_url ?? ""} className={inputCls} />
          </Field>
          <Field id="social_google" label="Google Business Profile">
            <input id="social_google" name="social_google" type="url" defaultValue={s?.social_google ?? ""} className={inputCls} />
          </Field>
          <Field id="social_instagram" label="Instagram">
            <input id="social_instagram" name="social_instagram" type="url" defaultValue={s?.social_instagram ?? ""} className={inputCls} />
          </Field>
          <Field id="social_facebook" label="Facebook">
            <input id="social_facebook" name="social_facebook" type="url" defaultValue={s?.social_facebook ?? ""} className={inputCls} />
          </Field>
          <Field id="social_linkedin" label="LinkedIn">
            <input id="social_linkedin" name="social_linkedin" type="url" defaultValue={s?.social_linkedin ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">Homepage</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="stats" label="Statistieken" hint="Per regel: tekst | waarde. Bijv. Jaar ervaring | 10+. Maximaal 4, alleen echte cijfers. Leeg = sectie verborgen.">
            <textarea id="stats" name="stats" rows={4} defaultValue={(s?.stats ?? []).map((o) => `${o.label} | ${o.value}`).join("\n")} placeholder={"Jaar ervaring | 10+\nProjecten | 250+"} className={inputCls} />
          </Field>
          <div className="flex items-start pt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
              <input type="checkbox" name="hero_video_enabled" defaultChecked={s?.hero_video_enabled ?? true} className="size-4 accent-gold-500" />
              Hero-video afspelen op de homepage
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-navy-900">Team</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="team" label="Collega's" hint="Per regel: Naam | e-mailadres (e-mail mag leeg). Deze namen verschijnen in de keuzelijst 'Toegewezen aan' bij een aanvraag en in het filter op de aanvragenlijst.">
            <textarea id="team" name="team" rows={5} defaultValue={(s?.team ?? []).map((m) => (m.email ? `${m.name} | ${m.email}` : m.name)).join("\n")} placeholder={"Jan | jan@bedrijf.nl\nPiet"} className={inputCls} />
          </Field>
          <div className="rounded-2xl bg-navy-50 p-4 text-sm text-navy-600">
            <p className="font-semibold text-navy-900">Collega laten inloggen</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Maak een loginaccount aan in het gebruikersbeheer van de database (e-mail en wachtwoord).</li>
              <li>Voeg hetzelfde e-mailadres toe aan ADMIN_EMAILS in de serverinstellingen (kommagescheiden) en publiceer opnieuw.</li>
              <li>Zet de collega hiernaast in de lijst, met hetzelfde e-mailadres, zodat &quot;Aan mij toewijzen&quot; werkt.</li>
            </ol>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100 pt-5">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Bezig met opslaan…" : "Instellingen opslaan"}
        </button>
      </div>
    </form>
  );
}
