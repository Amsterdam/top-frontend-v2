import { ArrowUpIcon, PassportIcon } from "@amsterdam/design-system-react-icons"
import { Tag } from "../Tag/Tag"

type Priority = {
  priority?: { weight: number }
}

export function PriorityTag({ priority }: Priority) {
  const weight = priority?.weight ?? 0

  if (weight >= 1) {
    return <Tag color="purple" name="Machtiging" icon={PassportIcon} />
  } else if (weight >= 0.5) {
    return <Tag color="red" name="Prio" icon={ArrowUpIcon} />
  }

  return null
}

export default PriorityTag
