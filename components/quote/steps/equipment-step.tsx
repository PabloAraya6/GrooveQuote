"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { TimeRangePicker } from "@/components/ui/time-range-picker"
import { 
  PlusIcon, 
  MinusIcon, 
  HeadphonesIcon, 
  SpeakerIcon, 
  LightbulbIcon,
  ArchiveIcon, 
  BoxIcon, 
  CloudFogIcon, 
  MicIcon, 
  TruckIcon,
  CheckIcon
} from "lucide-react"
import { type Equipment, equipmentSchema } from "@/lib/types"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface EquipmentStepProps {
  data?: Equipment
  onUpdate: (data: Equipment) => void
  onNext: () => void
  onBack: () => void
}

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

type LightingType = "estándar" | "profesional";
type SoundType = "básico" | "estándar" | "exterior";

export function EquipmentStep({ data, onUpdate, onNext, onBack }: EquipmentStepProps) {
  const [showQuoteSummary, setShowQuoteSummary] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  
  const form = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      dj: data?.dj ?? false,
      djSchedule: data?.djSchedule ?? "",
      sound: data?.sound ?? false,
      soundType: data?.soundType ?? "estándar",
      lighting: data?.lighting ?? false,
      lightingType: data?.lightingType ?? "estándar",
      ledFloor: data?.ledFloor ?? false,
      archStructure: data?.archStructure ?? false,
      spiderStructure: data?.spiderStructure ?? false,
      fogMachine: data?.fogMachine ?? false,
      ledDecoration: data?.ledDecoration ?? 0,
      wirelessMic: data?.wirelessMic ?? 0,
      outsideTransport: data?.outsideTransport ?? false,
      microphones: data?.microphones ?? 0,
      speakers: data?.speakers ?? 4,
    },
  })

  const watchAllFields = form.watch()
  
  // Calculate the total price whenever form values change
  useEffect(() => {
    let price = 0
    if (watchAllFields.dj) {
      price += EQUIPMENT_PRICES.dj
    }
    
    if (watchAllFields.sound) {
      // Ensure sound type is valid or default to "estándar"
      const soundType = (watchAllFields.soundType || "estándar") as SoundType
      // Ensure soundType is set in the form
      if (watchAllFields.soundType !== soundType) {
        form.setValue("soundType", soundType)
      }
      price += EQUIPMENT_PRICES.sound[soundType]
    }
    
    if (watchAllFields.lighting) {
      // Ensure lighting type is valid or default to "estándar"
      const lightingType = (watchAllFields.lightingType || "estándar") as LightingType
      // Ensure lightingType is set in the form
      if (watchAllFields.lightingType !== lightingType) {
        form.setValue("lightingType", lightingType)
      }
      price += EQUIPMENT_PRICES.lighting[lightingType]
    }
    
    if (watchAllFields.ledFloor) price += EQUIPMENT_PRICES.ledFloor
    if (watchAllFields.archStructure) price += EQUIPMENT_PRICES.archStructure
    if (watchAllFields.spiderStructure) price += EQUIPMENT_PRICES.spiderStructure
    if (watchAllFields.fogMachine) price += EQUIPMENT_PRICES.fogMachine
    
    const ledDecoration = watchAllFields.ledDecoration ?? 0
    price += ledDecoration * EQUIPMENT_PRICES.ledDecoration
    
    const wirelessMic = watchAllFields.wirelessMic ?? 0
    price += wirelessMic * EQUIPMENT_PRICES.wirelessMic
    
    if (watchAllFields.outsideTransport) price += EQUIPMENT_PRICES.outsideTransport
    
    setTotalPrice(price)
  }, [watchAllFields, form])

  const onSubmit = form.handleSubmit((values) => {
    onUpdate(values as Equipment);
    onNext();
  })

  // Check if at least one basic service is selected
  const hasAtLeastOneBasicService = watchAllFields.dj || watchAllFields.sound || watchAllFields.lighting;
  const canProceed = hasAtLeastOneBasicService;

  const toggleQuoteSummary = () => {
    setShowQuoteSummary(prev => !prev)
  }

  return (
    <div className="relative min-h-[calc(100vh-16rem)]">
      {/* Fixed header */}
      <div className="sticky top-0 bg-white dark:bg-gray-950 z-10 py-4 border-b mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Elige tu equipamiento</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Selecciona DJ, Sonido o Iluminación para continuar
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 pb-28 md:pb-4">
          {/* Basic Equipment Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Básicos</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {/* DJ Card */}
              <EquipmentCard
                name="dj"
                title="DJ"
                description="Servicio de DJ profesional"
                price={EQUIPMENT_PRICES.dj}
                icon={<HeadphonesIcon className="h-8 w-8" />}
                form={form}
              >
                {form.watch("dj") && (
                  <div className="mt-3 border-t pt-2" onClick={(e) => e.stopPropagation()}>
                    <label className="text-sm font-medium block mb-2">
                      Horario
                      <TimeRangePicker
                        value={form.watch("djSchedule") || ""}
                        onChange={(formattedTime, hours) => {
                          form.setValue("djSchedule", formattedTime);
                        }}
                        className="mt-2"
                      />
                    </label>
                  </div>
                )}
              </EquipmentCard>

              {/* Sound Card */}
              <EquipmentCard
                name="sound"
                title="Sonido"
                description="Sistema de sonido profesional"
                price={EQUIPMENT_PRICES.sound["estándar"]}
                icon={<SpeakerIcon className="h-8 w-8" />}
                form={form}
              >
                {form.watch("sound") && (
                  <div className="mt-3 border-t pt-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-sm font-medium block mb-2">Tipo:</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={form.watch("soundType") === "básico" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("soundType", "básico");
                        }}
                      >
                        Básico (3 parlantes)
                      </Badge>
                      <Badge 
                        variant={form.watch("soundType") === "estándar" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("soundType", "estándar");
                        }}
                      >
                        Estándar (4 parlantes)
                      </Badge>
                      <Badge 
                        variant={form.watch("soundType") === "exterior" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("soundType", "exterior");
                        }}
                      >
                        Exterior (5 parlantes)
                      </Badge>
                    </div>
                  </div>
                )}
              </EquipmentCard>

              {/* Lighting Card */}
              <EquipmentCard
                name="lighting"
                title="Iluminación"
                description="Sistema de iluminación para el evento"
                price={EQUIPMENT_PRICES.lighting["estándar"]}
                icon={<LightbulbIcon className="h-8 w-8" />}
                form={form}
              >
                {form.watch("lighting") && (
                  <div className="mt-3 border-t pt-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-sm font-medium block mb-2">Tipo:</span>
                    <div className="flex gap-2">
                      <Badge 
                        variant={form.watch("lightingType") === "estándar" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("lightingType", "estándar");
                        }}
                      >
                        Estándar
                      </Badge>
                      <Badge 
                        variant={form.watch("lightingType") === "profesional" ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("lightingType", "profesional");
                        }}
                      >
                        Profesional
                      </Badge>
                    </div>
                  </div>
                )}
              </EquipmentCard>
            </div>
          </div>

          {/* Extras Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-lg font-semibold">Extras</h3>
              <Separator className="flex-1" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <ExtraChip
                name="archStructure"
                label="Estructura arco"
                description="Arco de estructura de aluminio"
                price={EQUIPMENT_PRICES.archStructure}
                form={form}
                icon={<ArchiveIcon />}
              />
              <ExtraChip
                name="spiderStructure"
                label="Estructura araña"
                description="Estructura para luces en altura"
                price={EQUIPMENT_PRICES.spiderStructure}
                form={form}
                icon={<BoxIcon />}
              />
              <ExtraChip
                name="fogMachine"
                label="Máquina de humo"
                description="Efecto atmosférico"
                price={EQUIPMENT_PRICES.fogMachine}
                form={form}
                icon={<CloudFogIcon />}
              />
            </div>

            {/* Counter Extras */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Cantidad de elementos</h3>
                <Separator className="flex-1" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CounterExtra
                  name="ledDecoration"
                  label="Decoración LED"
                  price={EQUIPMENT_PRICES.ledDecoration}
                  form={form}
                />
                <CounterExtra
                  name="wirelessMic"
                  label="Micrófono inalámbrico"
                  price={EQUIPMENT_PRICES.wirelessMic}
                  form={form}
                />
              </div>
            </div>
          </div>

          {/* Mobile Quote Summary Drawer */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t shadow-lg z-10">
            <div 
              className="flex justify-center py-1 border-b cursor-pointer"
              onClick={toggleQuoteSummary}
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            <AnimatePresence>
              {showQuoteSummary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <QuoteSummary form={form} totalPrice={totalPrice} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Seña 50%:</span>
                <span>${(totalPrice * 0.5).toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-2 mt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
                  Atrás
                </Button>
                <Button type="submit" className="flex-1" disabled={!canProceed}>
                  Siguiente
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Quote Summary Card */}
          <div className="hidden md:block sticky bottom-4 right-0 float-right w-1/3 bg-white dark:bg-gray-950 border rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Resumen</h3>
            <QuoteSummary form={form} totalPrice={totalPrice} />
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Atrás
              </Button>
              <Button type="submit" disabled={!canProceed}>
                Siguiente
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

// Equipment Card Component
function EquipmentCard({ 
  name, 
  title, 
  description, 
  price, 
  icon, 
  form, 
  children 
}: { 
  name: keyof Equipment, 
  title: string, 
  description: string, 
  price: number, 
  icon: React.ReactNode, 
  form: any,
  children?: React.ReactNode
}) {
  const isActive = form.watch(name) as boolean

  return (
    <div 
      className={cn(
        "relative border rounded-lg p-4 transition-all duration-300 cursor-pointer hover:shadow-md",
        isActive 
          ? "border-primary bg-primary/5" 
          : "border-muted bg-card hover:border-primary/50"
      )}
      onClick={() => form.setValue(name, !isActive)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-sm font-medium mt-1">${price.toLocaleString()}</p>
          </div>
        </div>
        <div 
          className={cn(
            "h-5 w-5 rounded-full border flex items-center justify-center",
            isActive 
              ? "bg-primary border-primary text-white" 
              : "border-muted"
          )}
        >
          {isActive && <span className="text-[10px]">✓</span>}
        </div>
      </div>
      
      {children}
    </div>
  )
}

// Extra Chip Component
function ExtraChip({ 
  name, 
  label,
  description = "",
  price, 
  form,
  icon
}: { 
  name: keyof Equipment, 
  label: string,
  description?: string,
  price: number, 
  form: any,
  icon?: React.ReactNode
}) {
  const isActive = form.watch(name) as boolean

  return (
    <div 
      className={cn(
        "relative overflow-hidden border rounded-lg p-4 cursor-pointer transition-all duration-300",
        "hover:shadow-md flex flex-col gap-3 group",
        isActive 
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm" 
          : "border-border hover:border-primary/40"
      )}
      onClick={() => form.setValue(name, !isActive)}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-300",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
        )}>
          <div className="h-5 w-5">{icon}</div>
        </div>
        <div 
          className={cn(
            "flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-300",
            isActive 
              ? "border-primary bg-primary scale-110" 
              : "border-muted scale-100"
          )}
        >
          {isActive && <CheckIcon className="h-full w-full text-primary-foreground" />}
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-medium text-foreground">{label}</h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div className={cn(
          "text-sm font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          ${price.toLocaleString()}
        </div>
        <div className={cn(
          "text-xs px-2 py-1 rounded-full transition-colors duration-300",
          isActive 
            ? "bg-primary/10 text-primary dark:bg-primary/20" 
            : "bg-muted/60 text-muted-foreground"
        )}>
          {isActive ? "Incluido" : "Opcional"}
        </div>
      </div>
      
      {/* Ripple effect on selection */}
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-primary/10 scale-0 rounded-full transform origin-center animate-ripple"></div>
      </div>
    </div>
  )
}

// Counter Extra Component
function CounterExtra({ 
  name, 
  label, 
  price, 
  form 
}: { 
  name: keyof Equipment, 
  label: string, 
  price: number, 
  form: any 
}) {
  const value = form.watch(name) as number
  
  const increment = () => {
    form.setValue(name, value + 1)
  }
  
  const decrement = () => {
    if (value > 0) {
      form.setValue(name, value - 1)
    }
  }

  return (
    <div className="border rounded-lg p-3 flex items-center justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">${price.toLocaleString()} por unidad</div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={decrement}
          disabled={value === 0}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <span className="font-medium w-4 text-center">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={increment}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Quote Summary Component
function QuoteSummary({ 
  form, 
  totalPrice 
}: { 
  form: any, 
  totalPrice: number 
}) {
  const equipment = form.watch()
  
  return (
    <div className="space-y-2 py-2">
      {equipment.dj && (
        <div className="flex justify-between text-sm">
          <span>DJ</span>
          <span>${EQUIPMENT_PRICES.dj.toLocaleString()}</span>
        </div>
      )}
      {equipment.sound && (
        <div className="flex justify-between text-sm">
          <span>Sonido ({equipment.soundType || "estándar"})</span>
          <span>${EQUIPMENT_PRICES.sound[equipment.soundType as SoundType || "estándar"].toLocaleString()}</span>
        </div>
      )}
      {equipment.lighting && (
        <div className="flex justify-between text-sm">
          <span>Iluminación ({equipment.lightingType || "estándar"})</span>
          <span>
            ${EQUIPMENT_PRICES.lighting[equipment.lightingType as LightingType || "estándar"].toLocaleString()}
          </span>
        </div>
      )}
      {equipment.ledFloor && (
        <div className="flex justify-between text-sm">
          <span>Pista LED</span>
          <span>${EQUIPMENT_PRICES.ledFloor.toLocaleString()}</span>
        </div>
      )}
      {equipment.archStructure && (
        <div className="flex justify-between text-sm">
          <span>Estructura arco</span>
          <span>${EQUIPMENT_PRICES.archStructure.toLocaleString()}</span>
        </div>
      )}
      {equipment.spiderStructure && (
        <div className="flex justify-between text-sm">
          <span>Estructura araña</span>
          <span>${EQUIPMENT_PRICES.spiderStructure.toLocaleString()}</span>
        </div>
      )}
      {equipment.fogMachine && (
        <div className="flex justify-between text-sm">
          <span>Máquina de humo</span>
          <span>${EQUIPMENT_PRICES.fogMachine.toLocaleString()}</span>
        </div>
      )}
      {equipment.ledDecoration > 0 && (
        <div className="flex justify-between text-sm">
          <span>Decoración LED ({equipment.ledDecoration})</span>
          <span>${(equipment.ledDecoration * EQUIPMENT_PRICES.ledDecoration).toLocaleString()}</span>
        </div>
      )}
      {equipment.wirelessMic > 0 && (
        <div className="flex justify-between text-sm">
          <span>Micrófono inalámbrico ({equipment.wirelessMic})</span>
          <span>${(equipment.wirelessMic * EQUIPMENT_PRICES.wirelessMic).toLocaleString()}</span>
        </div>
      )}
      {equipment.outsideTransport && (
        <div className="flex justify-between text-sm">
          <span>Transporte fuera de San Juan</span>
          <span>${EQUIPMENT_PRICES.outsideTransport.toLocaleString()}</span>
        </div>
      )}
      
      <Separator className="my-2" />
      
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>${totalPrice.toLocaleString()}</span>
      </div>
    </div>
  )
}
