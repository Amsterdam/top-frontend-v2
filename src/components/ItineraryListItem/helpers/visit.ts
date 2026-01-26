export type VisitState = "pendingVisit" | "visitInProgress" | "visitCompleted"

export function getMostRecentVisit(item: ItineraryItem) {
  return item?.visits?.length
    ? item.visits.reduce((prev, curr) =>
        Number(curr.id) > Number(prev.id) ? curr : prev,
      )
    : null
}

export function getVisitState(item: ItineraryItem): VisitState {
  const visit = getMostRecentVisit(item)

  if (!visit) return "pendingVisit"
  if (visit.completed) return "visitCompleted"
  return "visitInProgress"
}
