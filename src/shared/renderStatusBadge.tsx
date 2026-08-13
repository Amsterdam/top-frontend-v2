import { Badge, type BadgeProps } from "@amsterdam/design-system-react"

export type StatusBadgeVariant = "success" | "info" | "warning" | "error"

export function getStatusBadgeColor(
  variant: StatusBadgeVariant,
): BadgeProps["color"] {
  switch (variant) {
    case "success":
      return undefined /* Badge does not accept green, green is the default */
    case "info":
      return "azure"
    case "warning":
      return "orange"
    case "error":
      return "red"
    default:
      return "yellow"
  }
}

export function getStatusBadgeVariant(
  status?: string | null,
): StatusBadgeVariant {
  const normalizedStatus = status?.toLowerCase().trim()

  if (!normalizedStatus) {
    return "info"
  }

  if (
    normalizedStatus.includes("success") ||
    normalizedStatus.includes("succes") ||
    normalizedStatus.includes("gereed") ||
    normalizedStatus.includes("verleend") ||
    normalizedStatus.includes("goedgekeurd") ||
    normalizedStatus.includes("afgerond") ||
    normalizedStatus.includes("voltooid")
  ) {
    return "success"
  }

  if (
    normalizedStatus.includes("warning") ||
    normalizedStatus.includes("waarschuwing") ||
    normalizedStatus.includes("behandel") ||
    normalizedStatus.includes("behandeling") ||
    normalizedStatus.includes("wacht")
  ) {
    return "warning"
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

  if (
    normalizedStatus.includes("info") ||
    normalizedStatus.includes("intake") ||
    normalizedStatus.includes("nieuw") ||
    normalizedStatus.includes("concept")
  ) {
    return "info"
  }

  return "info"
}

export function renderStatusBadge(
  label?: string | null,
  variant: StatusBadgeVariant = "info",
  icon?: BadgeProps["icon"],
) {
  if (!label) return null

  return (
    <Badge label={label} color={getStatusBadgeColor(variant)} icon={icon} />
  )
}
