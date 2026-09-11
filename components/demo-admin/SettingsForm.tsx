"use client";

import Image from "next/image";
import { useState } from "react";
import { Save, Upload } from "lucide-react";
import { btnPrimary, btnSecondary, btnSmall, Card, inputCls } from "@/components/admin/ui";
import { Field } from "@/components/demo-admin/ui";
import { demoSettings } from "@/config/demo-admin";
import { DEMO_SAVED, useDemoFeedback } from "./feedback";

export function DemoSettingsForm() {
  const { notify } = useDemoFeedback();
  const [s, setS] = useState(demoSettings);
  const set = (key: keyof typeof demoSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setS({ ...s, [key]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        notify(DEMO_SAVED);
      }}
      className="space-y-6"
    >
      <Card title="Bedrijf">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="companyName" label="Bedrijfsnaam">
            <input id="companyName" value={s.companyName} onChange={set("companyName")} className={inputCls} />
          </Field>
          <Field id="tagline" label="Slogan">
            <input id="tagline" value={s.tagline} onChange={set("tagline")} className={inputCls} />
          </Field>
          <Field id="phone" label="Telefoonnummer">
            <input id="phone" value={s.phone} onChange={set("phone")} className={inputCls} />
          </Field>
          <Field id="email" label="E-mailadres">
            <input id="email" type="email" value={s.email} onChange={set("email")} className={inputCls} />
          </Field>
          <Field id="workArea" label="Werkgebied">
            <input id="workArea" value={s.workArea} onChange={set("workArea")} className={inputCls} />
          </Field>
          <Field id="places" label="Plaatsen" hint="Komma-gescheiden.">
            <input id="places" value={s.places} onChange={set("places")} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Huisstijl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-navy-500">Logo</p>
            <div className="flex items-center gap-4 rounded-2xl bg-navy-50 p-4">
              <Image src="/brand/nova-logo.png" alt={`Logo ${s.companyName}`} width={330} height={100} className="h-10 w-auto" />
              <button type="button" onClick={() => notify("Uploaden is in de demo uitgeschakeld.", "info")} className={`${btnSecondary} ${btnSmall}`}>
                <Upload className="size-4" aria-hidden />
                Vervangen
              </button>
            </div>
          </div>
          <Field id="primaryColor" label="Primaire kleur">
            <div className="flex items-center gap-3">
              <input id="primaryColor" type="color" value={s.primaryColor} onChange={set("primaryColor")} className="h-11 w-16 cursor-pointer rounded-xl border border-navy-200 bg-white p-1" />
              <input aria-label="Kleurcode" value={s.primaryColor} onChange={set("primaryColor")} className={`${inputCls} max-w-[9rem] font-mono`} />
            </div>
          </Field>
          <Field id="ctaText" label="CTA-tekst" hint="Tekst op de belangrijkste knoppen.">
            <input id="ctaText" value={s.ctaText} onChange={set("ctaText")} className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="Social media">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="instagram" label="Instagram">
            <input id="instagram" type="url" value={s.instagram} onChange={set("instagram")} placeholder="https://instagram.com/…" className={inputCls} />
          </Field>
          <Field id="facebook" label="Facebook">
            <input id="facebook" type="url" value={s.facebook} onChange={set("facebook")} placeholder="https://facebook.com/…" className={inputCls} />
          </Field>
          <Field id="linkedin" label="LinkedIn">
            <input id="linkedin" type="url" value={s.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/company/…" className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="SEO">
        <div className="space-y-4">
          <Field id="seoTitle" label="Titel" hint={`${s.seoTitle.length} tekens (advies: maximaal 60)`}>
            <input id="seoTitle" value={s.seoTitle} onChange={set("seoTitle")} className={inputCls} />
          </Field>
          <Field id="seoDescription" label="Omschrijving" hint={`${s.seoDescription.length} tekens (advies: maximaal 160)`}>
            <textarea id="seoDescription" rows={3} value={s.seoDescription} onChange={set("seoDescription")} className={inputCls} />
          </Field>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={btnPrimary}>
          <Save className="size-4" aria-hidden />
          Instellingen opslaan
        </button>
        <p className="text-xs text-navy-400">In de demo worden wijzigingen niet bewaard.</p>
      </div>
    </form>
  );
}
