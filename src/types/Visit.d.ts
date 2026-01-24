type Visit = components["schemas"]["Visit"]

type VisitPayload = Omit<Visit, "id" | "team_members" | "completed">
