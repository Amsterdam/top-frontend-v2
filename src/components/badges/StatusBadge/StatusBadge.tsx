import {
  HistoryIcon,
  HouseIcon,
  DocumentCheckMarkIcon,
} from "@amsterdam/design-system-react-icons"
import { type BadgeProps } from "@amsterdam/design-system-react"
import { renderStatusBadge } from "@/shared"

export function StatusBadge({ statusName }: { statusName?: string | null }) {
  if (!statusName) return null

  let color: BadgeProps["color"] = "azure"
  let svg = HouseIcon

  if (statusName === "Hercontrole") {
    color = "magenta"
    svg = HistoryIcon
  } else if (statusName === "Debrief") {
    color = "lime"
    svg = DocumentCheckMarkIcon
  }

  return renderStatusBadge(statusName, "info", svg, color)
}
