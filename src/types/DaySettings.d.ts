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
  "postal_code_ranges"
> & {
  postal_code_ranges: {
    range_end: number
    range_start: number
  }[]
}
