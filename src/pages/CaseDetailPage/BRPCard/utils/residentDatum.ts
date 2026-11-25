import dayjs from "dayjs"
import { formatDate } from "@/shared"
import type { ResidentDatum } from "../types"

// Het BRP kent vier soorten datums: Datum (datum), JaarMaandDatum (jaar en
// maand), JaarDatum (jaar) en DatumOnbekend (geen datum). Lees een datum
// daarom altijd via deze functies, niet via `datum.datum`.

const getPrecision = (datum: ResidentDatum) =>
  datum.datum ? "day" : datum.maand ? "month" : "year"

/** De datum als tekst die dayjs kan lezen ("2001-03-04", "2001-03" of "2001"); undefined als hij onbekend is. */
export const toIsoDate = (datum?: ResidentDatum) => {
  if (datum?.datum) return datum.datum
  if (!datum?.jaar) return undefined
  if (datum.maand)
    return `${datum.jaar}-${String(datum.maand).padStart(2, "0")}`
  return String(datum.jaar)
}

/** De laatste dag waarop de datum kan vallen: 31-12 bij alleen een jaar. */
export const toLatestDate = (datum?: ResidentDatum) => {
  const iso = toIsoDate(datum)
  if (!datum || !iso) return undefined
  return dayjs(iso).endOf(getPrecision(datum))
}

/** Zo precies als het BRP de datum kent: 04-03-2001, 03-2001 of 2001. */
export const formatResidentDatum = (datum?: ResidentDatum) => {
  const iso = toIsoDate(datum)
  if (!datum || !iso) return undefined
  const format = { day: "DD-MM-YYYY", month: "MM-YYYY", year: "YYYY" }[
    getPrecision(datum)
  ]
  return formatDate(iso, format) ?? undefined
}
