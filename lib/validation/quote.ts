import { z } from "zod";
import {
  serviceOptions,
  propertyTypeOptions,
  sizeOptions,
  periodOptions,
  surfaceOptionsFor,
  contaminationOptionsFor,
  uploadConfig,
} from "@/config/quote";

const values = (opts: { value: string }[]) => opts.map((o) => o.value) as [string, ...string[]];

/** Nederlandse postcode: 1234 AB (spatie optioneel, hoofdletterongevoelig) */
export const postalCodeSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\s+/g, "").toUpperCase())
  .pipe(z.string().regex(/^[1-9][0-9]{3}[A-Z]{2}$/, "Vul een geldige postcode in (bijv. 7511 AB)"))
  .transform((v) => `${v.slice(0, 4)} ${v.slice(4)}`);

/** Nederlands telefoonnummer, ruim geaccepteerd (06…, 053…, +31…) */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Vul uw telefoonnummer in")
  .transform((v) => v.replace(/[\s\-().]/g, ""))
  .pipe(z.string().regex(/^(\+31|0031|0)[1-9][0-9]{8}$/, "Vul een geldig telefoonnummer in"));

export const emailSchema = z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in").max(254);

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Vul uw naam in")
  .max(100, "Naam is te lang")
  .regex(/^[\p{L}\p{M}'’\-. ]+$/u, "Naam bevat ongeldige tekens");

/** Pad van een geüploade foto in de quote-uploads bucket: <uploadSession>/<uuid>.<ext> */
export const photoPathSchema = z
  .string()
  .regex(/^[a-f0-9]{32}\/[a-f0-9-]{36}\.(jpg|jpeg|png|webp)$/i, "Ongeldige foto-referentie");

export const quoteRequestSchema = z
  .object({
    service: z.enum(values(serviceOptions), { message: "Kies wat u wilt laten reinigen" }),
    serviceOther: z.string().trim().max(200).optional().nullable(),
    propertyType: z.enum(values(propertyTypeOptions), { message: "Kies een pandtype" }),
    surfaceType: z.string().trim().min(1, "Kies een oppervlak").max(60),
    surfaceOther: z.string().trim().max(200).optional().nullable(),
    estimatedSize: z.enum(values(sizeOptions), { message: "Kies een omvang" }),
    estimatedM2: z
      .number()
      .positive("Vul een positief getal in")
      .max(100000, "Dit lijkt geen realistische oppervlakte")
      .optional()
      .nullable(),
    contaminationTypes: z.array(z.string().max(60)).min(1, "Kies minimaal één optie").max(12),
    contaminationOther: z.string().trim().max(200).optional().nullable(),
    photoPaths: z.array(photoPathSchema).max(uploadConfig.maxFiles, `Maximaal ${uploadConfig.maxFiles} foto's`),
    postalCode: postalCodeSchema,
    houseNumber: z
      .string()
      .trim()
      .min(1, "Vul uw huisnummer in")
      .max(10, "Huisnummer is te lang")
      .regex(/^[0-9]+[a-zA-Z0-9\-\s]*$/, "Vul een geldig huisnummer in"),
    city: z.string().trim().min(2, "Vul uw plaats in").max(80),
    desiredPeriod: z.enum(values(periodOptions), { message: "Kies een periode" }),
    desiredDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum")
      .optional()
      .nullable(),
    customerName: nameSchema,
    phone: phoneSchema,
    email: emailSchema,
    message: z.string().trim().max(2000, "Opmerking is te lang (max. 2000 tekens)").optional().nullable(),
    privacyAccepted: z.literal(true, { message: "U moet akkoord gaan met de privacyverklaring" }),
    /** Honeypot — moet leeg blijven */
    website: z.string().max(0).optional(),
    utm: z
      .object({
        source: z.string().max(100).optional().nullable(),
        medium: z.string().max(100).optional().nullable(),
        campaign: z.string().max(100).optional().nullable(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const surfaces = surfaceOptionsFor(data.service).map((o) => o.value);
    if (!surfaces.includes(data.surfaceType)) {
      ctx.addIssue({ code: "custom", path: ["surfaceType"], message: "Kies een oppervlak" });
    }
    const contaminations = contaminationOptionsFor(data.service).map((o) => o.value);
    for (const c of data.contaminationTypes) {
      if (!contaminations.includes(c)) {
        ctx.addIssue({ code: "custom", path: ["contaminationTypes"], message: "Ongeldige keuze" });
        break;
      }
    }
    if (data.service === "anders" && !data.serviceOther) {
      ctx.addIssue({ code: "custom", path: ["serviceOther"], message: "Omschrijf kort wat u wilt laten reinigen" });
    }
  });

export type QuoteRequestInput = z.input<typeof quoteRequestSchema>;
export type QuoteRequestData = z.output<typeof quoteRequestSchema>;

/**
 * Client-side validatie per wizardstap. Geeft een map van veld → foutmelding.
 * Gebruikt dezelfde regels als het serverschema zodat client en server consistent zijn.
 */
export function validateStep(stepId: string, data: Partial<QuoteRequestInput>): Record<string, string> {
  const errors: Record<string, string> = {};
  const pick = (schema: z.ZodTypeAny, key: string, value: unknown) => {
    const r = schema.safeParse(value);
    if (!r.success) errors[key] = r.error.issues[0]?.message ?? "Ongeldige invoer";
  };

  switch (stepId) {
    case "service":
      pick(z.enum(values(serviceOptions), { message: "Kies wat u wilt laten reinigen" }), "service", data.service);
      if (data.service === "anders" && !data.serviceOther?.trim()) {
        errors.serviceOther = "Omschrijf kort wat u wilt laten reinigen";
      }
      break;
    case "property":
      pick(z.enum(values(propertyTypeOptions), { message: "Kies een pandtype" }), "propertyType", data.propertyType);
      break;
    case "surface": {
      const allowed = surfaceOptionsFor(data.service).map((o) => o.value);
      if (!data.surfaceType || !allowed.includes(data.surfaceType)) errors.surfaceType = "Kies een oppervlak";
      break;
    }
    case "size":
      pick(z.enum(values(sizeOptions), { message: "Kies een omvang" }), "estimatedSize", data.estimatedSize);
      if (data.estimatedM2 != null) {
        pick(z.number().positive().max(100000, "Dit lijkt geen realistische oppervlakte"), "estimatedM2", data.estimatedM2);
      }
      break;
    case "contamination":
      if (!data.contaminationTypes || data.contaminationTypes.length === 0) {
        errors.contaminationTypes = "Kies minimaal één optie";
      }
      break;
    case "photos":
      break; // optioneel
    case "location":
      pick(postalCodeSchema, "postalCode", data.postalCode ?? "");
      pick(z.string().trim().min(1, "Vul uw huisnummer in").max(10), "houseNumber", data.houseNumber ?? "");
      pick(z.string().trim().min(2, "Vul uw plaats in").max(80), "city", data.city ?? "");
      break;
    case "period":
      pick(z.enum(values(periodOptions), { message: "Kies een periode" }), "desiredPeriod", data.desiredPeriod);
      break;
    case "contact":
      pick(nameSchema, "customerName", data.customerName ?? "");
      pick(phoneSchema, "phone", data.phone ?? "");
      pick(emailSchema, "email", data.email ?? "");
      pick(z.string().max(2000, "Opmerking is te lang"), "message", data.message ?? "");
      break;
    case "review":
      if (data.privacyAccepted !== true) errors.privacyAccepted = "U moet akkoord gaan met de privacyverklaring";
      break;
  }
  return errors;
}
