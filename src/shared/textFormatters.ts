// Helper to capitalize the first letter of a string, used in multiple places. Moved to a shared file to avoid duplication.
export function capitalize(str?: string) {
  if (typeof str !== "string" || str.length === 0) return ""
  return str[0].toUpperCase() + str.slice(1)
}
