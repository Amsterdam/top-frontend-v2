type LabelMap = Record<string, string>

export function mapFields(
  labels: LabelMap,
  valueMapper?: (key: string, value: unknown) => unknown,
) {
  return Object.entries(labels).map(([key, label]) => ({
    label,
    value: (event: CaseEvent) => {
      const values = event.event_values as Record<string, unknown>
      const rawValue = values[key]
      return valueMapper ? valueMapper(key, rawValue) : rawValue
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
