import {
  HistoryIcon,
  HouseIcon,
  DocumentCheckMarkIcon,
} from "@amsterdam/design-system-react-icons"
import { Badge, type BadgeProps } from "@amsterdam/design-system-react"

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

  return <Badge label={statusName} color={color} icon={svg} />
}
