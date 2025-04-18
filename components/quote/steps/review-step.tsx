"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { CheckIcon, AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon, CalendarIcon, MapPinIcon, HeadphonesIcon, SpeakerIcon, SparklesIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { QuoteFormData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ReviewStepProps {
  data: Partial<QuoteFormData>
  onNext: () => void
  onBack: () => void
  onEdit: (step: number) => void
}

export function ReviewStep({ data, onNext, onBack, onEdit }: ReviewStepProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    event: true,
    equipment: false,
    extras: false,
  })

  const eventDetails = data.eventDetails
  const equipment = data.equipment

  if (!eventDetails || !equipment) {
    return <div>Información incompleta. Por favor, vuelve atrás y completa todos los campos.</div>
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Check if everything is complete
  const isEventComplete = !!eventDetails.date && !!eventDetails.location && !!eventDetails.eventType
  const isBasicEquipmentComplete = equipment.dj && equipment.sound && (equipment.dj && !!equipment.djSchedule)
  const isAllComplete = isEventComplete && isBasicEquipmentComplete

  const eventTypeMap: Record<string, string> = {
    boda: "Boda",
    corporativo: "Corporativo",
    fiesta: "Fiesta",
    concierto: "Concierto",
    otro: "Otro",
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white dark:bg-gray-950 z-10 py-4 border-b mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Revisa tu cotización</h2>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Event Section */}
        <ReviewSection 
          title="Evento"
          icon={<CalendarIcon className="h-5 w-5" />}
          isComplete={isEventComplete}
          isExpanded={expandedSections.event}
          onToggle={() => toggleSection("event")}
          onEdit={() => onEdit(0)}
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewItem
              label="Fecha"
              value={format(eventDetails.date, "PPP", { locale: es })}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <ReviewItem
              label="Ubicación"
              value={eventDetails.location}
              icon={<MapPinIcon className="h-4 w-4" />}
            />
            <ReviewItem
              label="Tipo de evento"
              value={eventTypeMap[eventDetails.eventType]}
            />
            <ReviewItem
              label="Invitados"
              value={`${eventDetails.guestCount} personas`}
            />
          </dl>
        </ReviewSection>

        {/* Equipment Section */}
        <ReviewSection 
          title="Sonido"
          icon={<SpeakerIcon className="h-5 w-5" />}
          isComplete={equipment.sound}
          isExpanded={expandedSections.equipment}
          onToggle={() => toggleSection("equipment")}
          onEdit={() => onEdit(1)}
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewItem
              label="Sistema de sonido"
              value={equipment.sound ? "Incluido" : "No incluido"}
              status={equipment.sound ? "complete" : "warning"}
            />
            <ReviewItem
              label="Cantidad de altavoces"
              value={`${equipment.speakers || 0} unidades`}
              status={equipment.speakers && equipment.speakers >= 2 ? "complete" : "warning"}
            />
            {equipment.wirelessMic > 0 && (
              <ReviewItem
                label="Micrófonos inalámbricos"
                value={`${equipment.wirelessMic} unidades`}
              />
            )}
          </dl>
        </ReviewSection>

        {/* DJ Section */}
        <ReviewSection 
          title="DJ"
          icon={<HeadphonesIcon className="h-5 w-5" />}
          isComplete={equipment.dj && !!equipment.djSchedule}
          isExpanded={equipment.dj && !equipment.djSchedule}
          onToggle={() => toggleSection("dj")}
          onEdit={() => onEdit(1)}
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewItem
              label="Servicio de DJ"
              value={equipment.dj ? "Incluido" : "No incluido"}
              status={equipment.dj ? "complete" : "warning"}
            />
            <ReviewItem
              label="Horario"
              value={equipment.djSchedule || "No especificado"}
              status={equipment.dj && equipment.djSchedule ? "complete" : "warning"}
            />
          </dl>
        </ReviewSection>

        {/* Lighting Section */}
        <ReviewSection 
          title="Iluminación"
          icon={<SparklesIcon className="h-5 w-5" />}
          isComplete={true}
          isExpanded={expandedSections.extras}
          onToggle={() => toggleSection("extras")}
          onEdit={() => onEdit(1)}
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewItem
              label="Sistema de iluminación"
              value={equipment.lighting ? `${equipment.lightingType || "Estándar"}` : "No incluido"}
            />
            {equipment.ledFloor && (
              <ReviewItem
                label="Pista LED"
                value="Incluida"
              />
            )}
            {equipment.ledDecoration > 0 && (
              <ReviewItem
                label="Decoración LED"
                value={`${equipment.ledDecoration} unidades`}
              />
            )}
            {equipment.fogMachine && (
              <ReviewItem
                label="Máquina de humo"
                value="Incluida"
              />
            )}
          </dl>
        </ReviewSection>

        {/* Estructura Section */}
        {(equipment.archStructure || equipment.spiderStructure) && (
          <ReviewSection 
            title="Estructuras"
            icon={<CheckIcon className="h-5 w-5" />}
            isComplete={true}
            isExpanded={expandedSections.structures}
            onToggle={() => toggleSection("structures")}
            onEdit={() => onEdit(1)}
          >
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {equipment.archStructure && (
                <ReviewItem
                  label="Estructura arco"
                  value="Incluida"
                />
              )}
              {equipment.spiderStructure && (
                <ReviewItem
                  label="Estructura araña"
                  value="Incluida"
                />
              )}
            </dl>
          </ReviewSection>
        )}

        {/* Transport Section */}
        {equipment.outsideTransport && (
          <ReviewSection 
            title="Transporte"
            icon={<CheckIcon className="h-5 w-5" />}
            isComplete={true}
            isExpanded={expandedSections.transport}
            onToggle={() => toggleSection("transport")}
            onEdit={() => onEdit(1)}
          >
            <dl className="grid grid-cols-1 gap-3">
              <ReviewItem
                label="Transporte fuera de San Juan"
                value="Incluido"
              />
            </dl>
          </ReviewSection>
        )}

        {/* Status Summary */}
        {isAllComplete ? (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg text-center">
            <CheckIcon className="inline-block h-5 w-5 text-green-500 mr-2" />
            <span className="font-medium text-green-700 dark:text-green-400">Todo listo para continuar</span>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg">
            <AlertTriangleIcon className="inline-block h-5 w-5 text-amber-500 mr-2" />
            <span className="font-medium text-amber-700 dark:text-amber-400">
              Hay secciones que requieren tu atención
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onNext} disabled={!isAllComplete}>
          Continuar a presupuesto
        </Button>
      </div>
    </div>
  )
}

// Review Section Component
interface ReviewSectionProps {
  title: string
  icon: React.ReactNode
  isComplete: boolean
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  children: React.ReactNode
}

function ReviewSection({ 
  title, 
  icon, 
  isComplete, 
  isExpanded, 
  onToggle, 
  onEdit, 
  children 
}: ReviewSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="font-medium text-lg">{title}</h3>
          {isComplete ? (
            <span className="flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckIcon className="h-4 w-4 mr-1" />
              Completo
            </span>
          ) : (
            <span className="flex items-center text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangleIcon className="h-4 w-4 mr-1" />
              Requiere atención
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            Editar
          </Button>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 border-t pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Review Item Component
interface ReviewItemProps {
  label: string
  value: string
  icon?: React.ReactNode
  status?: "complete" | "warning" | "default"
}

function ReviewItem({ label, value, icon, status = "default" }: ReviewItemProps) {
  return (
    <div className="flex flex-col">
      <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </dt>
      <dd className={cn(
        "font-medium",
        status === "complete" && "text-green-600 dark:text-green-400",
        status === "warning" && "text-amber-600 dark:text-amber-400"
      )}>
        {value}
      </dd>
    </div>
  )
}
