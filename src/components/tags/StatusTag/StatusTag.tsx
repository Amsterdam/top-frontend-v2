import {
  HistoryIcon,
  HouseIcon,
  DocumentCheckMarkIcon,
} from "@amsterdam/design-system-react-icons"
import { Tag, type TagColor } from "../Tag/Tag"

export function StatusTag({ statusName }: { statusName?: string | null }) {
  if (!statusName) return null

  let color: TagColor = "azure"
  let icon = HouseIcon

  if (statusName === "Hercontrole") {
    color = "magenta"
    icon = HistoryIcon
  } else if (statusName === "Debrief") {
    color = "green"
    icon = DocumentCheckMarkIcon
  }

  return <Tag name={statusName} color={color} icon={icon} />
}
