"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { 
  CheckIcon, 
  AlertTriangleIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CalendarIcon, 
  MapPinIcon, 
  HeadphonesIcon, 
  SpeakerIcon, 
  SparklesIcon,
  InfoIcon,
  UsersIcon,
  ChevronRightIcon,
  ClockIcon,
  HelpCircleIcon
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
    dj: false,
    structures: false,
    transport: false,
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

  console.log(equipment)
  
  // Function to render a specific section's completion status
  const getSectionStatus = (section: string) => {
    switch(section) {
      case "event":
        return isEventComplete;
      case "dj":
        return equipment.dj && !!equipment.djSchedule;
      case "sound":
        return equipment.sound;
      case "lighting":
        return equipment.lighting !== undefined;
      default:
        return true;
    }
  };

  // Function for debugging - let's log more information about DJ state
  console.log("DJ Status:", {
    isDJ: equipment.dj,
    djSchedule: equipment.djSchedule,
    isDJComplete: equipment.dj && !!equipment.djSchedule,
    isDJSectionExpanded: expandedSections.dj
  });

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-white dark:bg-gray-950 z-10 py-4 border-b mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Revisa tu cotización</h2>
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
              icon={<InfoIcon className="h-4 w-4" />}
            />
            <ReviewItem
              label="Invitados"
              value={`${eventDetails.guestCount} personas`}
              icon={<UsersIcon className="h-4 w-4" />}
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
              status={equipment.sound ? "complete" : "not-included"}
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

        {/* DJ Section - Updated to ensure it's always visible */}
        <ReviewSection 
          title="DJ"
          icon={<HeadphonesIcon className="h-5 w-5" />}
          isComplete={equipment.dj && !!equipment.djSchedule}
          isExpanded={expandedSections.dj}
          onToggle={() => toggleSection("dj")}
          onEdit={() => onEdit(1)}
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewItem
              label="Servicio de DJ"
              value={equipment.dj ? "Incluido" : "No incluido"}
              status={equipment.dj ? "complete" : "not-included"}
            />
            <div className="flex items-start">
              <ReviewItem
                label={
                  <div className="flex items-center gap-1">
                    Horario
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[250px]">
                          <p className="text-xs">
                            Selecciona entre horarios predefinidos o personalízalo según tus necesidades. 
                            Los horarios están en intervalos de 30 minutos.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                }
                value={equipment.djSchedule || "No especificado"}
                status={equipment.dj && equipment.djSchedule ? "complete" : (equipment.dj ? "warning" : "not-included")}
                icon={<ClockIcon className="h-4 w-4" />}
              />
            </div>
          </dl>
          
          {/* Ayuda adicional cuando el DJ está activado pero no tiene horario */}
          {equipment.dj && !equipment.djSchedule && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                <AlertTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Por favor, selecciona un horario para el servicio de DJ para poder continuar.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-1 sm:mt-0 sm:ml-auto text-xs bg-white dark:bg-gray-800"
                  onClick={() => onEdit(1)}
                >
                  Seleccionar horario
                </Button>
              </div>
              
              {/* Ejemplos de horarios */}
              <div className="mt-3 grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">Horarios disponibles:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="border rounded-md p-2 bg-white dark:bg-gray-800 hover:border-primary cursor-pointer transition-colors">
                    <div className="font-medium">Día</div>
                    <div className="text-muted-foreground">15:00 - 20:00</div>
                  </div>
                  <div className="border rounded-md p-2 bg-white dark:bg-gray-800 hover:border-primary cursor-pointer transition-colors">
                    <div className="font-medium">Noche</div>
                    <div className="text-muted-foreground">22:00 - 05:00</div>
                  </div>
                  <div className="border rounded-md p-2 bg-white dark:bg-gray-800 hover:border-primary cursor-pointer transition-colors">
                    <div className="font-medium">Personalizado</div>
                    <div className="text-muted-foreground">Elige tus horas</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ReviewSection>

        {/* Lighting Section */}
        <ReviewSection 
          title="Iluminación"
          icon={<SparklesIcon className="h-5 w-5" />}
          isComplete={equipment.lighting}
          isExpanded={expandedSections.extras}
          onToggle={() => toggleSection("extras")}
          onEdit={() => onEdit(1)}
        >
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewItem
              label="Sistema de iluminación"
              value={equipment.lighting ? `${equipment.lightingType || "Estándar"}` : "No incluido"}
              status={equipment.lighting ? "complete" : "not-included"}
            />
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
            isComplete={equipment.archStructure || equipment.spiderStructure}
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
            isComplete={equipment.outsideTransport}
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

        {/* Conditional Rendering for Required Elements */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
              <InfoIcon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-400">Requisitos mínimos</h4>
              <p className="text-sm text-blue-600/70 dark:text-blue-500/70 mt-1">
                Para continuar, es necesario incluir al menos:
              </p>
              <ul className="text-sm text-blue-600/70 dark:text-blue-500/70 mt-2 ml-4 list-disc">
                <li>Servicio de DJ con horario</li>
                <li>Sistema de sonido</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Summary with improved styling */}
        {isAllComplete ? (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                <CheckIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400">Todo listo para continuar</h4>
                <p className="text-sm text-green-600/70 dark:text-green-500/70 mt-1">
                  Se completaron todos los requisitos. Puedes continuar al presupuesto.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-600 dark:text-amber-400">
                <AlertTriangleIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-amber-700 dark:text-amber-400">
                  Hay secciones que requieren tu atención
                </h4>
                <p className="text-sm text-amber-600/70 dark:text-amber-500/70 mt-1">
                  Por favor, completa todos los campos requeridos para continuar.
                </p>
                <ul className="text-sm text-amber-600/70 dark:text-amber-500/70 mt-2 ml-4 list-disc">
                  {!isEventComplete && (
                    <li>Completa los detalles del evento</li>
                  )}
                  {!equipment.dj && (
                    <li>Incluye el servicio de DJ</li>
                  )}
                  {equipment.dj && !equipment.djSchedule && (
                    <li>Especifica el horario del DJ</li>
                  )}
                  {!equipment.sound && (
                    <li>Incluye el sistema de sonido</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="gap-2"
          aria-label="Volver a la selección de equipamiento"
        >
          <ChevronUpIcon className="h-4 w-4" />
          <span className="sm:inline hidden">Atrás</span>
          <span className="sm:hidden inline">Volver</span>
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isAllComplete}
          className="gap-2"
          aria-label="Continuar a la visualización del presupuesto"
        >
          <span className="sm:inline hidden">Continuar a presupuesto</span>
          <span className="sm:hidden inline">Ver presupuesto</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Review Section Component with improved visual hierarchy
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
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all duration-200",
      isExpanded ? "shadow-sm" : "",
      !isComplete && "border-gray-200 dark:border-gray-800"
    )}
    aria-expanded={isExpanded}
    role="region"
    aria-label={`Sección de ${title}`}>
      <div 
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer"
        onClick={onToggle}
        role="button"
        aria-label={`${isExpanded ? 'Colapsar' : 'Expandir'} sección de ${title}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className={cn(
            "p-1 sm:p-1.5 rounded-full",
            isComplete 
              ? "bg-primary/10 text-primary" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          )}>
            {icon}
          </div>
          <h3 className={`font-medium text-base sm:text-lg ${!isComplete && "text-gray-500 dark:text-gray-400"}`}>{title}</h3>
          {isComplete ? (
            <span className="flex items-center text-xs sm:text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-0.5 px-2 rounded-full">
              <CheckIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1" />
              <span className="hidden sm:inline">Completo</span>
              <span className="sm:hidden inline">OK</span>
            </span>
          ) : (
            <span className="flex items-center text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-0.5 px-2 rounded-full">
              <span className="hidden sm:inline">No contratado</span>
              <span className="sm:hidden inline">No</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs sm:text-sm px-2 sm:px-3 h-8 hover:bg-gray-100 dark:hover:bg-gray-800" 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            aria-label={`Editar sección de ${title}`}
          >
            <span className="hidden sm:inline">Editar</span>
            <span className="sm:hidden inline">Cambiar</span>
          </Button>
          <div 
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
              isExpanded 
                ? "bg-primary/10 text-primary" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary hover:bg-primary/10"
            )}
            aria-hidden="true"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </div>
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
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t pt-3 sm:pt-4 bg-gray-50/50 dark:bg-gray-900/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Review Item Component with improved visual indicators and responsive layout
interface ReviewItemProps {
  label: string | React.ReactNode
  value: string
  icon?: React.ReactNode
  status?: "complete" | "warning" | "default" | "not-included"
}

function ReviewItem({ label, value, icon, status = "default" }: ReviewItemProps) {
  // Determine if this is a "not included" item
  const isNotIncluded = value === "No incluido" || status === "not-included";
  const isWarning = status === "warning";
  
  return (
    <div className={cn(
      "flex flex-col p-1.5 sm:p-2 rounded-md",
      isNotIncluded ? "bg-gray-50 dark:bg-gray-900/40" : "",
      isWarning ? "bg-amber-50 dark:bg-amber-900/20" : "",
      status === "complete" ? "bg-green-50/30 dark:bg-green-900/10" : ""
    )}>
      <dt className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5 flex-wrap">
        {icon && (
          <span className="text-primary dark:text-primary/80">{icon}</span>
        )}
        {label}
      </dt>
      <dd className={cn(
        "font-medium mt-0.5 text-sm sm:text-base",
        status === "complete" && "text-green-600 dark:text-green-400",
        status === "warning" && "text-amber-600 dark:text-amber-400",
        isNotIncluded && "text-gray-400 dark:text-gray-500 text-xs sm:text-sm font-normal"
      )}>
        {isNotIncluded ? "No incluido en tu cotización" : value}
      </dd>
    </div>
  )
}
