import dayjs from "dayjs"
import { type FormValuesVisit } from "../FormValuesVisit"

type Params = {
  visit: Visit
  itineraryTeamMembers?: number[]
}

export function mapVisitToFormValues({ visit }: Params): FormValuesVisit {
  return {
    start_time: "other",
    start_time_other: dayjs(visit.start_time).format("HH:mm"),
    situation: visit.situation ?? "",
    observations: visit.observations ?? [],
    suggest_next_visit: visit.suggest_next_visit ?? "",
    suggest_next_visit_description: visit.suggest_next_visit_description ?? "",
    can_next_visit_go_ahead:
      visit.can_next_visit_go_ahead == null
        ? ""
        : visit.can_next_visit_go_ahead
          ? "yes"
          : "no",
    can_next_visit_go_ahead_description_yes: visit?.can_next_visit_go_ahead
      ? (visit.can_next_visit_go_ahead_description ?? "")
      : "",
    can_next_visit_go_ahead_description_no: visit?.can_next_visit_go_ahead
      ? ""
      : (visit?.can_next_visit_go_ahead_description ?? ""),
    personal_notes: visit.personal_notes ?? "",
    description: visit.description ?? "",
  }
}
