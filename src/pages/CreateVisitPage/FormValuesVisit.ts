export type FormValuesVisit = {
  author: string
  can_next_visit_go_ahead: string | null
  can_next_visit_go_ahead_description_yes: string | null
  can_next_visit_go_ahead_description_no: string | null
  case_id: string
  description: string
  itinerary_item: number
  observations: string[] | null
  personal_notes: string
  situation: string
  start_time: string
  start_time_other: string
  suggest_next_visit: string | null
  suggest_next_visit_description: string | null
}
