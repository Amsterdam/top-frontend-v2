export const VisitState = {
  Pending: "pendingVisit",
  InProgress: "visitInProgress",
  Completed: "visitCompleted",
} as const

export type VisitState = (typeof VisitState)[keyof typeof VisitState]
