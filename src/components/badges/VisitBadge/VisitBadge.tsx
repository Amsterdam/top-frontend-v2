import {
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
} from "@amsterdam/design-system-react-icons"
import { Badge, type BadgeProps } from "@amsterdam/design-system-react"
import { visitEventValuesMap } from "@/components/CaseEventTimeline/config/values"

export function VisitBadge({ situation }: { situation?: string | null }) {
  if (!situation) return null

  const name =
    visitEventValuesMap[situation as keyof typeof visitEventValuesMap] ??
    situation

  let color: BadgeProps["color"] = "azure"
  let svg
  if (situation === "access_granted") {
    color = undefined // Badge's default resolves to the success (green) feedback color
    svg = SuccessIcon
  } else if (situation === "nobody_present") {
    color = "orange"
    svg = InfoIcon
  } else if (situation === "no_cooperation") {
    color = "red"
    svg = ErrorIcon
  }

  return <Badge label={name} color={color} icon={svg} />
}
