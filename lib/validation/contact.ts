import { z } from "zod";
import { emailSchema, nameSchema } from "./quote";

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  message: z.string().trim().min(10, "Schrijf minimaal een korte toelichting").max(3000, "Bericht is te lang"),
  privacyAccepted: z.literal(true, { message: "U moet akkoord gaan met de privacyverklaring" }),
  /** Honeypot */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
