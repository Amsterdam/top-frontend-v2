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

const STANDARD_DATE_DISPLAY_FORMAT = "dddd D MMMM YYYY"
const STANDARD_TIME_DISPLAY_FORMAT = "HH:mm"

export function renderValue(
  value: unknown,
  type?: "time",
): string | JSX.Element | undefined {
  if (value === null || value === undefined) return undefined

  if (Array.isArray(value)) {
    if (value.length === 0) return undefined
    return value.join(", ")
  }

  if (typeof value === "string") {
    const parsed = dayjs(value, SUPPORTED_DATE_INPUT_FORMATS, true)
    if (parsed.isValid()) {
      return type === "time"
        ? parsed.format(STANDARD_TIME_DISPLAY_FORMAT)
        : parsed.format(STANDARD_DATE_DISPLAY_FORMAT)
    }
    if (value.trim() === "") return undefined
    return value
  }

  if (typeof value === "number") return value.toString()
  if (typeof value === "boolean") return value ? "Ja" : "Nee"

  const json = JSON.stringify(value)
  return json === "{}" || json === "[]" ? undefined : json
}
