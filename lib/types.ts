import { z } from "zod"

// Event details schema
export const eventDetailsSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres",
  }),
  eventType: z.enum(["boda", "corporativo", "fiesta", "concierto", "otro"], {
    required_error: "El tipo de evento es requerido",
  }),
  guestCount: z.number().min(10).max(1000),
})

// Equipment schema
export const equipmentSchema = z.object({
  sound: z.boolean().optional(),
  lighting: z.boolean().optional(),
  ledFloor: z.boolean().optional(),
  dj: z.boolean().optional(),
  microphones: z.number().min(0).max(10).optional(),
  speakers: z.number().min(0).max(20).optional(),
})

// Contact schema
export const contactSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  email: z.string().email({
    message: "Correo electrónico inválido",
  }),
  phone: z.string().min(8, {
    message: "Número de teléfono inválido",
  }),
})

// Complete form schema
export const quoteFormSchema = z.object({
  eventDetails: eventDetailsSchema,
  equipment: equipmentSchema,
  contact: contactSchema,
})

export type EventDetails = z.infer<typeof eventDetailsSchema>
export type Equipment = z.infer<typeof equipmentSchema>
export type Contact = z.infer<typeof contactSchema>
export type QuoteFormData = z.infer<typeof quoteFormSchema>

export type QuoteTier = {
  name: string
  price: number
  features: string[]
}

export type QuoteResult = {
  basic: QuoteTier
  standard: QuoteTier
  premium: QuoteTier
}
