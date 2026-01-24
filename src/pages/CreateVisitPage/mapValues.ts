import dayjs from "dayjs"
import type { FormValuesVisit } from "./FormValuesVisit"

const nullify = (target: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    target[key] = null
  }
}

export function mapValues(values: FormValuesVisit): VisitPayload {
  const mappedValues: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(values)) {
    if (key === "start_time" || key === "start_time_other") {
      continue
    }

    mappedValues[key] = value === "" ? null : value
  }

  const time =
    values.start_time === "other" ? values.start_time_other : values.start_time

  mappedValues.start_time = time
    ? dayjs().format("YYYY-M-D") + "T" + time
    : null

  if (values.situation === "access_granted") {
    nullify(mappedValues, [
      "can_next_visit_go_ahead",
      "can_next_visit_go_ahead_description_yes",
      "can_next_visit_go_ahead_description_no",
      "observations",
      "suggest_next_visit",
      "suggest_next_visit_description",
    ])
  } else {
    nullify(mappedValues, ["personal_notes", "description"])
  }

  if (values.suggest_next_visit === "unknown") {
    nullify(mappedValues, [
      "can_next_visit_go_ahead",
      "can_next_visit_go_ahead_description_yes",
      "can_next_visit_go_ahead_description_no",
    ])
  } else {
    mappedValues.suggest_next_visit_description = null
  }

  if (values.can_next_visit_go_ahead === "yes") {
    mappedValues.can_next_visit_go_ahead_description_no = null
  } else {
    mappedValues.can_next_visit_go_ahead_description_yes = null
  }

  return mappedValues as VisitPayload
}
