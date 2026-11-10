import type { FieldError } from "react-hook-form"

/**
 * The room's number fields are typed as numbers, but TextInputControl renders a Controller,
 * which ignores valueAsNumber, so a typed-in value arrives as the input's string ("12.5").
 * Returns null for an empty or invalid value.
 */
export function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

/** "20,5 m²": an oppervlakte the Dutch way, with up to 2 decimals. */
export const formatM2 = (oppervlakte: number) =>
  `${new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(oppervlakte)} m²`

/** A new, empty lengte x breedte = oppervlakte row. */
export const emptyVlak = (): Vlak => ({
  lengte: null,
  breedte: null,
  oppervlakte: null,
})

/** Lengte x breedte rounded to cm², or null while either is missing. */
export function multiply(lengte: unknown, breedte: unknown): number | null {
  const l = toNumber(lengte)
  const b = toNumber(breedte)
  return l !== null && b !== null ? Math.round(l * b * 100) / 100 : null
}

/**
 * The ruimte's oppervlakte: the rows' oppervlaktes added up, rounded to cm². Rows without an
 * oppervlakte don't count; null when no row has one.
 */
export function sumVlakken(vlakken: Vlak[] | undefined): number | null {
  const oppervlaktes = (vlakken ?? [])
    .map((vlak) => toNumber(vlak.oppervlakte))
    .filter((oppervlakte) => oppervlakte !== null)
  if (oppervlaktes.length === 0) return null

  const total = oppervlaktes.reduce((sum, oppervlakte) => sum + oppervlakte, 0)
  return Math.round(total * 100) / 100
}

type RoomList = "binnenruimtes" | "buitenruimtes"

/** The input name of one row's oppervlakte. */
export const vlakOppervlakteName = (
  name: RoomList,
  index: number,
  vlakIndex: number,
) => `${name}.${index}.vlakken.${vlakIndex}.oppervlakte` as const

/**
 * The room's required oppervlakte fields: every row's oppervlakte, so a row is either filled
 * in or removed. The room's own oppervlakte is their total, not an input.
 */
export const vlakOppervlakteNames = (
  name: RoomList,
  index: number,
  vlakken: Vlak[] | undefined,
) =>
  (vlakken ?? []).map((_, vlakIndex) =>
    vlakOppervlakteName(name, index, vlakIndex),
  )

/**
 * The rows' oppervlakte errors by input name: mapErrorsToAlert only reads the top-level keys
 * of the errors object, so the nested ones need flattening first.
 */
export function vlakOppervlakteErrors(
  name: RoomList,
  index: number,
  vlakErrors: unknown,
): Record<string, FieldError> {
  const rows = Array.isArray(vlakErrors)
    ? (vlakErrors as ({ oppervlakte?: FieldError } | undefined)[])
    : []
  return Object.fromEntries(
    rows.flatMap((row, vlakIndex) =>
      row?.oppervlakte
        ? [[vlakOppervlakteName(name, index, vlakIndex), row.oppervlakte]]
        : [],
    ),
  )
}
