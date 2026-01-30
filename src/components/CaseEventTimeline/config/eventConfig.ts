import { caseTypesMap } from "./eventTypes"
import {
  caseCloseLabelsMap,
  citizenReportLabelsMap,
  debriefLabelsMap,
  decisionLabelsMap,
  genericLabelsMap,
  reasonLabelsMap,
  scheduleLabelsMap,
  summonLabelsMap,
  visitLabelsMap,
} from "./labels"
import {
  visitEventValuesMap,
  booleanObj,
  debriefViolationMap,
  visit_go_ahead,
} from "./values"
import { mapFields, mapEnum } from "../utils/eventConfig.helpers"
import { renderValue } from "../utils/renderValue"

type EventFieldConfig = {
  label: string
  value: (event: CaseEvent) => unknown
}

type EventConfig = {
  title: string | ((event: CaseEvent) => string)
  fields: EventFieldConfig[]
}

const eventTypeTitle = (event: CaseEvent) =>
  caseTypesMap[event.type] ?? event.type

export const EVENT_CONFIG: Record<string, EventConfig> = {
  CASE: {
    title: eventTypeTitle,
    fields: mapFields(reasonLabelsMap),
  },

  CASE_CLOSE: {
    title: eventTypeTitle,
    fields: mapFields(caseCloseLabelsMap),
  },

  SCHEDULE: {
    title: eventTypeTitle,
    fields: mapFields(scheduleLabelsMap, (key, value) => {
      if (key === "housing_corporation_combiteam" && value != null) {
        return mapEnum(String(value), booleanObj)
      }
      return value
    }),
  },

  DEBRIEFING: {
    title: eventTypeTitle,
    fields: mapFields(debriefLabelsMap, (key, value) => {
      if (key === "violation") {
        return mapEnum(value, debriefViolationMap)
      }

      if (typeof value === "boolean") {
        return mapEnum(String(value), booleanObj)
      }

      return value
    }),
  },

  SUMMON: {
    title: eventTypeTitle,
    fields: mapFields(summonLabelsMap),
  },

  DECISION: {
    title: eventTypeTitle,
    fields: mapFields(decisionLabelsMap),
  },

  CITIZEN_REPORT: {
    title: eventTypeTitle,
    fields: mapFields(citizenReportLabelsMap),
  },

  GENERIC_TASK: {
    title: eventTypeTitle,
    fields: mapFields(genericLabelsMap),
  },

  VISIT: {
    title: eventTypeTitle,
    fields: mapFields(visitLabelsMap, (key, value) => {
      if (key === "start_time") {
        return renderValue(value, "time")
      }

      if (key === "situation" || key === "observations") {
        return mapEnum(value, visitEventValuesMap)
      }

      if (key === "can_next_visit_go_ahead" && value != null) {
        return mapEnum(String(value), visit_go_ahead)
      }

      return value
    }),
  },
}
