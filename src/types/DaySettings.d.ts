type TeamScheduleTypes = Omit<
  components["schemas"]["TeamScheduleTypes"],
  "day_segments" | "week_segments" | "priorities"
> & {
  day_segments: {
    id: number
    name: string
  }[]
  week_segments: {
    id: number
    name: string
  }[]
  priorities: {
    id: number
    name: string
    weight: number
  }[]
}

type DaySettings = Omit<
  components["schemas"]["DaySettings"],
  "postal_code_ranges" | "case_count"
> & {
  postal_code_ranges: {
    range_end: number
    range_start: number
  }[]
  case_count: {
    count: number
  }
}

type DaySettingsPayload = Omit<
  DaySettings,
  | "id"
  | "case_count"
  | "day_segments"
  | "districts"
  | "housing_corporation_combiteam"
  | "housing_corporations"
  | "priorities"
  | "project_ids"
  | "reasons"
  | "state_types"
  | "subjects"
  | "tags"
  | "team_settings"
  | "used_today_count"
  | "week_days"
  | "week_segments"
> & {
  case_count?: string[] | null
  day_segments?: string[] | null
  districts?: string[] | null
  housing_corporation_combiteam?: string | boolean
  housing_corporations?: string[] | null
  priorities?: string[] | null
  project_ids?: string[] | null
  reasons?: string[] | null
  state_types?: string[] | null
  subjects?: string[] | null
  tags?: string[] | null
  team_settings?: string | null
  used_today_count?: string[] | null
  week_days?: string[] | null
  week_segments?: string[] | null
}
