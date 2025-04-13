import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { QuoteFormData, QuoteResult } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to save form data to localStorage
export function saveFormData(data: Partial<QuoteFormData>) {
  if (typeof window !== "undefined") {
    localStorage.setItem("quoteFormData", JSON.stringify(data))
  }
}

// Function to load form data from localStorage
export function loadFormData(): Partial<QuoteFormData> | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("quoteFormData")
    if (data) {
      try {
        const parsedData = JSON.parse(data)

        // Convert date string back to Date object if it exists
        if (parsedData.eventDetails?.date) {
          parsedData.eventDetails.date = new Date(parsedData.eventDetails.date)
        }

        return parsedData
      } catch (error) {
        console.error("Error parsing form data from localStorage", error)
        return null
      }
    }
  }
  return null
}

// Function to clear form data from localStorage
export function clearFormData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("quoteFormData")
  }
}

// Function to calculate quote based on form data
export async function calculateQuote(data: QuoteFormData): Promise<QuoteResult> {
  // Simulate API call with 1s delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Base prices
      const basePrice = 500
      const guestFactor = Math.ceil(data.eventDetails.guestCount / 50) * 100

      // Equipment factors
      const soundPrice = data.equipment.sound ? 300 : 0
      const lightingPrice = data.equipment.lighting ? 250 : 0
      const ledFloorPrice = data.equipment.ledFloor ? 400 : 0
      const djPrice = data.equipment.dj ? 350 : 0
      const microphonePrice = data.equipment.microphones * 50
      const speakerPrice = data.equipment.speakers * 75

      // Calculate total equipment price
      const equipmentTotal = soundPrice + lightingPrice + ledFloorPrice + djPrice + microphonePrice + speakerPrice

      // Calculate basic tier
      const basicPrice = basePrice + guestFactor + equipmentTotal

      // Calculate standard tier (20% more than basic)
      const standardPrice = Math.round(basicPrice * 1.2)

      // Calculate premium tier (50% more than basic)
      const premiumPrice = Math.round(basicPrice * 1.5)

      const result: QuoteResult = {
        basic: {
          name: "Básico",
          price: basicPrice,
          features: ["Equipo estándar", "Técnico de sonido", "Montaje y desmontaje"],
        },
        standard: {
          name: "Estándar",
          price: standardPrice,
          features: [
            "Todo lo del plan Básico",
            "Equipo de mayor calidad",
            "Iluminación mejorada",
            "Asistente técnico adicional",
          ],
        },
        premium: {
          name: "Premium",
          price: premiumPrice,
          features: [
            "Todo lo del plan Estándar",
            "Equipo profesional de alta gama",
            "Iluminación personalizada",
            "DJ profesional incluido",
            "Soporte técnico prioritario",
          ],
        },
      }

      resolve(result)
    }, 1000)
  })
}
