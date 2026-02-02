import { type DescriptionItem } from "@/components"
import { renderValue } from "./renderValue"
import { EVENT_CONFIG } from "../config/eventConfig"

export function buildDescriptionData(
  event: CaseEvent,
  config: (typeof EVENT_CONFIG)[string],
): DescriptionItem[] {
  const baseData = config.fields
    .map((field) => {
      const key = field.label.toLowerCase()
      const rawValue = field.value(event)

      let type: "time" | "date" | undefined
      if (key.includes("datum")) type = "date"
      else if (key.includes("starttijd")) type = "time"

      const value = renderValue(rawValue, type)
      if (value === undefined) return null

      return { label: field.label, value }
    })
    .filter(Boolean) as DescriptionItem[]

  // VISIT: extra Datum afgeleid van start_time
  if (event.type === "VISIT") {
    const startTime = event.event_values.start_time
    const dateValue = renderValue(startTime, "date")

    if (dateValue !== undefined) {
      return [{ label: "Datum", value: dateValue }, ...baseData]
    }
  }

  // GENERIC_TASK: toon alle event_variables
  if (event.type === "GENERIC_TASK") {
    const variablesData = event.event_variables
      ? Object.values(event.event_variables)
          .map((variable) => {
            const value = renderValue(variable.value)
            if (value === undefined) return null

            return {
              label: variable.label,
              value,
            }
          })
          .filter(Boolean)
      : []

    return [...baseData, ...variablesData] as DescriptionItem[]
  }

  return baseData
}
