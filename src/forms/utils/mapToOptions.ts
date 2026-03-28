/**
 * Maps an array of objects to an array of option items suitable for use in dropdowns or select inputs.
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: "Alice" },
 *   { id: 2, name: "Bob" }
 * ];
 * const options = mapToOptions("id", "name", users, true, "Selecteer een gebruiker");
 * // options: [
 * //   { value: "", label: "Selecteer een gebruiker" },
 * //   { value: "1", label: "Alice" },
 * //   { value: "2", label: "Bob" }
 * // ]
 * ```
 */

export type OptionItem = {
  value: string
  label: string
}

export function mapToOptions<T>(
  valueKey: keyof T,
  labelKey: keyof T,
  items?: T[],
  emptyLabel?: string,
): OptionItem[] {
  const mapped =
    items?.map((item) => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
    })) ?? []

  if (!emptyLabel) return mapped

  return [{ value: "", label: emptyLabel }, ...mapped]
}
