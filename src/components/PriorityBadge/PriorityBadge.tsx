import React from "react"
import { Badge } from "@amsterdam/design-system-react"

type Priority = {
  priority?: { weight: number }
}

export const PriorityBadge: React.FC<Priority> = ({ priority }) => {
  const weight = priority?.weight ?? 0

  const hasPriority = weight >= 0.5
  const hasWarrant = weight >= 1.0

  if (!hasPriority) {
    return null
  }

  return (
    <>
      {hasPriority && <Badge color="red" label="PRIO" />}
      {hasWarrant && <Badge color="magenta" label="MACHTIGING" />}
    </>
  )
}

export default PriorityBadge
