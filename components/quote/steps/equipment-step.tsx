"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { type Equipment, equipmentSchema } from "@/lib/types"

interface EquipmentStepProps {
  data?: Equipment
  onUpdate: (data: Equipment) => void
  onNext: () => void
  onBack: () => void
}

export function EquipmentStep({ data, onUpdate, onNext, onBack }: EquipmentStepProps) {
  const form = useForm<Equipment>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: data || {
      sound: false,
      lighting: false,
      ledFloor: false,
      dj: false,
      microphones: 0,
      speakers: 0,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    onUpdate(values);
    onNext();
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Equipamiento</h2>
        <p className="text-muted-foreground">Selecciona el equipamiento que necesitas para tu evento.</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="sound"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Sonido</FormLabel>
                    <FormDescription>Sistema de sonido profesional</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lighting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Iluminación</FormLabel>
                    <FormDescription>Sistema de iluminación para el evento</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ledFloor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Pista LED</FormLabel>
                    <FormDescription>Pista de baile con iluminación LED</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dj"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>DJ</FormLabel>
                    <FormDescription>Servicio de DJ profesional</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="microphones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Micrófonos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Cantidad de micrófonos (0-10)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speakers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altavoces</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Cantidad de altavoces (0-20)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Atrás
            </Button>
            <Button type="submit">Siguiente</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
