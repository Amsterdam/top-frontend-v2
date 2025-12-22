import { ArrowUpIcon, PassportIcon } from "@amsterdam/design-system-react-icons"
import { Tag } from "../Tag/Tag"

type Priority = {
  priority?: { weight: number }
}

export function PriorityTag({ priority }: Priority) {
  const weight = priority?.weight ?? 0

  const hasPriority = weight >= 0.5
  const hasWarrant = weight >= 1.0

  if (!hasPriority) {
    return null
  }

  return (
    <>
      {hasPriority && <Tag color="red" name="Prio" icon={ArrowUpIcon} />}
      {hasWarrant && (
        <Tag color="purple" name="Machtiging" icon={PassportIcon} />
      )}
    </>
  )
}

export default PriorityTag
