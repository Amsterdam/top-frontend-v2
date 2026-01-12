import { HistoryIcon, HouseIcon } from "@amsterdam/design-system-react-icons"
import { Tag } from "../Tag/Tag"

export function StatusTag({ statusName }: { statusName?: string | null }) {
  return (
    <Tag
      name={statusName}
      color={statusName === "Hercontrole" ? "magenta" : "azure"}
      icon={statusName === "Hercontrole" ? HistoryIcon : HouseIcon}
    />
  )
}
