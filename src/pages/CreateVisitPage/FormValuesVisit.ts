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


// {
//   "author": "d0a718d4-fddc-4e9b-8ea4-6f7579f1c92a",
//   "can_next_visit_go_ahead": true,
//   "can_next_visit_go_ahead_description": "Aanvullende informatie bij doorlaten",
//   "can_next_visit_go_ahead_description_no": "g",
//   "can_next_visit_go_ahead_description_yes": "Aanvullende informatie bij doorlaten",
//   "case_id": "5598",
//   "description": "samenvatting voor logboek",
//   "itinerary_item": 2141,
//   "observations": [
//     "malfunctioning_doorbell"
//   ],
//   "personal_notes": "notitie voor rapportage",
//   "start_time": "2026-1-22T14:51",
//   "situation": "no_cooperation",
//   "suggest_next_visit": "weekend",
//   "suggest_next_visit_description": "toelichting bij suggestie weekend",
//   "suggest_next_visit_description_weekend": "toelichting bij suggestie weekend"
// }
