"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download } from "lucide-react"
import { clearFormData } from "@/lib/utils"

export function SuccessPage() {
  // Clear form data on success page load
  useEffect(() => {
    clearFormData()
  }, [])

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert("En una aplicación real, esto generaría y descargaría un PDF con el presupuesto.")
  }

  return (
    <div className="container mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-8">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">¡Pedido completado!</CardTitle>
          <CardDescription>Hemos recibido tu solicitud de presupuesto</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Te hemos enviado un correo electrónico con los detalles de tu presupuesto. Nos pondremos en contacto contigo
            en breve para confirmar los detalles.
          </p>
          <p className="text-sm text-muted-foreground">
            Número de referencia: #SL-
            {Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
