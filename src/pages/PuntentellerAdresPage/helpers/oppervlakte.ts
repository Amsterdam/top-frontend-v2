const numberFormat = new Intl.NumberFormat("nl-NL", {
  maximumFractionDigits: 2,
})

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

/** "12,5 m²", or null when there's no (valid) number to show. */
export const formatM2 = (value: unknown) => {
  const number = toNumber(value)
  return number != null ? `${numberFormat.format(number)} m²` : null
}

/** "3,25 m", or null when there's no (valid) number to show. */
export const formatMeters = (value: unknown) => {
  const number = toNumber(value)
  return number != null ? `${numberFormat.format(number)} m` : null
}

/** Sum of the rooms' oppervlakte; rooms without one (e.g. an overloop) don't count. */
export function sumOppervlakte(ruimtes: { oppervlakte: unknown }[]) {
  const total = ruimtes.reduce(
    (sum, { oppervlakte }) => sum + (toNumber(oppervlakte) ?? 0),
    0,
  )
  // Round away floating point noise such as 0.1 + 0.2 = 0.30000000000000004.
  return Math.round(total * 100) / 100
}
