type LabelMap = Record<string, string>

export type FieldFormatter = (value: unknown, event: CaseEvent) => unknown

export function mapFields(
  labels: LabelMap,
  fieldFormatters?: Record<string, FieldFormatter>,
) {
  return Object.entries(labels).map(([key, label]) => ({
    label,
    value: (event: CaseEvent) => {
      const values = event.event_values as Record<string, unknown>
      const rawValue = values[key]

      const formatter = fieldFormatters?.[key]
      return formatter ? formatter(rawValue, event) : rawValue
    },
  }))
}

export function mapEnum(value: unknown, enumMap: Record<string, string>) {
  if (Array.isArray(value)) {
    return value.map((v) => enumMap[v] ?? v)
  }

  if (typeof value === "string") {
    return enumMap[value] ?? value
  }

  return value
}
