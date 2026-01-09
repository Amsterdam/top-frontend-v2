export function getSchedulePriority(
  schedules?: Array<{ priority?: { weight: number } }>,
): { weight: number } | undefined {
  if (!schedules?.length) return undefined

  return schedules[0]?.priority
}
