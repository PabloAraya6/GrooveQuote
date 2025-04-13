"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuoteResult } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface QuoteResultStepProps {
  isLoading: boolean
  quoteResult: QuoteResult | null
  onSelectTier: (tier: "basic" | "standard" | "premium") => void
  onBack: () => void
}

export function QuoteResultStep({ isLoading, quoteResult, onSelectTier, onBack }: QuoteResultStepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Calculando tu presupuesto...</p>
      </div>
    )
  }

  if (!quoteResult) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p>No se pudo calcular el presupuesto. Por favor, inténtalo de nuevo.</p>
        <Button onClick={onBack}>Volver</Button>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tu presupuesto</h2>
        <p className="text-muted-foreground">Selecciona el plan que mejor se adapte a tus necesidades.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{quoteResult.basic.name}</CardTitle>
            <CardDescription>Opción económica</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4 text-3xl font-bold">{formatPrice(quoteResult.basic.price)}</div>
            <ul className="space-y-2">
              {quoteResult.basic.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-sm">•</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => onSelectTier("basic")}>
              Continuar
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary">
          <CardHeader className="bg-primary/10">
            <CardTitle>{quoteResult.standard.name}</CardTitle>
            <CardDescription>Recomendado</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4 text-3xl font-bold">{formatPrice(quoteResult.standard.price)}</div>
            <ul className="space-y-2">
              {quoteResult.standard.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-sm">•</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onSelectTier("standard")}>
              Continuar
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{quoteResult.premium.name}</CardTitle>
            <CardDescription>Experiencia completa</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4 text-3xl font-bold">{formatPrice(quoteResult.premium.price)}</div>
            <ul className="space-y-2">
              {quoteResult.premium.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-sm">•</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => onSelectTier("premium")}>
              Continuar
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-start">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
      </div>
    </div>
  )
}
