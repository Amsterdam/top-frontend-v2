import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import type { ApiOptions } from "../types/apiOptions"

type TeamSettings = components["schemas"]["TeamSettings"]

type TeamSettingsTheme = components["schemas"]["TeamSettingsTheme"]

export const useTeamSettings = (teamId?: string, options?: ApiOptions) =>
  useApi<TeamSettings>({
    url: makeApiUrl("team-settings", teamId),
    lazy: options?.lazy ?? !teamId,
  })

export const useTeamSettingsOptions = (
  teamId?: string,
  weekday?: number,
  options?: ApiOptions,
) =>
  useApi<TeamSettingsTheme[]>({
    url: makeApiUrl("team-settings", teamId, "weekday", weekday),
    lazy: options?.lazy || teamId === undefined || weekday === undefined,
  })

export const useTeamSettingsReasons = (teamId?: string, options?: ApiOptions) =>
  useApi<components["schemas"]["CaseReason"][]>({
    url: makeApiUrl("team-settings", teamId, "reasons"),
    lazy: options?.lazy ?? !teamId,
  })

export const useTeamSettingsScheduleTypes = (
  teamId?: string,
  options?: ApiOptions,
) =>
  useApi<TeamScheduleTypes>({
    url: makeApiUrl("team-settings", teamId, "schedule-types"),
    lazy: options?.lazy ?? !teamId,
  })

export const useTeamSettingsStateTypes = (
  teamId?: string,
  options?: ApiOptions,
) =>
  useApi<components["schemas"]["CaseStateType"][]>({
    url: makeApiUrl("team-settings", teamId, "state-types"),
    lazy: options?.lazy ?? !teamId,
  })

export const useTeamSettingsCaseProjects = (
  teamId?: string,
  options?: ApiOptions,
) =>
  useApi<components["schemas"]["CaseProject"][]>({
    url: makeApiUrl("team-settings", teamId, "case-projects"),
    lazy: options?.lazy ?? !teamId,
  })

export const useTeamSettingsSubjects = (
  teamId?: string,
  options?: ApiOptions,
) =>
  useApi<components["schemas"]["CaseSubject"][]>({
    url: makeApiUrl("team-settings", teamId, "subjects"),
    lazy: options?.lazy ?? !teamId,
  })

export const useTeamSettingsTags = (teamId?: string, options?: ApiOptions) =>
  useApi<components["schemas"]["CaseTag"][]>({
    url: makeApiUrl("team-settings", teamId, "tags"),
    lazy: options?.lazy ?? !teamId,
  })
