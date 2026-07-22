// import { Tag, type TagColor } from "@/components"
import { Badge, type BadgeProps } from "@amsterdam/design-system-react"

function getStatusColor(status: string): BadgeProps["color"] {
  const normalized = status.toLowerCase()

  if (normalized.includes("gereed")) {
    return "lime"
  }

  if (normalized.includes("intake")) {
    return "azure"
  }

  if (normalized.includes("behandel")) {
    return "orange"
  }

  return "yellow"
}

export function PermitTag({ status }: { status: string }) {
  if (!status) return null
  const color = getStatusColor(status)
  return <Badge label={status} color={color} />
}
