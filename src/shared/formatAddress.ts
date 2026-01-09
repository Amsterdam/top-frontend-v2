export function formatAddress(
  address?: Address,
  includePostalCode = false,
): string {
  if (!address) return ""

  let result = `${address.street_name} ${address.number}`

  if (address.suffix || address.suffix_letter) {
    result = `${result}-${address.suffix || ""}${address.suffix_letter || ""}`
  }

  if (includePostalCode && address.postal_code) {
    result = `${result}, ${address.postal_code}`
  }

  return result.trim()
}
