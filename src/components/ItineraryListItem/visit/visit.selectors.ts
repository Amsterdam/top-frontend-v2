import { VisitState } from "./visit.types"

export function getMostRecentVisit(item: ItineraryItem) {
  if (!item?.visits?.length) return null

  return item.visits.reduce((prev, curr) =>
    Number(curr.id) > Number(prev.id) ? curr : prev,
  )
}

export function getVisitState(item: ItineraryItem): VisitState {
  const visit = getMostRecentVisit(item)

  if (!visit) return VisitState.Pending
  if (visit.completed) return VisitState.Completed
  return VisitState.InProgress
}
