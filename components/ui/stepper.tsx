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
        className={cn("relative flex flex-1 snap-center", className)}
        role="listitem"
        aria-current={isActive ? "step" : undefined}
        {...props}
      >
        <div className="flex flex-1 flex-col items-center gap-2">
          {/* Línea conectora - antes del paso (excepto el primero) */}
          {index !== 0 && (
            <div className="absolute top-5 left-0 right-1/2 h-0.5 hidden md:block">
              <div className={cn("h-full w-full", isCompleted || isActive ? "bg-primary" : "bg-muted")} />
            </div>
          )}

          {/* Línea conectora - después del paso (excepto el último) */}
          {!isLast && (
            <div className="absolute top-5 left-1/2 right-0 h-0.5 hidden md:block">
              <div className={cn("h-full w-full", isCompleted ? "bg-primary" : "bg-muted")} />
            </div>
          )}

          <button
            onClick={() => !disabled && onClick(index)}
            className={cn(
              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
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
          <div className="flex flex-col items-center text-center">
            <span className={cn("font-medium", isActive ? "text-primary" : "text-foreground")}>{step.title}</span>
            <span className="text-xs text-muted-foreground">{step.description}</span>
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
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <ul
          className="flex snap-x snap-mandatory overflow-x-auto md:overflow-visible flex-col md:flex-row gap-8 md:gap-0 pb-4 md:pb-0"
          role="list"
          style={{ scrollbarWidth: "none" }}
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
