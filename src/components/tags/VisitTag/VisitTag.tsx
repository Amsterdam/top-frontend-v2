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
  let svg
  if (situation === "access_granted") {
    color = "green"
    svg = SuccessIcon
  } else if (situation === "nobody_present") {
    color = "orange"
    svg = InfoIcon
  } else if (situation === "no_cooperation") {
    color = "red"
    svg = ErrorIcon
  }

  return <Tag name={name} color={color} svg={svg} />
}
