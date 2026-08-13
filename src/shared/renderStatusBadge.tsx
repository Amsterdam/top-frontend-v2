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
      return "azure"
  }
}

export function renderStatusBadge(
  label?: string | null,
  variant: StatusBadgeVariant = "info",
  icon?: BadgeProps["icon"],
  color = getStatusBadgeColor(variant),
) {
  if (!label) return null

  return <Badge label={label} color={color} icon={icon} />
}
