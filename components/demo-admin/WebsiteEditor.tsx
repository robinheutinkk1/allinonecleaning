"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Save, Upload } from "lucide-react";
import { btnPrimary, btnSecondary, btnSmall, Card, inputCls } from "@/components/admin/ui";
import { DemoBadge, Field } from "@/components/demo-admin/ui";
import { demoSettings, demoWebsite } from "@/config/demo-admin";
import { siteConfig } from "@/config/site";
import { DEMO_SAVED, useDemoFeedback } from "./feedback";

function SaveButton({ label = "Opslaan" }: { label?: string }) {
  return (
    <button type="submit" className={btnPrimary}>
      <Save className="size-4" aria-hidden />
      {label}
    </button>
  );
}

export function WebsiteEditor() {
  const { notify } = useDemoFeedback();
  const [hero, setHero] = useState(demoWebsite.hero);
  const [contact, setContact] = useState({ phone: demoSettings.phone, email: demoSettings.email, area: demoSettings.workArea, places: demoSettings.places });
  const [seo, setSeo] = useState({ title: demoSettings.seoTitle, description: demoSettings.seoDescription });
  const [color, setColor] = useState(demoSettings.primaryColor);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    notify(DEMO_SAVED);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card title="Hero">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="eyebrow" label="Bovenregel">
                <input id="eyebrow" value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} className={inputCls} />
              </Field>
              <Field id="primaryCta" label="Knop">
                <input id="primaryCta" value={hero.primaryCta} onChange={(e) => setHero({ ...hero, primaryCta: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field id="title" label="Titel">
              <input id="title" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className={inputCls} />
            </Field>
            <Field id="text" label="Tekst">
              <textarea id="text" rows={3} value={hero.text} onChange={(e) => setHero({ ...hero, text: e.target.value })} className={inputCls} />
            </Field>
            <div className="rounded-2xl bg-navy-950 p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">{hero.eyebrow}</p>
              <p className="mt-2 font-display text-xl font-bold leading-tight sm:text-2xl">{hero.title}</p>
              <p className="mt-2 max-w-md text-sm text-navy-200">{hero.text}</p>
              <span className="mt-4 inline-flex rounded-full bg-gold-500 px-4 py-1.5 text-sm font-semibold text-navy-950">{hero.primaryCta}</span>
            </div>
            <SaveButton label="Hero opslaan" />
          </form>
        </Card>

        <Card title="Contactgegevens en werkgebied">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="phone" label="Telefoonnummer">
                <input id="phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputCls} />
              </Field>
              <Field id="email" label="E-mailadres">
                <input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputCls} />
              </Field>
              <Field id="area" label="Werkgebied">
                <input id="area" value={contact.area} onChange={(e) => setContact({ ...contact, area: e.target.value })} className={inputCls} />
              </Field>
              <Field id="places" label="Plaatsen" hint="Komma-gescheiden, verschijnen in de werkgebiedsectie.">
                <input id="places" value={contact.places} onChange={(e) => setContact({ ...contact, places: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <SaveButton />
          </form>
        </Card>

        <Card title="SEO">
          <form onSubmit={submit} className="space-y-4">
            <Field id="seoTitle" label="Paginatitel" hint={`${seo.title.length} tekens (advies: maximaal 60)`}>
              <input id="seoTitle" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} className={inputCls} />
            </Field>
            <Field id="seoDescription" label="Omschrijving" hint={`${seo.description.length} tekens (advies: maximaal 160)`}>
              <textarea id="seoDescription" rows={3} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} className={inputCls} />
            </Field>
            <div className="rounded-2xl bg-navy-50 p-4">
              <p className="text-xs text-navy-400">Voorbeeld in zoekresultaten</p>
              <p className="mt-1 truncate text-base font-semibold text-[#1a0dab]">{seo.title}</p>
              <p className="text-xs text-emerald-700">{siteConfig.url}</p>
              <p className="mt-1 line-clamp-2 text-sm text-navy-600">{seo.description}</p>
            </div>
            <SaveButton label="SEO opslaan" />
          </form>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Logo">
          <div className="rounded-2xl bg-navy-50 p-5">
            <Image src="/brand/nova-logo.png" alt={`Logo ${siteConfig.companyName}`} width={330} height={100} className="h-12 w-auto" />
          </div>
          <div className="mt-3 rounded-2xl bg-navy-950 p-5">
            <Image src="/brand/nova-logo-light.png" alt="" width={330} height={100} className="h-12 w-auto" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => notify("Uploaden is in de demo uitgeschakeld.", "info")} className={`${btnSecondary} ${btnSmall}`}>
              <Upload className="size-4" aria-hidden />
              Nieuw logo uploaden
            </button>
          </div>
        </Card>

        <Card title="Kleuren">
          <ul className="space-y-3">
            {demoWebsite.colors.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className="size-9 shrink-0 rounded-xl ring-1 ring-navy-100" style={{ background: c.name === "Goud" ? color : c.hex }} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-navy-900">{c.name}</span>
                  <span className="block truncate text-xs text-navy-400">{c.usage}</span>
                </span>
                <span className="font-mono text-xs text-navy-500">{c.name === "Goud" ? color : c.hex}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={submit} className="mt-4 flex items-end gap-3">
            <Field id="primary" label="Primaire kleur">
              <input id="primary" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-16 cursor-pointer rounded-xl border border-navy-200 bg-white p-1" />
            </Field>
            <button type="submit" className={`${btnSecondary} ${btnSmall}`}>
              Toepassen
            </button>
          </form>
        </Card>

        <Card title="CTA">
          <form onSubmit={submit} className="space-y-4">
            <Field id="cta" label="Tekst op knoppen">
              <input id="cta" value={hero.primaryCta} onChange={(e) => setHero({ ...hero, primaryCta: e.target.value })} className={inputCls} />
            </Field>
            <Field id="cta2" label="Tweede knop">
              <input id="cta2" value={hero.secondaryCta} onChange={(e) => setHero({ ...hero, secondaryCta: e.target.value })} className={inputCls} />
            </Field>
            <SaveButton />
          </form>
        </Card>

        <Card title="Pagina's">
          <ul className="divide-y divide-navy-100">
            {demoWebsite.pages.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium text-navy-900">{p.label}</span>
                  <span className="block truncate font-mono text-xs text-navy-400">{p.path}</span>
                </span>
                <span className="flex items-center gap-2">
                  <DemoBadge label={p.status} />
                  <a href={p.path} target="_blank" rel="noopener noreferrer" aria-label={`${p.label} openen`} className="inline-flex size-11 items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 hover:text-navy-900 sm:size-9">
                    <ExternalLink className="size-4" />
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
