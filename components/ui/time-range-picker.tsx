"use client"

import { useState, useEffect } from "react"
import { Clock, ChevronDown, AlertCircle, SunIcon, MoonIcon, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimeRangePickerProps {
  value: string
  onChange: (value: string, hours: number) => void
  className?: string
}

type TimePreset = "day" | "night" | "custom";

export function TimeRangePicker({ value, onChange, className }: TimeRangePickerProps) {
  // Parse initial values from string (HH:MM - HH:MM)
  const parseTimeRange = (timeString: string) => {
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
    if (match) {
      return {
        startTime: `${match[1].padStart(2, '0')}:${match[2]}`,
        endTime: `${match[3].padStart(2, '0')}:${match[4]}`
      }
    }
    return null
  }

  const initialRange = parseTimeRange(value) || { startTime: "22:00", endTime: "05:00" }
  
  const [startTime, setStartTime] = useState(initialRange.startTime)
  const [endTime, setEndTime] = useState(initialRange.endTime)
  const [durationHours, setDurationHours] = useState(0)
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCustom, setShowCustom] = useState(value ? (initialRange.startTime !== "15:00" && initialRange.endTime !== "20:00" && 
                                                       initialRange.startTime !== "22:00" && initialRange.endTime !== "05:00") : false)
  const [activePreset, setActivePreset] = useState<TimePreset>(
    startTime === "15:00" && endTime === "20:00" ? "day" : 
    startTime === "22:00" && endTime === "05:00" ? "night" : 
    "custom"
  )
  
  // Define constraints
  const MIN_DURATION_HOURS = 4
  const MAX_DURATION_HOURS = 8
  const MIN_START_TIME = "13:00" // 1:00 PM
  const MAX_END_TIME = "05:00" // 5:00 AM

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`)
      options.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return options
  }
  
  const timeOptions = generateTimeOptions()
  
  // Convert time to minutes for comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Check if a time is before minimum start time
  const isBeforeMinStartTime = (time: string): boolean => {
    return time < MIN_START_TIME
  }

  // Check if a time is after max end time (5:00 AM)
  const isAfterMaxEndTime = (time: string): boolean => {
    // Consider times between 00:00 and 05:00 as early morning
    if (time >= "00:00" && time <= MAX_END_TIME) return false
    if (time > MAX_END_TIME && time < "12:00") return true
    return false
  }
  
  // Calculate duration and update parent component
  useEffect(() => {
    // Parse hours and minutes
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)
    
    // Calculate total minutes
    let startTotalMinutes = startHours * 60 + startMinutes
    let endTotalMinutes = endHours * 60 + endMinutes
    
    // Handle cross-day time ranges (e.g., 22:00 - 02:00)
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60 // Add a full day
    }
    
    // Calculate duration in hours (with decimal)
    const duration = (endTotalMinutes - startTotalMinutes) / 60
    setDurationHours(Math.round(duration * 10) / 10)
    
    // Check for duration restrictions
    if (duration < MIN_DURATION_HOURS) {
      setError(`El horario debe ser de mínimo ${MIN_DURATION_HOURS} horas`)
    } else if (duration > MAX_DURATION_HOURS) {
      setError(`El horario debe ser máximo de ${MAX_DURATION_HOURS} horas`)
    } else if (isAfterMaxEndTime(endTime)) {
      setError(`El horario máximo de finalización es ${MAX_END_TIME}`)
    } else if (isBeforeMinStartTime(startTime)) {
      setError(`El horario mínimo de inicio es ${MIN_START_TIME}`)
    } else {
      setError(null)
    }
    
    // Format time and call parent onChange only if valid
    if (!error) {
      const formattedTime = `${startTime} - ${endTime}`
      onChange(formattedTime, duration)
    }
  }, [startTime, endTime, error])
  
  // Handler for preset selection
  const handlePresetChange = (preset: TimePreset) => {
    setActivePreset(preset)
    
    if (preset === "day") {
      setStartTime("15:00")
      setEndTime("20:00")
      setShowCustom(false)
    } else if (preset === "night") {
      setStartTime("22:00")
      setEndTime("05:00")
      setShowCustom(false)
    } else {
      setShowCustom(true)
    }
  }
  
  // Function to enable custom mode
  const enableCustomMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCustom(true);
    setActivePreset("custom");
  }
  
  // Filter valid start time options (must be >= 13:00)
  const getValidStartTimeOptions = () => {
    return timeOptions.filter(time => {
      return time >= MIN_START_TIME
    })
  }

  // Function to handle setting start time with validation
  const handleSetStartTime = (time: string) => {
    if (isBeforeMinStartTime(time)) {
      setError(`El horario mínimo de inicio es ${MIN_START_TIME}`)
      return
    }
    
    // Calculate a default end time based on minimum duration
    const startMinutes = timeToMinutes(time)
    let newEndMinutes = startMinutes + (MIN_DURATION_HOURS * 60)
    
    // If crossing midnight
    if (newEndMinutes >= 24 * 60) {
      newEndMinutes = newEndMinutes % (24 * 60)
    }
    
    // Format as HH:MM
    const newEndHours = Math.floor(newEndMinutes / 60)
    const newEndMins = newEndMinutes % 60
    const newEndTime = `${newEndHours.toString().padStart(2, '0')}:${newEndMins.toString().padStart(2, '0')}`
    
    // Check if new end time would be after 5:00 AM
    if (isAfterMaxEndTime(newEndTime)) {
      // Cannot set this start time as it would push end time beyond max
      setError(`No se puede comenzar después de la 01:00 con duración mínima de ${MIN_DURATION_HOURS} horas (límite máximo hasta las ${MAX_END_TIME})`)
      return
    }
    
    // Check current end time duration
    let currentEndMinutes = timeToMinutes(endTime)
    if (currentEndMinutes < startMinutes) {
      currentEndMinutes += 24 * 60 // Add a day if end time is next day
    }
    
    const newDuration = (currentEndMinutes - startMinutes) / 60
    
    setStartTime(time)
    setActivePreset("custom")
    
    // If current duration would be less than minimum or greater than maximum, adjust end time
    if (newDuration < MIN_DURATION_HOURS) {
      setEndTime(newEndTime)
    } else if (newDuration > MAX_DURATION_HOURS) {
      // Calculate new end time based on max duration
      let maxEndMinutes = startMinutes + (MAX_DURATION_HOURS * 60)
      if (maxEndMinutes >= 24 * 60) {
        maxEndMinutes = maxEndMinutes % (24 * 60)
      }
      
      const maxEndHours = Math.floor(maxEndMinutes / 60)
      const maxEndMins = maxEndMinutes % 60
      const maxEndTime = `${maxEndHours.toString().padStart(2, '0')}:${maxEndMins.toString().padStart(2, '0')}`
      
      setEndTime(maxEndTime)
    }
  }

  // Function to handle setting end time with validation
  const handleSetEndTime = (time: string) => {
    // Check if time is after max end time
    if (isAfterMaxEndTime(time)) {
      setError(`El horario máximo de finalización es ${MAX_END_TIME}`)
      return
    }
    
    const startMinutes = timeToMinutes(startTime)
    let endMinutes = timeToMinutes(time)
    
    // If end time is earlier in the day, assume it's next day
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60
    }
    
    // Check if this would make duration less than minimum
    const newDuration = (endMinutes - startMinutes) / 60
    
    if (newDuration < MIN_DURATION_HOURS) {
      setError(`El horario debe ser de mínimo ${MIN_DURATION_HOURS} horas`)
      return
    }
    
    // Check if this would make duration more than maximum
    if (newDuration > MAX_DURATION_HOURS) {
      setError(`El horario debe ser máximo de ${MAX_DURATION_HOURS} horas`)
      return
    }
    
    setEndTime(time)
    setActivePreset("custom")
    setError(null)
  }

  // Filter time options for end time selection based on start time
  const getValidEndTimeOptions = () => {
    return timeOptions.filter(time => {
      const startMinutes = timeToMinutes(startTime)
      let endMinutes = timeToMinutes(time)
      
      // If end time is earlier in the day, assume it's next day
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60
      }
      
      const duration = (endMinutes - startMinutes) / 60
      
      // Check if duration is between min and max, and end time is not after max
      return duration >= MIN_DURATION_HOURS && 
             duration <= MAX_DURATION_HOURS && 
             !isAfterMaxEndTime(time)
    })
  }
  
  return (
    <div className={cn("space-y-5 w-full max-w-full", className)}>
      {/* Step 1: Choose between day or night - Hide when in custom mode */}
      {!showCustom && (
        <div>
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">¿Cuándo necesitas el servicio?</h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePresetChange("day")}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
                activePreset === "day" 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "hover:bg-accent hover:border-accent"
              )}
            >
              <SunIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">Día</span>
              <span className="text-xs text-muted-foreground mt-1">15:00 - 20:00</span>
            </button>
            
            <button
              type="button"
              onClick={() => handlePresetChange("night")}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
                activePreset === "night" 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "hover:bg-accent hover:border-accent"
              )}
            >
              <MoonIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">Noche</span>
              <span className="text-xs text-muted-foreground mt-1">22:00 - 05:00</span>
            </button>
          </div>
        </div>
      )}

      {/* Duration Badge */}
      <div className="flex justify-center">
        <Badge 
          variant="outline" 
          className={cn(
            "px-4 py-2 text-sm font-medium",
            error 
              ? "bg-red-50 text-red-500 border-red-200" 
              : "bg-primary/5 text-primary"
          )}
        >
          <Clock className="w-4 h-4 mr-2" />
          {`Duración: ${durationHours} horas`}
        </Badge>
      </div>

      {/* Button to show customize option - Hide when already in custom mode */}
      {!showCustom && (
        <div className="flex justify-center">
          <Button 
            type="button" 
            variant="outline" 
            className="text-sm"
            onClick={enableCustomMode}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Personalizar horario
          </Button>
        </div>
      )}
      
      {/* Customizer - Only shown when user clicks the button */}
      {showCustom && (
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Personaliza el horario</h4>
          <div className="grid grid-cols-2 gap-2 w-full">
            <div>
              <label className="text-xs font-medium mb-1 block text-muted-foreground">
                Inicio
              </label>
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline" 
                    className={cn(
                      "w-full justify-between font-normal bg-background hover:bg-accent",
                      error && "border-red-300 text-red-500"
                    )}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{startTime}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="start">
                  <div className="flex flex-col max-h-[300px] overflow-auto scrollbar-thin">
                    <div className="sticky top-0 flex justify-center py-2 bg-muted font-medium border-b">
                      Seleccionar hora
                    </div>
                    <div className="py-1">
                      {getValidStartTimeOptions().map((time) => (
                        <button
                          key={`start-${time}`}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors",
                            startTime === time && "bg-primary/10 font-medium text-primary"
                          )}
                          onClick={() => {
                            handleSetStartTime(time);
                            setStartOpen(false);
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block text-muted-foreground">
                Fin
              </label>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline" 
                    className={cn(
                      "w-full justify-between font-normal bg-background hover:bg-accent",
                      error && "border-red-300 text-red-500"
                    )}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{endTime}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="end">
                  <div className="flex flex-col max-h-[300px] overflow-auto scrollbar-thin">
                    <div className="sticky top-0 flex justify-center py-2 bg-muted font-medium border-b">
                      Seleccionar hora
                    </div>
                    <div className="py-1">
                      {getValidEndTimeOptions().map((time) => (
                        <button
                          key={`end-${time}`}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors",
                            endTime === time && "bg-primary/10 font-medium text-primary"
                          )}
                          onClick={() => {
                            handleSetEndTime(time);
                            setEndOpen(false);
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Reset button */}
          <div className="flex justify-center mt-3">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => {
                handlePresetChange(activePreset === "day" ? "day" : "night");
              }}
            >
              Cancelar personalización
            </Button>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
} 