import {
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
} from "@amsterdam/design-system-react-icons"
import { Tag, type TagColor } from "../Tag/Tag"
import { visitEventValuesMap } from "@/components/CaseEventTimeline/config/values"

export function VisitTag({ situation }: { situation?: string | null }) {
  if (!situation) return null

  const name =
    visitEventValuesMap[situation as keyof typeof visitEventValuesMap] ??
    situation

  let color: TagColor = "azure"
  let icon
  if (situation === "access_granted") {
    color = "green"
    icon = SuccessIcon
  } else if (situation === "nobody_present") {
    color = "orange"
    icon = InfoIcon
  } else if (situation === "no_cooperation") {
    color = "red"
    icon = ErrorIcon
  }

  return <Tag name={name} color={color} icon={icon} />
}
