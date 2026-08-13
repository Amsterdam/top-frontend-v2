import {
  SuccessIcon,
  ErrorIcon,
  InfoIcon,
} from "@amsterdam/design-system-react-icons"
import { visitEventValuesMap } from "@/components/CaseEventTimeline/config/values"
import { type StatusBadgeVariant, renderStatusBadge } from "@/shared"

export function VisitBadge({ situation }: { situation?: string | null }) {
  if (!situation) return null

  const name =
    visitEventValuesMap[situation as keyof typeof visitEventValuesMap] ??
    situation

  let variant: StatusBadgeVariant = "info"
  let svg

  if (situation === "access_granted") {
    variant = "success"
    svg = SuccessIcon
  } else if (situation === "nobody_present") {
    variant = "warning"
    svg = InfoIcon
  } else if (situation === "no_cooperation") {
    variant = "error"
    svg = ErrorIcon
  }

  return renderStatusBadge(name, variant, svg)
}
