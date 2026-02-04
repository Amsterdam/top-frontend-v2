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
  debriefViolationMap,
  visit_go_ahead,
} from "./values"
import {
  mapFields,
  mapEnum,
  type FieldFormatter,
} from "../utils/eventConfig.helpers"
import {
  formatCurrencyEUR,
  formatPersons,
} from "../utils/renderValue.formatters.ts"

type EventFieldConfig = {
  label: string
  value: (event: CaseEvent) => unknown
  format?: FieldFormatter
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

  CITIZEN_REPORT: {
    title: eventTypeTitle,
    fields: mapFields(citizenReportLabelsMap),
  },

  DECISION: {
    title: eventTypeTitle,
    fields: mapFields(decisionLabelsMap, {
      sanction_amount: formatCurrencyEUR,
      persons: (value: unknown) => formatPersons(value),
    }),
  },

  DEBRIEFING: {
    title: eventTypeTitle,
    fields: mapFields(debriefLabelsMap, {
      violation: (value: unknown) => mapEnum(value, debriefViolationMap),
    }),
  },

  GENERIC_TASK: {
    title: (event: CaseEvent) =>
      // TypeScript type narrowing
      event.type === "GENERIC_TASK"
        ? event?.event_values?.description
        : "Generieke taak",
    fields: mapFields(genericLabelsMap),
  },

  SCHEDULE: {
    title: eventTypeTitle,
    fields: mapFields(scheduleLabelsMap),
  },

  SUMMON: {
    title: eventTypeTitle,
    fields: mapFields(summonLabelsMap, {
      persons: (value: unknown) => formatPersons(value),
    }),
  },

  VISIT: {
    title: eventTypeTitle,
    fields: mapFields(visitLabelsMap, {
      situation: (value: unknown) => mapEnum(value, visitEventValuesMap),
      observations: (value: unknown) => mapEnum(value, visitEventValuesMap),
      can_next_visit_go_ahead: (value) =>
        value == null ? undefined : mapEnum(String(value), visit_go_ahead),
      suggest_next_visit: (value: unknown) =>
        mapEnum(value, visitEventValuesMap),
    }),
  },
}
