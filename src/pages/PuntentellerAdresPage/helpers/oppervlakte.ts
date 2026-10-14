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
