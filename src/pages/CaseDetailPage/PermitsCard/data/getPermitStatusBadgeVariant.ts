import type { StatusBadgeVariant } from "@/shared"

export function getPermitStatusBadgeVariant(
  status?: string | null,
): StatusBadgeVariant {
  const normalizedStatus = status?.toLowerCase().trim()

  if (!normalizedStatus) {
    return "info"
  }

  if (
    normalizedStatus.includes("error") ||
    normalizedStatus.includes("fout") ||
    normalizedStatus.includes("afgewezen") ||
    normalizedStatus.includes("geweigerd") ||
    normalizedStatus.includes("mislukt") ||
    normalizedStatus.includes("verlopen")
  ) {
    return "error"
  }

  if (normalizedStatus.includes("gereed") || normalizedStatus.includes("verleend")) {
    return "success"
  }

  if (normalizedStatus.includes("behandel") || normalizedStatus.includes("behandeling")) {
    return "warning"
  }

  if (
    normalizedStatus.includes("intake") ||
    normalizedStatus.includes("nieuw") ||
    normalizedStatus.includes("concept")
  ) {
    return "info"
  }

  return "warning"
}
