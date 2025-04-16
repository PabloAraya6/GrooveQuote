"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { type EventDetails, eventDetailsSchema } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EventDetailsStepProps {
  data?: EventDetails
  onUpdate: (data: EventDetails) => void
  onNext: () => void
}

export function EventDetailsStep({ data, onUpdate, onNext }: EventDetailsStepProps) {
  const form = useForm<EventDetails>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: data || {
      date: new Date(),
      location: "",
      eventType: "fiesta",
      guestCount: 50,
    },
  })

  const onSubmit = (values: EventDetails) => {
    onUpdate(values)
    onNext()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Detalles del evento</h2>
        <p className="text-muted-foreground">
          Cuéntanos sobre tu evento para poder ofrecerte un presupuesto personalizado.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha del evento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección del evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de evento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de evento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="boda">Boda</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                    <SelectItem value="fiesta">Fiesta</SelectItem>
                    <SelectItem value="concierto">Concierto</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de invitados: {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={10}
                    max={1000}
                    step={10}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormDescription>Desliza para seleccionar el número de invitados</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full sm:w-auto sm:ml-auto sm:block">
            Siguiente
          </Button>
        </form>
      </Form>
    </div>
  )
}
