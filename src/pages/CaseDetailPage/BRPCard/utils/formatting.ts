import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type { ResidentNaam } from "../types"

dayjs.extend(relativeTime)

const timeMapper: Record<string, string> = {
  hours: "uur",
  "a day": "één dag",
  days: "dagen",
  "a month": "één maand",
  months: "maanden",
  "a year": "één jaar",
  years: "jaar",
}

export const getTimeFromNow = (date?: string | number) => {
  console.log("DATE", date)
  if (!date) return ""
  const fromNow = dayjs(date).fromNow(true)
  return fromNow.replace(
    /\b(?:hours|a day|days|a month|months|a year|years)\b/gi,
    (m) => timeMapper[m],
  )
}

export const formatName = (naam?: ResidentNaam, useFirstName?: boolean) => {
  if (!naam || Object.keys(naam).length === 0) return "Onbekend"

  const first = useFirstName ? naam.voornamen : naam.voorletters
  const prefix = naam.voorvoegsel
  const last = naam.geslachtsnaam

  if (!last || last === ".") return "Onbekend"

  return [first, prefix, last].filter(Boolean).join(" ")
}

export const capitalizeFirstLetter = (str?: string) => {
  if (!str) return undefined
  return str.charAt(0).toUpperCase() + str.slice(1)
}
