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
  // Basic equipment
  dj: z.boolean().default(false),
  djSchedule: z.string().optional(),
  sound: z.boolean().default(false),
  lighting: z.boolean().default(false),
  lightingType: z.enum(["estándar", "profesional"]).optional(),
  
  // Extra equipment
  ledFloor: z.boolean().default(false),
  archStructure: z.boolean().default(false),
  spiderStructure: z.boolean().default(false),
  fogMachine: z.boolean().default(false),
  ledDecoration: z.number().min(0).default(0),
  wirelessMic: z.number().min(0).default(0),
  outsideTransport: z.boolean().default(false),
  
  // Legacy fields
  microphones: z.number().min(0).max(10).default(0),
  speakers: z.number().min(0).max(20).default(4),
})

// Payment method type
export const paymentMethodSchema = z.enum(["mercadopago", "transfer"]).optional()

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
  acceptCancellationPolicy: z.boolean().default(false).refine(val => val === true, {
    message: "Debes aceptar la política de cancelación",
  }),
  paymentMethod: paymentMethodSchema,
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
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type QuoteFormData = z.infer<typeof quoteFormSchema>

export type QuoteTier = {
  name: string
  price: number
  features: string[]
}

export type EquipmentPrice = {
  name: string
  price: number
}

export type QuoteResult = {
  basic: QuoteTier
  standard: QuoteTier
  premium: QuoteTier
}
