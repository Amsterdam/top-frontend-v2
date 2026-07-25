import {
  ArrowUpIcon,
  PassportIcon,
  ThumbsUpIcon,
} from "@amsterdam/design-system-react-icons"
import { Badge } from "@amsterdam/design-system-react"

type Props = {
  priority?: { weight: number }
  showNormalPriority?: boolean
}

export function PriorityBadge({ priority, showNormalPriority }: Props) {
  const weight = priority?.weight ?? 0

  if (weight >= 1) {
    return <Badge color="magenta" label="Machtiging" icon={PassportIcon} />
  } else if (weight >= 0.5) {
    return <Badge color="red" label="Prio" icon={ArrowUpIcon} />
  } else if (showNormalPriority) {
    return <Badge label="Normaal" icon={ThumbsUpIcon} />
  }

  return null
}

export default PriorityBadge
