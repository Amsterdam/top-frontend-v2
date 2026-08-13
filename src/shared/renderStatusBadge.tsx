import { Badge, type BadgeProps } from "@amsterdam/design-system-react"

export type StatusBadgeVariant = "success" | "info" | "warning" | "error"

type StatusBadgeOptions =
  | {
      variant?: StatusBadgeVariant
      icon?: BadgeProps["icon"]
      color?: never
    }
  | {
      color?: BadgeProps["color"]
      icon?: BadgeProps["icon"]
      variant?: never
    }

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
  options: StatusBadgeOptions = {},
) {
  if (!label) return null

  const color = options.color ?? getStatusBadgeColor(options.variant ?? "info")

  return <Badge label={label} color={color} icon={options.icon} />
}
