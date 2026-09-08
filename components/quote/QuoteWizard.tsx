"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormAlert, TextArea, TextInput } from "@/components/ui/Field";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import {
  contaminationOptionsFor,
  labelFor,
  periodOptions,
  propertyTypeOptions,
  quoteSteps,
  serviceOptions,
  sizeOptions,
  surfaceOptionsFor,
  type QuoteStepId,
} from "@/config/quote";
import { siteConfig } from "@/config/site";
import { validateStep, type QuoteRequestInput } from "@/lib/validation/quote";
import { captureUtm, track } from "@/lib/analytics";
import { cn } from "@/lib/utils/cn";
import { OptionCard } from "./OptionCard";
import { PhotoUploader, type UploadedPhoto } from "./PhotoUploader";
import { ProgressBar } from "./ProgressBar";
import { QuoteSuccess } from "./QuoteSuccess";

type Draft = Partial<QuoteRequestInput> & { contaminationTypes: string[]; photoPaths: string[] };

const DRAFT_KEY = "aic_quote_draft";

function randomSession(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const emptyDraft: Draft = { contaminationTypes: [], photoPaths: [], city: "" };

/** Concept uit sessionStorage + ?dienst=… (alleen client-side; de wizard wordt zonder SSR geladen). */
function loadInitialDraft(dienst: string | null): Draft {
  let draft: Draft = { ...emptyDraft };
  try {
    const stored = sessionStorage.getItem(DRAFT_KEY);
    if (stored) draft = { ...draft, ...JSON.parse(stored), photoPaths: [], privacyAccepted: undefined };
  } catch {
    /* ignore */
  }
  if (dienst && serviceOptions.some((o) => o.value === dienst)) draft.service = dienst;
  return draft;
}

export function QuoteWizard() {
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [data, setData] = useState<Draft>(() => loadInitialDraft(searchParams.get("dienst")));
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<{ quoteNumber: string } | null>(null);
  const [session] = useState(randomSession);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  const step = quoteSteps[stepIndex]!;
  const total = quoteSteps.length;

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    track({ name: "quote_started" });
  }, []);

  // Concept bewaren (zonder foto's en zonder privacy-akkoord)
  useEffect(() => {
    try {
      const { photoPaths: _p, privacyAccepted: _a, ...rest } = data;
      void _p;
      void _a;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [data]);

  // Focus op de staptitel bij navigeren (toegankelijkheid)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [stepIndex, reduce]);

  const update = useCallback(<K extends keyof Draft>(key: K, value: Draft[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }, []);

  const setService = (value: string) => {
    setData((d) => ({
      ...d,
      service: value,
      // afhankelijke keuzes resetten bij wisselen van dienst
      surfaceType: d.service === value ? d.surfaceType : undefined,
      contaminationTypes: d.service === value ? d.contaminationTypes : [],
    }));
    setErrors({});
  };

  const goTo = (index: number) => {
    setDirection(index > stepIndex ? 1 : -1);
    setStepIndex(Math.max(0, Math.min(total - 1, index)));
    setServerError(null);
  };

  const next = () => {
    const stepErrors = validateStep(step.id, data);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    track({ name: "quote_step_completed", step: step.id, stepIndex: stepIndex + 1 });
    goTo(stepIndex + 1);
  };

  const prev = () => goTo(stepIndex - 1);

  const uploading = photos.some((p) => p.status === "uploading");
  const photoPaths = useMemo(() => photos.filter((p) => p.status === "done" && p.path).map((p) => p.path!), [photos]);

  async function submit() {
    if (submitting) return;
    const stepErrors = validateStep("review", data);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    if (uploading) {
      setServerError("Een of meer foto's worden nog geüpload. Wacht een moment en probeer het opnieuw.");
      return;
    }
    setSubmitting(true);
    setServerError(null);

    const payload = {
      ...data,
      estimatedM2: data.estimatedM2 ?? null,
      photoPaths,
      utm: captureUtm(),
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) {
          setErrors(json.fieldErrors);
          // Spring naar de eerste stap met een fout
          const firstKey = Object.keys(json.fieldErrors)[0] ?? "";
          const idx = quoteSteps.findIndex((s) => fieldStep[firstKey] === s.id);
          if (idx >= 0) goTo(idx);
        }
        setServerError(json.error ?? "Er ging iets mis. Probeer het opnieuw.");
        track({ name: "quote_failed", reason: String(res.status) });
        return;
      }
      setResult({ quoteNumber: json.quoteNumber });
      track({ name: "quote_submitted", quoteNumber: json.quoteNumber, service: data.service ?? "" });
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    } catch {
      setServerError("Geen verbinding. Controleer uw internet en probeer het opnieuw.");
      track({ name: "quote_failed", reason: "network" });
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const serviceLabel =
      data.service === "anders" && data.serviceOther ? `Anders: ${data.serviceOther}` : labelFor(serviceOptions, data.service);
    return (
      <div className="rounded-4xl bg-white p-8 shadow-lift ring-1 ring-navy-100 sm:p-12">
        <QuoteSuccess quoteNumber={result.quoteNumber} serviceLabel={serviceLabel} photoCount={photoPaths.length} />
      </div>
    );
  }

  const variants = {
    enter: (dir: number) => ({ x: reduce ? 0 : dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: reduce ? 0 : dir * -40, opacity: 0 }),
  };

  const isLast = stepIndex === total - 1;

  return (
    <div className="rounded-4xl bg-white shadow-lift ring-1 ring-navy-100">
      <div className="border-b border-navy-100 px-5 py-5 sm:px-8">
        <ProgressBar current={stepIndex + 1} total={total} label={step.short} />
      </div>

      <div className="relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-navy-900 outline-none sm:text-3xl">
              {step.title}
            </h2>
            <div className="mt-6">
              <StepContent
                stepId={step.id}
                data={data}
                errors={errors}
                update={update}
                setService={setService}
                photos={photos}
                setPhotos={setPhotos}
                session={session}
                goTo={goTo}
                photoCount={photoPaths.length}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-navy-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          {stepIndex > 0 ? (
            <Button variant="ghost" onClick={prev} icon={<ArrowLeft className="size-4" />} iconPosition="left" disabled={submitting}>
              Vorige
            </Button>
          ) : (
            <Link href="/" className="inline-flex h-12 items-center px-2 text-sm font-semibold text-navy-500 hover:text-navy-900">
              Annuleren
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          {serverError && <FormAlert type="error">{serverError}</FormAlert>}
          {isLast ? (
            <Button
              size="lg"
              onClick={submit}
              disabled={submitting || uploading}
              aria-busy={submitting}
              icon={submitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />}
            >
              {submitting ? "Uw aanvraag wordt verzonden…" : uploading ? "Foto's uploaden…" : "Offerte aanvragen"}
            </Button>
          ) : (
            <Button size="lg" onClick={next} icon={<ArrowRight className="size-5" />}>
              {step.id === "photos" && photos.length === 0 ? "Overslaan" : "Volgende"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Welk veld hoort bij welke stap — voor het terugspringen bij serverfouten. */
const fieldStep: Record<string, QuoteStepId> = {
  service: "service",
  serviceOther: "service",
  propertyType: "property",
  surfaceType: "surface",
  surfaceOther: "surface",
  estimatedSize: "size",
  estimatedM2: "size",
  contaminationTypes: "contamination",
  contaminationOther: "contamination",
  photoPaths: "photos",
  postalCode: "location",
  houseNumber: "location",
  city: "location",
  desiredPeriod: "period",
  desiredDate: "period",
  customerName: "contact",
  phone: "contact",
  email: "contact",
  message: "contact",
  privacyAccepted: "review",
};

function StepContent({
  stepId,
  data,
  errors,
  update,
  setService,
  photos,
  setPhotos,
  session,
  goTo,
  photoCount,
}: {
  stepId: QuoteStepId;
  data: Draft;
  errors: Record<string, string>;
  update: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
  setService: (v: string) => void;
  photos: UploadedPhoto[];
  setPhotos: (next: UploadedPhoto[] | ((prev: UploadedPhoto[]) => UploadedPhoto[])) => void;
  session: string;
  goTo: (i: number) => void;
  photoCount: number;
}) {
  const today = new Date().toISOString().slice(0, 10);

  switch (stepId) {
    case "service":
      return (
        <div className="space-y-4">
          <div role="radiogroup" aria-label="Dienst" className="grid gap-3 sm:grid-cols-2">
            {serviceOptions.map((o) => (
              <OptionCard
                key={o.value}
                label={o.label}
                description={o.description}
                icon={<ServiceIcon name={o.icon} className="size-6" />}
                selected={data.service === o.value}
                onSelect={() => setService(o.value)}
              />
            ))}
          </div>
          {errors.service && <ErrorText>{errors.service}</ErrorText>}
          {data.service === "anders" && (
            <TextInput
              id="serviceOther"
              label="Wat wilt u laten reinigen?"
              placeholder="Bijv. terras, oprit, schutting…"
              value={data.serviceOther ?? ""}
              onChange={(e) => update("serviceOther", e.target.value)}
              error={errors.serviceOther}
              autoFocus
            />
          )}
        </div>
      );

    case "property":
      return (
        <div className="space-y-3">
          <div role="radiogroup" aria-label="Pandtype" className="grid gap-3 sm:grid-cols-2">
            {propertyTypeOptions.map((o) => (
              <OptionCard key={o.value} label={o.label} selected={data.propertyType === o.value} onSelect={() => update("propertyType", o.value)} />
            ))}
          </div>
          {errors.propertyType && <ErrorText>{errors.propertyType}</ErrorText>}
        </div>
      );

    case "surface": {
      const options = surfaceOptionsFor(data.service);
      return (
        <div className="space-y-4">
          <p className="-mt-3 text-sm text-navy-500">Gekozen dienst: <strong className="text-navy-800">{labelFor(serviceOptions, data.service)}</strong></p>
          <div role="radiogroup" aria-label="Oppervlak" className="grid gap-3 sm:grid-cols-2">
            {options.map((o) => (
              <OptionCard key={o.value} size="sm" label={o.label} selected={data.surfaceType === o.value} onSelect={() => update("surfaceType", o.value)} />
            ))}
          </div>
          {errors.surfaceType && <ErrorText>{errors.surfaceType}</ErrorText>}
          {data.surfaceType === "anders" && (
            <TextInput id="surfaceOther" label="Omschrijving" placeholder="Wat wilt u precies laten reinigen?" value={data.surfaceOther ?? ""} onChange={(e) => update("surfaceOther", e.target.value)} optional />
          )}
        </div>
      );
    }

    case "size":
      return (
        <div className="space-y-6">
          <div role="radiogroup" aria-label="Omvang" className="grid gap-3 sm:grid-cols-2">
            {sizeOptions.map((o) => (
              <OptionCard key={o.value} label={o.label} description={o.description} selected={data.estimatedSize === o.value} onSelect={() => update("estimatedSize", o.value)} />
            ))}
          </div>
          {errors.estimatedSize && <ErrorText>{errors.estimatedSize}</ErrorText>}
          <div className="rounded-2xl bg-navy-50 p-4 sm:p-5">
            <TextInput
              id="estimatedM2"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              label="Geschatte oppervlakte in m²"
              optional
              hint="Weet u het niet? Geen probleem — wij beoordelen het aan de hand van uw foto's."
              placeholder="Bijv. 120"
              value={data.estimatedM2 ?? ""}
              onChange={(e) => update("estimatedM2", e.target.value === "" ? null : Number(e.target.value))}
              error={errors.estimatedM2}
            />
          </div>
        </div>
      );

    case "contamination": {
      const options = contaminationOptionsFor(data.service);
      const selected = data.contaminationTypes;
      const toggle = (v: string) => update("contaminationTypes", selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
      return (
        <div className="space-y-4">
          <p className="-mt-3 text-sm text-navy-500">Meerdere antwoorden mogelijk.</p>
          <div role="group" aria-label="Soort vervuiling" className="grid gap-3 sm:grid-cols-2">
            {options.map((o) => (
              <OptionCard key={o.value} size="sm" multi label={o.label} selected={selected.includes(o.value)} onSelect={() => toggle(o.value)} />
            ))}
          </div>
          {errors.contaminationTypes && <ErrorText>{errors.contaminationTypes}</ErrorText>}
          {selected.includes("anders") && (
            <TextInput id="contaminationOther" label="Omschrijving" placeholder="Wat ziet u precies?" value={data.contaminationOther ?? ""} onChange={(e) => update("contaminationOther", e.target.value)} optional />
          )}
        </div>
      );
    }

    case "photos":
      return (
        <div className="space-y-5">
          <p className="-mt-3 text-navy-600">
            Met een paar foto&apos;s kunnen wij de situatie beter beoordelen. Maak ze gerust met uw telefoon — een overzichtsfoto en
            een close-up van de vervuiling zijn al voldoende.
          </p>
          <PhotoUploader session={session} photos={photos} onChange={setPhotos} />
          <p className="text-xs text-navy-400">
            Uw foto&apos;s worden veilig opgeslagen en alleen gebruikt om uw aanvraag te beoordelen. Ze worden nooit openbaar getoond.
          </p>
        </div>
      );

    case "location":
      return (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput id="postalCode" label="Postcode" autoComplete="postal-code" placeholder="7511 AB" value={data.postalCode ?? ""} onChange={(e) => update("postalCode", e.target.value)} error={errors.postalCode} required />
            <TextInput id="houseNumber" label="Huisnummer" autoComplete="address-line2" placeholder="12a" value={data.houseNumber ?? ""} onChange={(e) => update("houseNumber", e.target.value)} error={errors.houseNumber} required />
          </div>
          <div>
            <TextInput id="city" label="Plaats" autoComplete="address-level2" placeholder="Bijv. Enschede" value={data.city ?? ""} onChange={(e) => update("city", e.target.value)} error={errors.city} required />
            {!data.city && (
              <button type="button" onClick={() => update("city", siteConfig.city)} className="mt-2 rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700 hover:bg-aqua-100 hover:text-aqua-800">
                + {siteConfig.city}
              </button>
            )}
          </div>
        </div>
      );

    case "period":
      return (
        <div className="space-y-6">
          <div role="radiogroup" aria-label="Gewenste periode" className="grid gap-3 sm:grid-cols-2">
            {periodOptions.map((o) => (
              <OptionCard key={o.value} label={o.label} selected={data.desiredPeriod === o.value} onSelect={() => update("desiredPeriod", o.value)} />
            ))}
          </div>
          {errors.desiredPeriod && <ErrorText>{errors.desiredPeriod}</ErrorText>}
          <div className="rounded-2xl bg-navy-50 p-4 sm:p-5">
            <TextInput id="desiredDate" type="date" min={today} label="Gewenste datum" optional hint="Alleen als u een specifieke datum in gedachten heeft." value={data.desiredDate ?? ""} onChange={(e) => update("desiredDate", e.target.value || null)} error={errors.desiredDate} className="max-w-xs" />
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-5">
          <TextInput id="customerName" label="Naam" autoComplete="name" value={data.customerName ?? ""} onChange={(e) => update("customerName", e.target.value)} error={errors.customerName} required />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput id="phone" type="tel" label="Telefoonnummer" autoComplete="tel" placeholder="06 12345678" value={data.phone ?? ""} onChange={(e) => update("phone", e.target.value)} error={errors.phone} required />
            <TextInput id="email" type="email" label="E-mailadres" autoComplete="email" value={data.email ?? ""} onChange={(e) => update("email", e.target.value)} error={errors.email} required />
          </div>
          <TextArea id="message" label="Opmerkingen" optional placeholder="Bijzonderheden, bereikbaarheid, vragen…" value={data.message ?? ""} onChange={(e) => update("message", e.target.value)} error={errors.message} />
          {/* Honeypot */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input id="website" type="text" tabIndex={-1} autoComplete="off" value={data.website ?? ""} onChange={(e) => update("website", e.target.value)} />
          </div>
        </div>
      );

    case "review": {
      const serviceLabel = data.service === "anders" && data.serviceOther ? `Anders: ${data.serviceOther}` : labelFor(serviceOptions, data.service);
      const surface = labelFor(surfaceOptionsFor(data.service), data.surfaceType);
      const contamination = data.contaminationTypes.map((c) => labelFor(contaminationOptionsFor(data.service), c)).join(", ");
      const size = data.estimatedM2 ? `${labelFor(sizeOptions, data.estimatedSize)} · ±${data.estimatedM2} m²` : labelFor(sizeOptions, data.estimatedSize);
      const period = data.desiredDate ? `${labelFor(periodOptions, data.desiredPeriod)} · ${data.desiredDate}` : labelFor(periodOptions, data.desiredPeriod);
      const rows: { label: string; value: string; step: QuoteStepId }[] = [
        { label: "Dienst", value: serviceLabel, step: "service" },
        { label: "Pand", value: labelFor(propertyTypeOptions, data.propertyType), step: "property" },
        { label: "Oppervlak", value: data.surfaceOther ? `${surface}: ${data.surfaceOther}` : surface, step: "surface" },
        { label: "Omvang", value: size, step: "size" },
        { label: "Vervuiling", value: data.contaminationOther ? `${contamination} (${data.contaminationOther})` : contamination, step: "contamination" },
        { label: "Foto's", value: `${photoCount} toegevoegd`, step: "photos" },
        { label: "Locatie", value: `${formatPostalCode(data.postalCode)} ${data.houseNumber ?? ""}, ${data.city ?? ""}`, step: "location" },
        { label: "Gewenste periode", value: period, step: "period" },
        { label: "Contact", value: `${data.customerName ?? ""} · ${data.phone ?? ""} · ${data.email ?? ""}`, step: "contact" },
      ];
      return (
        <div className="space-y-6">
          <dl className="divide-y divide-navy-100 rounded-3xl bg-navy-50 ring-1 ring-navy-100">
            {rows.map((r) => (
              <div key={r.label} className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-400">{r.label}</dt>
                  <dd className="mt-0.5 break-words text-[15px] font-medium text-navy-900">{r.value || "—"}</dd>
                </div>
                <button
                  type="button"
                  onClick={() => goTo(quoteSteps.findIndex((s) => s.id === r.step))}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-aqua-700 transition-colors hover:bg-white"
                >
                  <Pencil className="size-3" aria-hidden />
                  Aanpassen
                </button>
              </div>
            ))}
          </dl>
          {data.message && (
            <div className="rounded-2xl bg-white p-4 text-sm text-navy-700 ring-1 ring-navy-100">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-navy-400">Opmerkingen</span>
              <p className="mt-1 whitespace-pre-line">{data.message}</p>
            </div>
          )}
          <Checkbox
            id="privacyAccepted"
            checked={data.privacyAccepted === true}
            onChange={(e) => update("privacyAccepted", e.target.checked ? true : undefined)}
            error={errors.privacyAccepted}
            label={
              <>
                Ik ga akkoord met de{" "}
                <Link href="/privacy" target="_blank" className="font-semibold text-aqua-700 underline-offset-2 hover:underline">
                  privacyverklaring
                </Link>
                . Mijn gegevens en foto&apos;s worden alleen gebruikt om deze aanvraag te beoordelen.
              </>
            }
          />
          <p className="text-xs text-navy-400">
            Wij berekenen geen automatische prijs. All in One Cleaning beoordeelt uw aanvraag persoonlijk en neemt daarna contact met u op.
          </p>
        </div>
      );
    }
  }
}

function formatPostalCode(value: string | null | undefined): string {
  const v = (value ?? "").replace(/\s+/g, "").toUpperCase();
  return v.length === 6 ? `${v.slice(0, 4)} ${v.slice(4)}` : (value ?? "");
}

function ErrorText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p role="alert" className={cn("text-sm text-red-600", className)}>
      {children}
    </p>
  );
}
