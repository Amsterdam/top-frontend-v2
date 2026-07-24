/**
 * Hierarchical query key factory, one entry per resource exposed by src/api/hooks/*.
 *
 * Keys are structured so that invalidating a parent key (e.g. queryKeys.itineraries.all)
 * also invalidates every child key (e.g. queryKeys.itineraries.detail(id)), replacing the
 * old clearCacheKeys substring-match behavior with TanStack Query's built-in key-prefix matching.
 */
export const queryKeys = {
  addresses: {
    corporations: ["addresses", "housing-corporations"] as const,
    districts: ["addresses", "districts"] as const,
    registrations: (bagId: string) =>
      ["addresses", bagId, "registrations"] as const,
    meldingen: (bagId: string, startDate: string) =>
      ["addresses", bagId, "meldingen", startDate] as const,
    permits: (bagId: string) =>
      ["addresses", bagId, "permits-powerbrowser"] as const,
    permitsDecos: (bagId: string) => ["addresses", bagId, "decos"] as const,
    residents: (bagId: string) => ["addresses", bagId, "residents"] as const,
  },

  cases: {
    search: (addressSearch: string, themeName?: string) =>
      ["cases", "search", { addressSearch, themeName }] as const,
    detail: (caseId: number) => ["cases", caseId] as const,
    events: (caseId: number) => ["cases", caseId, "events"] as const,
    visits: (caseId: number) => ["cases", caseId, "visits"] as const,
  },

  daySettings: {
    all: ["day-settings"] as const,
    detail: (daySettingId: string | number) =>
      ["day-settings", daySettingId] as const,
  },

  itineraries: {
    all: ["itineraries"] as const,
    summary: () => ["itineraries", "summary"] as const,
    detail: (itineraryId: string) => ["itineraries", itineraryId] as const,
    suggestions: (itineraryId: string) =>
      ["itineraries", itineraryId, "suggestions"] as const,
  },

  teamSettings: {
    all: (teamId: string) => ["team-settings", teamId] as const,
    options: (teamId: string, weekday: number) =>
      ["team-settings", teamId, "weekday", weekday] as const,
    reasons: (teamId: string) => ["team-settings", teamId, "reasons"] as const,
    scheduleTypes: (teamId: string) =>
      ["team-settings", teamId, "schedule-types"] as const,
    stateTypes: (teamId: string) =>
      ["team-settings", teamId, "state-types"] as const,
    caseProjects: (teamId: string) =>
      ["team-settings", teamId, "case-projects"] as const,
    subjects: (teamId: string) =>
      ["team-settings", teamId, "subjects"] as const,
    tags: (teamId: string) => ["team-settings", teamId, "tags"] as const,
  },

  themes: {
    all: ["themes"] as const,
    detail: (id: string) => ["themes", id] as const,
  },

  users: {
    all: ["users"] as const,
  },

  visits: {
    all: ["visits"] as const,
    detail: (id: string | number) => ["visits", id] as const,
  },
} as const
