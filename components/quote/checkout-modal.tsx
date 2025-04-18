"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { type Contact, contactSchema, type QuoteTier } from "@/lib/types"
import { useState } from "react"
import { Loader2, CreditCardIcon, BuildingIcon, CheckIcon } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  tier: QuoteTier
  onSubmit: (data: Contact & { paymentMethod: PaymentMethod }) => void
}

type PaymentMethod = "mercadopago" | "transfer";

export function CheckoutModal({ isOpen, onClose, tier, onSubmit }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mercadopago")

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      acceptCancellationPolicy: false,
    },
  })

  const handleSubmit = async (values: Contact) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit({ ...values, paymentMethod });
    setIsSubmitting(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price)
  }

  // Calculate deposit (50%)
  const deposit = tier.price * 0.5;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Finalizar reserva</DialogTitle>
          <DialogDescription>
            Completa tus datos para realizar la seña y reservar tu fecha.
          </DialogDescription>
        </DialogHeader>
        
        {/* Order Summary */}
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Resumen de tu presupuesto</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Plan {tier.name}</span>
              <span>{formatPrice(tier.price)}</span>
            </div>
            {tier.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center text-muted-foreground">
                <span className="ml-2 text-xs">• {feature}</span>
              </div>
            ))}
            {tier.features.length > 3 && (
              <div className="text-xs text-muted-foreground ml-2">
                • y {tier.features.length - 3} ítems más
              </div>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium">
            <span>Precio total:</span>
            <span>{formatPrice(tier.price)}</span>
          </div>
          <div className="flex justify-between text-primary font-semibold mt-2">
            <span>Seña a abonar ahora (50%):</span>
            <span>{formatPrice(deposit)}</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Datos de contacto</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu número de teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-medium">Método de pago</h3>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "mercadopago" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentMethod("mercadopago")}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Mercado Pago</h4>
                    <p className="text-xs text-muted-foreground">Tarjetas, QR, etc.</p>
                  </div>
                  {paymentMethod === "mercadopago" && (
                    <CheckIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                <div 
                  className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "transfer" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setPaymentMethod("transfer")}
                >
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <BuildingIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Transferencia</h4>
                    <p className="text-xs text-muted-foreground">Datos bancarios</p>
                  </div>
                  {paymentMethod === "transfer" && (
                    <CheckIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Accept Terms */}
            <FormField
              control={form.control}
              name="acceptCancellationPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Acepto la política de cancelación
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      La seña no es reembolsable en caso de cancelación.
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} className="sm:mr-auto">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !form.watch("acceptCancellationPolicy")}
                className="sm:w-auto w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando
                  </>
                ) : (
                  <>Reservar ahora ({formatPrice(deposit)})</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
