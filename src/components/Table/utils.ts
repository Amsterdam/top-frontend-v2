export function getNestedValue(
  obj: Record<string, unknown> | undefined,
  path: string,
): unknown {
  if (!obj || !path) return undefined

  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}
