// import { Tag, type TagColor } from "@/components"
import { Badge, type BadgeProps } from "@amsterdam/design-system-react"

function getStatusColor(status: string): BadgeProps["color"] {
  const normalized = status.toLowerCase()

  if (normalized.includes("gereed")) {
    return undefined // default color green
  }

  if (normalized.includes("intake")) {
    return "azure"
  }

  if (normalized.includes("behandel")) {
    return "orange"
  }

  return "yellow"
}

export function PermitBadge({ status }: { status: string }) {
  if (!status) return null
  const color = getStatusColor(status)
  return <Badge label={status} color={color} />
}
