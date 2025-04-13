"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuoteFormData } from "@/lib/types"

interface ReviewStepProps {
  data: Partial<QuoteFormData>
  onNext: () => void
  onBack: () => void
  onEdit: (step: number) => void
}

export function ReviewStep({ data, onNext, onBack, onEdit }: ReviewStepProps) {
  const eventDetails = data.eventDetails
  const equipment = data.equipment

  if (!eventDetails || !equipment) {
    return <div>Información incompleta. Por favor, vuelve atrás y completa todos los campos.</div>
  }

  const eventTypeMap: Record<string, string> = {
    boda: "Boda",
    corporativo: "Corporativo",
    fiesta: "Fiesta",
    concierto: "Concierto",
    otro: "Otro",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Revisión</h2>
        <p className="text-muted-foreground">Revisa los detalles de tu cotización antes de continuar.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Detalles del evento</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Fecha</dt>
                <dd>{format(eventDetails.date, "PPP", { locale: es })}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Ubicación</dt>
                <dd>{eventDetails.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Tipo de evento</dt>
                <dd>{eventTypeMap[eventDetails.eventType]}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Invitados</dt>
                <dd>{eventDetails.guestCount}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Equipamiento</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              Editar
            </Button>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Sonido</dt>
                <dd>{equipment.sound ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Iluminación</dt>
                <dd>{equipment.lighting ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Pista LED</dt>
                <dd>{equipment.ledFloor ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">DJ</dt>
                <dd>{equipment.dj ? "Sí" : "No"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Micrófonos</dt>
                <dd>{equipment.microphones}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Altavoces</dt>
                <dd>{equipment.speakers}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onNext}>Obtener presupuesto</Button>
      </div>
    </div>
  )
}
