"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Tipos para los pasos
export interface StepItem {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

// Props para el componente Stepper
export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepItem[]
  activeStep: number
  onNext?: () => void
  onPrev?: () => void
  onStepChange?: (step: number) => void
  disableFutureSteps?: boolean
  orientation?: "vertical" | "horizontal"
}

// Props para el componente Step
export interface StepProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onClick'> {
  step: StepItem
  index: number
  activeStep: number
  isLast: boolean
  onClick: (index: number) => void
  disabled?: boolean
}

// Componente Step
const Step = React.forwardRef<HTMLLIElement, StepProps>(
  ({ step, index, activeStep, isLast, onClick, disabled, className, ...props }, ref) => {
    const isActive = index === activeStep
    const isCompleted = index < activeStep

    return (
      <li
        ref={ref}
        className={cn("relative flex-1", className)}
        role="listitem"
        aria-current={isActive ? "step" : undefined}
        {...props}
      >
        {/* Contenedor principal */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center w-full">
            {/* Línea horizontal a la izquierda (excepto el primer paso) */}
            {index !== 0 && (
              <div className="absolute left-0 right-1/2 top-1/2 -translate-y-1/2">
                <div className={cn(
                  "h-[2px] w-full", 
                  isCompleted || isActive ? "bg-primary" : "bg-gray-200"
                )} />
              </div>
            )}
            
            {/* Línea horizontal a la derecha (excepto el último paso) */}
            {!isLast && (
              <div className="absolute left-1/2 right-0 top-1/2 -translate-y-1/2">
                <div className={cn(
                  "h-[2px] w-full", 
                  isCompleted ? "bg-primary" : "bg-gray-200"
                )} />
              </div>
            )}
            
            {/* Círculo del paso */}
            <button
              onClick={() => !disabled && onClick(index)}
              className={cn(
                "relative z-10 flex items-center justify-center rounded-full border-2 transition-colors",
                "h-10 w-10",
                isActive
                  ? "border-primary bg-primary text-white"
                  : isCompleted
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-400",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              )}
              disabled={disabled}
              aria-disabled={disabled}
              type="button"
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <div className="flex items-center justify-center">
                  {React.isValidElement(step.icon)
                    ? React.cloneElement(step.icon as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
                        className: "h-5 w-5",
                      })
                    : step.icon}
                </div>
              )}
            </button>
          </div>

          {/* Texto (visible solo para el paso activo en móvil) */}
          <div className={cn(
            "flex flex-col items-center text-center mt-2",
            !isActive && "hidden md:flex" // Hide labels for non-active steps on mobile
          )}>
            <span 
              className={cn(
                "font-medium text-base", 
                isActive ? "text-primary" : "text-gray-600"
              )}
            >
              {step.title}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">{step.description}</span>
          </div>
        </div>
      </li>
    )
  },
)
Step.displayName = "Step"

// Componente Stepper
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      activeStep = 0,
      onNext,
      onPrev,
      onStepChange,
      disableFutureSteps = false,
      orientation = "horizontal",
      className,
      ...props
    },
    ref,
  ) => {
    const handleStepClick = React.useCallback(
      (stepIndex: number) => {
        if (disableFutureSteps && stepIndex > activeStep) {
          return
        }

        if (onStepChange) {
          onStepChange(stepIndex)
        } else if (stepIndex < activeStep && onPrev) {
          onPrev()
        } else if (stepIndex > activeStep && onNext) {
          onNext()
        }
      },
      [activeStep, disableFutureSteps, onNext, onPrev, onStepChange],
    )

    return (
      <div ref={ref} className={cn("w-full px-6", className)} {...props}>
        <ul
          className="flex w-full justify-between py-4"
          role="list"
        >
          {steps.map((step, index) => (
            <Step
              key={step.id}
              step={step}
              index={index}
              activeStep={activeStep}
              isLast={index === steps.length - 1}
              onClick={handleStepClick}
              disabled={disableFutureSteps && index > activeStep}
            />
          ))}
        </ul>
      </div>
    )
  },
)
Stepper.displayName = "Stepper"

// Componente StepperContent para mostrar el contenido del paso activo
interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number
  steps: StepItem[]
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ activeStep, steps, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mt-8", className)} {...props}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="border-t-4 border-t-primary">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                    {React.isValidElement(steps[activeStep].icon)
                      ? React.cloneElement(steps[activeStep].icon as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
                          className: "h-4 w-4",
                        })
                      : steps[activeStep].icon}
                  </span>
                  {steps[activeStep].title}
                </h3>
                <p className="text-muted-foreground">{steps[activeStep].description}</p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  },
)
StepperContent.displayName = "StepperContent"

export { Stepper, StepperContent }
