"use client"

import React, { useState, useEffect } from "react"
import { CalendarIcon, InfoIcon, DollarSignIcon, MusicIcon } from "lucide-react"
import { Stepper, StepItem } from "@/components/ui/stepper"
import { motion } from "framer-motion"

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
  const [hasAnimated, setHasAnimated] = useState(false)
  
  // Set hasAnimated to true after initial mount
  useEffect(() => {
    setHasAnimated(true)
  }, [])
  
  return (
    <motion.div 
      className="w-full flex justify-center py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="w-full max-w-3xl">
        <Stepper
          steps={stepItems}
          activeStep={currentStep}
          disableFutureSteps={false}
        />
      </div>
    </motion.div>
  )
}
