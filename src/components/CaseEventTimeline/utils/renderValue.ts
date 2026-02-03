import dayjs from "dayjs"
import type { JSX } from "react"

const SUPPORTED_DATE_INPUT_FORMATS = [
  "YYYY-MM-DD",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.SSSSSSZ",
  "YYYY-MM-DDTHH:mm:ssZZ",
]

const STANDARD_DATE_DISPLAY = "dddd D MMMM YYYY"
const STANDARD_TIME_DISPLAY = "HH:mm"

// helper om eerste letter te capitalizen
function capitalize(str?: string) {
  if (typeof str !== "string" || str.length === 0) return ""
  return str[0].toUpperCase() + str.slice(1)
}

export function renderValue(
  value: unknown,
  type?: "time" | "date",
): string | JSX.Element | undefined {
  if (value === null || value === undefined) return undefined

  // Arrays netjes joinen
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined
    return value.map(capitalize).join(", ")
  }

  // Strings
  if (typeof value === "string") {
    // alleen parsen als type expliciet is "date" of "time"
    if (type === "date" || type === "time") {
      const parsed = dayjs(value, SUPPORTED_DATE_INPUT_FORMATS, true)
      if (parsed.isValid()) {
        const formatted =
          type === "time"
            ? parsed.format(STANDARD_TIME_DISPLAY)
            : parsed.format(STANDARD_DATE_DISPLAY)
        return capitalize(formatted)
      }
    }

    if (value.trim() === "") return undefined
    return capitalize(value)
  }

  // Nummer of boolean
  if (typeof value === "number") return value.toString()
  if (typeof value === "boolean") return value ? "Ja" : "Nee"

  // Fallback JSON
  const json = JSON.stringify(value)
  return json === "{}" || json === "[]" ? undefined : capitalize(json)
}
