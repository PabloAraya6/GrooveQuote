"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
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
import { type Contact, contactSchema, type QuoteTier, type QuoteFormData, type Equipment } from "@/lib/types"
import { loadFormData } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  tier: QuoteTier
  onSubmit: (data: Contact & { paymentMethod: string }) => void
}

// Estos precios deben coincidir con los de equipment-step.tsx y quote-result-step.tsx
const EQUIPMENT_PRICES = {
  dj: 100000,
  sound: {
    "básico": 90000,
    "estándar": 110000,
    "exterior": 120000
  },
  lighting: {
    "estándar": 100000,
    "profesional": 120000
  },
  ledFloor: 3000,
  archStructure: 100000,
  spiderStructure: 200000,
  fogMachine: 20000,
  ledDecoration: 7000,
  wirelessMic: 2000,
  outsideTransport: 1800
}

export function CheckoutModal({ isOpen, onClose, tier, onSubmit }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<QuoteFormData> | null>(null)
  const [totalPrice, setTotalPrice] = useState(tier.price)
  const [deposit, setDeposit] = useState(tier.price * 0.5)

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      acceptCancellationPolicy: false,
    },
  })

  // Calcular el precio total basado en el equipamiento seleccionado
  const calculateTotalPrice = (equipment: Equipment) => {
    let price = 0;
    
    // Servicios básicos
    if (equipment.dj) price += EQUIPMENT_PRICES.dj;
    
    if (equipment.sound) {
      const soundType = equipment.soundType || "estándar";
      price += EQUIPMENT_PRICES.sound[soundType];
    }
    
    if (equipment.lighting) {
      const lightingType = equipment.lightingType || "estándar";
      price += EQUIPMENT_PRICES.lighting[lightingType];
    }
    
    // Equipamiento adicional
    if (equipment.ledFloor) price += EQUIPMENT_PRICES.ledFloor;
    if (equipment.archStructure) price += EQUIPMENT_PRICES.archStructure;
    if (equipment.spiderStructure) price += EQUIPMENT_PRICES.spiderStructure;
    if (equipment.fogMachine) price += EQUIPMENT_PRICES.fogMachine;
    
    // Elementos con cantidad
    price += (equipment.ledDecoration || 0) * EQUIPMENT_PRICES.ledDecoration;
    price += (equipment.wirelessMic || 0) * EQUIPMENT_PRICES.wirelessMic;
    
    // Extras
    if (equipment.outsideTransport) price += EQUIPMENT_PRICES.outsideTransport;
    
    return price;
  };

  // Cargar datos del localStorage
  useEffect(() => {
    const savedData = loadFormData()
    if (savedData) {
      setFormData(savedData)
      
      // Calcular precio real desde localStorage si existe equipment
      if (savedData.equipment) {
        const equipmentData = savedData.equipment as Equipment;
        const calculatedPrice = calculateTotalPrice(equipmentData);
        setTotalPrice(calculatedPrice);
        setDeposit(calculatedPrice * 0.5);
      }
      
      // Prellenar formulario con datos de contacto si existen
      if (savedData.contact) {
        form.reset({
          name: savedData.contact.name || "",
          email: savedData.contact.email || "",
          phone: savedData.contact.phone || "",
          acceptCancellationPolicy: false, // Siempre requerir volver a aceptar
        })
      }
    }
  }, [form])

  const handleSubmit = async (values: Contact) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit({ ...values, paymentMethod: "mercadopago" });
    } catch (error) {
      console.error("Error al procesar el pago", error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Finalizar reserva</DialogTitle>
          <DialogDescription>
            Completa tus datos para realizar la seña y reservar tu fecha.
          </DialogDescription>
        </DialogHeader>
        
        {/* Simplified Payment Summary */}
        <div className="flex justify-between text-primary font-semibold p-3 bg-primary/10 rounded-lg mb-4">
          <span>Seña a abonar ahora (50%):</span>
          <span>{formatPrice(deposit)}</span>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Contact Information */}
            <div className="space-y-4">
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
            
            {/* Accept Terms */}
            <FormField
              control={form.control}
              name="acceptCancellationPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
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
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 pt-2">
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
