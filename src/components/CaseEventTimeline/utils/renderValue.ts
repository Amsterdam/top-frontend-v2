import dayjs from "dayjs"
import type { JSX } from "react"

const SUPPORTED_DATE_INPUT_FORMATS = [
  "YYYY-MM-DD",
  "DD-MM-YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.SSSSSSZ",
  "YYYY-MM-DDTHH:mm:ssZZ",
]

const STANDARD_DATE_DISPLAY = "dddd D MMMM YYYY"
const STANDARD_TIME_DISPLAY = "HH:mm"

// helper om eerste letter te capitalizen
function capitalize(str: string) {
  if (!str) return str
  return str[0].toUpperCase() + str.slice(1)
}

export function renderValue(
  value: unknown,
  type?: "time",
): string | JSX.Element | undefined {
  if (value === null || value === undefined) return undefined

  if (Array.isArray(value)) {
    if (value.length === 0) return undefined
    return value.map(capitalize).join(", ") // hoofdletter voor elk array-item
  }

  if (typeof value === "string") {
    const parsed = dayjs(value, SUPPORTED_DATE_INPUT_FORMATS, true)
    if (parsed.isValid()) {
      const formatted =
        type === "time"
          ? parsed.format(STANDARD_TIME_DISPLAY)
          : parsed.format(STANDARD_DATE_DISPLAY)
      return capitalize(formatted) // eerste letter van de datum
    }

    if (value.trim() === "") return undefined
    return capitalize(value) // eerste letter van string
  }

  if (typeof value === "number") return value.toString()
  if (typeof value === "boolean") return value ? "Ja" : "Nee"

  const json = JSON.stringify(value)
  return json === "{}" || json === "[]" ? undefined : capitalize(json)
}
