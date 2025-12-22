export function cleanAddress(fullAddress: string): string {
  let cleaned = fullAddress.replace(",", "")
  cleaned = cleaned.replace(/\s*\d{4}[A-Z]{2}/i, "")
  return cleaned.trim()
}
