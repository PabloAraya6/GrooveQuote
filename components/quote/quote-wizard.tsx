"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { EventDetailsStep } from "./steps/event-details-step"
import { EquipmentStep } from "./steps/equipment-step"
import { ReviewStep } from "./steps/review-step"
import { QuoteResultStep } from "./steps/quote-result-step"
import { CheckoutModal } from "./checkout-modal"
import { StepIndicator } from "./step-indicator"
import type { QuoteFormData, QuoteResult } from "@/lib/types"
import { loadFormData, saveFormData, calculateQuote } from "@/lib/utils"

const steps = ["Evento", "Equipamiento", "Revisión", "Presupuesto"]

export function QuoteWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<QuoteFormData>>({
    eventDetails: undefined,
    equipment: undefined,
    contact: undefined,
  })
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<"basic" | "standard" | "premium" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved form data on initial render
  useEffect(() => {
    const savedData = loadFormData()
    if (savedData) {
      setFormData(savedData)
    }
  }, [])

  // Save form data whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormData(formData)
    }
  }, [formData])

  const updateFormData = (stepData: Partial<QuoteFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }

    // If moving to quote result step, calculate quote
    if (currentStep === 2) {
      setIsLoading(true)
      try {
        const result = await calculateQuote(formData as QuoteFormData)
        setQuoteResult(result)
      } catch (error) {
        console.error("Error calculating quote", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSelectTier = (tier: "basic" | "standard" | "premium") => {
    setSelectedTier(tier)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false)
    router.push("/success")
  }

  return (
    <div className="container mx-auto min-h-screen max-w-4xl px-4 py-8">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border p-6 shadow-sm"
          >
            {currentStep === 0 && (
              <EventDetailsStep
                data={formData.eventDetails}
                onUpdate={(data) => updateFormData({ eventDetails: data })}
                onNext={handleNext}
              />
            )}
            {currentStep === 1 && (
              <EquipmentStep
                data={formData.equipment}
                onUpdate={(data) => updateFormData({ equipment: data })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 2 && (
              <ReviewStep
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                onEdit={(step) => setCurrentStep(step)}
              />
            )}
            {currentStep === 3 && (
              <QuoteResultStep
                isLoading={isLoading}
                quoteResult={quoteResult}
                onSelectTier={handleSelectTier}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isCheckoutOpen && selectedTier && quoteResult && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          tier={quoteResult[selectedTier]}
          onSubmit={(contactData) => {
            updateFormData({ contact: contactData })
            handleCheckoutComplete()
          }}
        />
      )}
    </div>
  )
}
