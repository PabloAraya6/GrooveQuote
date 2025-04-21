"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { QuoteResult, QuoteFormData, Equipment } from "@/lib/types"
import { loadFormData } from "@/lib/utils"
import { Check, Download, Loader2, Mail, Phone, Send, Clock, Users, MapPin, Calendar, ArrowLeft } from "lucide-react"

interface QuoteResultStepProps {
  isLoading: boolean
  quoteResult: QuoteResult | null
  onSelectTier: (tier: "basic" | "standard" | "premium") => void
  onBack: () => void
}

// Estos precios deben coincidir con los de equipment-step.tsx
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

export function QuoteResultStep({ isLoading, quoteResult, onSelectTier, onBack }: QuoteResultStepProps) {
  const [formData, setFormData] = useState<Partial<QuoteFormData> | null>(null)
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  
  // Usamos el tier estándar como referencia para características adicionales
  const selectedTier = "standard"

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
      if (savedData.equipment) {
        const equipmentData = savedData.equipment as Equipment;
        setEquipment(equipmentData);
        setTotalPrice(calculateTotalPrice(equipmentData));
      }
    }
  }, [])

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
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price)
  }

  // Formatea fecha si existe
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "No especificado";
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Fecha inválida";
    }
  }

  // Usamos las características del tier estándar, pero con nuestro precio calculado
  const tierData = quoteResult[selectedTier];
  const tierFeatures = tierData.features;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Encabezado + botón atrás en móvil */}
      <div className="flex flex-col md:block">
        <Button 
          variant="ghost" 
          className="self-start -ml-3 mb-2 md:hidden flex items-center text-sm"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver
        </Button>
        <h2 className="text-2xl md:text-3xl font-bold">Tu presupuesto detallado</h2>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Basado en tu selección de equipamiento</p>
      </div>

      {/* Panel de presupuesto para móvil (siempre visible arriba) */}
      <Card className="md:hidden border-2 border-primary rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-primary py-3">
          <CardTitle className="text-primary-foreground text-lg">Tu presupuesto final</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="text-4xl font-extrabold text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <div className="bg-primary/10 w-full rounded-md p-2 mt-3 text-center">
              <span className="text-xs font-medium">Todo incluido, sin cargos adicionales</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Seña (50%)</span>
              <span className="font-medium">{formatPrice(totalPrice * 0.5)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Saldo restante</span>
              <span>{formatPrice(totalPrice * 0.5)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-5">
        {/* Detalles del presupuesto */}
        <Card className="md:col-span-2 border shadow order-2 md:order-1">
          <CardHeader className="bg-muted/30 pb-3 pt-4">
            <CardTitle className="text-xl">Detalles del presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="space-y-5">
              {/* Detalles del evento */}
              {formData?.eventDetails && (
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-3">Evento</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Fecha</div>
                        <div className="text-sm text-muted-foreground">{formatDate(formData.eventDetails.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Duración</div>
                        <div className="text-sm text-muted-foreground">
                          {formData.eventDetails.eventType === "boda" ? "8-10 horas" : "4-6 horas"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Ubicación</div>
                        <div className="text-sm text-muted-foreground">{formData.eventDetails.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Invitados</div>
                        <div className="text-sm text-muted-foreground">{formData.eventDetails.guestCount} personas</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {equipment && (
                <>
                  <Separator />

                  {/* Equipamiento seleccionado */}
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-3">Equipamiento seleccionado</h3>
                    <div className="space-y-2.5">
                      {equipment.dj && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">DJ Profesional {equipment.djSchedule && `(${equipment.djSchedule})`}</span>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(EQUIPMENT_PRICES.dj)}</span>
                        </div>
                      )}
                      
                      {equipment.sound && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Sonido {equipment.soundType || "estándar"}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(EQUIPMENT_PRICES.sound[equipment.soundType || "estándar"])}
                          </span>
                        </div>
                      )}
                      
                      {equipment.lighting && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Iluminación {equipment.lightingType || "estándar"}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(EQUIPMENT_PRICES.lighting[equipment.lightingType || "estándar"])}
                          </span>
                        </div>
                      )}
                      
                      {equipment.ledFloor && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Pista LED</span>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(EQUIPMENT_PRICES.ledFloor)}</span>
                        </div>
                      )}
                      
                      {equipment.archStructure && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Estructura de arco</span>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(EQUIPMENT_PRICES.archStructure)}</span>
                        </div>
                      )}
                      
                      {equipment.spiderStructure && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Estructura tipo araña</span>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(EQUIPMENT_PRICES.spiderStructure)}</span>
                        </div>
                      )}
                      
                      {equipment.fogMachine && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Máquina de humo</span>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(EQUIPMENT_PRICES.fogMachine)}</span>
                        </div>
                      )}
                      
                      {equipment.ledDecoration > 0 && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Decoración LED ({equipment.ledDecoration} unidades)</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(equipment.ledDecoration * EQUIPMENT_PRICES.ledDecoration)}
                          </span>
                        </div>
                      )}
                      
                      {equipment.wirelessMic > 0 && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Micrófonos inalámbricos ({equipment.wirelessMic} unidades)</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(equipment.wirelessMic * EQUIPMENT_PRICES.wirelessMic)}
                          </span>
                        </div>
                      )}
                      
                      {equipment.outsideTransport && (
                        <div className="flex justify-between">
                          <div className="flex items-start">
                            <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">Transporte fuera de la ciudad</span>
                          </div>
                          <span className="text-sm font-medium">{formatPrice(EQUIPMENT_PRICES.outsideTransport)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Términos de pago */}
              <div>
                <h3 className="font-semibold text-base md:text-lg mb-3">Términos de pago</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>Señamos el 50% para reservar la fecha de tu evento</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>El saldo restante se abona el día del evento antes del inicio</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>Aceptamos efectivo, transferencia bancaria y MercadoPago</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen del presupuesto para desktop */}
        <div className="flex flex-col gap-4 order-1 md:order-2 md:col-span-2">
          <Card className="hidden md:block border-2 border-primary rounded-xl shadow-lg sticky top-4 overflow-hidden">
            <CardHeader className="bg-primary pb-4">
              <CardTitle className="text-primary-foreground text-xl">Tu presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-8 flex flex-col items-center">
                <span className="text-sm text-muted-foreground mb-1">Precio total</span>
                <div className="relative">
                  <span className="text-5xl font-extrabold text-primary">{formatPrice(totalPrice)}</span>
                </div>
                <div className="bg-primary/10 w-full rounded-md p-2 mt-3 text-center">
                  <span className="text-sm font-medium">Todo incluido, sin cargos adicionales</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Seña (50%)</span>
                  <span>{formatPrice(totalPrice * 0.5)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Saldo restante</span>
                  <span>{formatPrice(totalPrice * 0.5)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 mb-5 text-sm">
                <div className="flex items-center gap-2 mb-1 font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Validez del presupuesto:</span>
                </div>
                <p>Este presupuesto es válido por <span className="font-semibold">15 días</span> a partir de hoy.</p>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full gap-2 py-6 text-base shadow-lg" 
                  size="lg"
                  onClick={() => onSelectTier(selectedTier)}
                >
                  <span>Confirmar reserva</span>
                  <Send className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full hidden md:flex" 
                  onClick={onBack}
                >
                  Modificar equipamiento
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full gap-2" 
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar presupuesto</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contacto rápido */}
          <Card className="hidden md:block border shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">¿Tenés alguna duda?</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Phone className="h-4 w-4" />
                  <span>Llamanos</span>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Mail className="h-4 w-4" />
                  <span>Envianos un email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Barra fija inferior para móvil */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 md:hidden z-10">
        <div className="flex gap-2">
          <Button
            variant="outline" 
            className="flex-1 py-5"
            onClick={onBack}
          >
            Modificar
          </Button>
          <Button 
            className="flex-1 gap-2 py-5" 
            onClick={() => onSelectTier(selectedTier)}
          >
            <span>Confirmar</span>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
