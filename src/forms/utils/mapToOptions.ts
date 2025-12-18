export type OptionItem = {
  value: string
  label: string
}

export function mapToOptions<T>(
  items: T[],
  valueKey: keyof T,
  labelKey: keyof T,
  includeEmpty: boolean = true,
  emptyLabel: string = "Maak een keuze",
): OptionItem[] {
  const mapped = items.map((item) => ({
    value: String(item[valueKey]),
    label: String(item[labelKey]),
  }))

  if (!includeEmpty) return mapped

  return [{ value: "", label: emptyLabel }, ...mapped]
}
