import {
  ArrowUpIcon,
  PassportIcon,
  ThumbsUpIcon,
} from "@amsterdam/design-system-react-icons"
import { Tag } from "../Tag/Tag"

type Props = {
  priority?: { weight: number }
  showNormalPriority?: boolean
}

export function PriorityTag({ priority, showNormalPriority }: Props) {
  const weight = priority?.weight ?? 0

  if (weight >= 1) {
    return <Tag color="purple" name="Machtiging" svg={PassportIcon} />
  } else if (weight >= 0.5) {
    return <Tag color="red" name="Prio" svg={ArrowUpIcon} />
  } else if (showNormalPriority) {
    return <Tag color="green" name="Normaal" svg={ThumbsUpIcon} />
  }

  return null
}

export default PriorityTag
