"use client"

import React from "react"
import { CalendarIcon, InfoIcon, DollarSignIcon, MusicIcon } from "lucide-react"
import { Stepper, StepItem } from "@/components/ui/stepper"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

const mapStepsToStepItems = (steps: string[]): StepItem[] => {
  const icons = [
    <InfoIcon key="info" />,
    <MusicIcon key="music" />,
    <CalendarIcon key="calendar" />,
    <DollarSignIcon key="dollar" />,
  ]

  return steps.map((step, index) => ({
    id: index,
    title: step,
    description: `Paso ${index + 1}`,
    icon: icons[index % icons.length]
  }))
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const stepItems = React.useMemo(() => mapStepsToStepItems(steps), [steps])
  
  return (
    <div className="w-full flex justify-center py-4 px-4">
      <div className="w-full max-w-3xl">
        <Stepper
          steps={stepItems}
          activeStep={currentStep}
          disableFutureSteps={false}
        />
      </div>
    </div>
  )
}
