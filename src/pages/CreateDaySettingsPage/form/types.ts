export type FormValues = {
  day_segments: string[]
  districts: string[]
  housing_corporation_combiteam?: string
  housing_corporations?: string[]
  // id?: number
  // length_of_list: number
  // max_use_limit: number
  name: string
  opening_date: string
  postal_code_ranges: {
    range_start?: number
    range_end?: number
  }[]
  // postal_code_ranges_presets: string[]
  postal_codes_type: string
  priorities: string[]
  project_ids: string[]
  reasons: string[]
  state_types: string[]
  subjects: string[]
  tags: string[]
  team_settings: string
  // used_today_count: number
  week_days: string[]
  week_segments: string[]
}
