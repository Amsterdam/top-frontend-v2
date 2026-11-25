import dayjs from "dayjs"
import type { ResidentNaam } from "../types"

/**
 * De tijd tussen nu en de datum in hele jaren, maanden of dagen: "24 jaar",
 * "3 maanden". Telt naar beneden, zoals een leeftijd: wie over twee weken
 * 25 wordt, is nog 24. (`fromNow` van dayjs rondt af en klopt daarom niet.)
 */
export const getTimeFromNow = (date?: string) => {
  if (!date) return ""
  const parsed = dayjs(date)
  if (!parsed.isValid()) return ""

  const now = dayjs()
  const [from, to] = parsed.isBefore(now) ? [parsed, now] : [now, parsed]

  const years = to.diff(from, "year")
  if (years >= 1) return `${years} jaar`
  const months = to.diff(from, "month")
  if (months >= 1) return months === 1 ? "één maand" : `${months} maanden`
  const days = to.diff(from, "day")
  return days === 1 ? "één dag" : `${days} dagen`
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
