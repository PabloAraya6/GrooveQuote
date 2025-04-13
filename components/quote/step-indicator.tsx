import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted" />
      <ol className="relative flex w-full justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li key={step} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                  isCompleted ? "border-primary" : isCurrent ? "border-primary" : "border-muted",
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <span className={cn("text-sm font-medium", isCurrent ? "text-primary" : "text-muted-foreground")}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-center text-xs font-medium",
                  isCurrent ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
