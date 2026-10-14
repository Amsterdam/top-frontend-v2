/**
 * Huursegmenten of the Wet betaalbare huur, by puntentotaal.
 * TODO(puntenteller): check these grenzen with the backend/beleidsboek before relying on them.
 */
export const HUURSEGMENTEN = [
  { name: "Sociale huur", from: 0, to: 143 },
  { name: "Middenhuur", from: 144, to: 186 },
  { name: "Vrije sector", from: 187, to: Infinity },
] as const

export type Huursegment = (typeof HUURSEGMENTEN)[number]

/**
 * The huursegment of a puntentotaal. The total is rounded to whole punten first (assumed,
 * like the WWS does), so 143,4 still counts as sociale huur.
 */
export function huursegment(punten: number): Huursegment {
  const rounded = Math.round(punten)
  return (
    HUURSEGMENTEN.find(({ to }) => rounded <= to) ??
    HUURSEGMENTEN[HUURSEGMENTEN.length - 1]
  )
}
