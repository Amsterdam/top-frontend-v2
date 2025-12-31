export function cleanAddress(fullAddress?: string): string {
  if (!fullAddress) return ""
  let cleaned = fullAddress.replace(",", "")
  cleaned = cleaned.replace(/\s*\d{4}[A-Z]{2}/i, "")
  return cleaned.trim()
}
