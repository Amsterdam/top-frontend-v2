import {
  HistoryIcon,
  HouseIcon,
  DocumentCheckMarkIcon,
} from "@amsterdam/design-system-react-icons"
import { type TagColor } from "../Tag/Tag"
import { Badge } from "@amsterdam/design-system-react"

export function StatusTag({ statusName }: { statusName?: string | null }) {
  if (!statusName) return null

  let color: TagColor = "azure"
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
