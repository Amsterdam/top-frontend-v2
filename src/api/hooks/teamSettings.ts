import { useQuery } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

type TeamSettings = components["schemas"]["TeamSettings"]

type TeamSettingsTheme = components["schemas"]["TeamSettingsTheme"]

export const useTeamSettings = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.all(teamId ?? ""),
    queryFn: () => fetch<TeamSettings>(makeApiUrl("team-settings", teamId)),
    enabled: Boolean(teamId),
  })
}

export const useTeamSettingsOptions = (teamId?: string, weekday?: number) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.options(teamId ?? "", weekday ?? -1),
    queryFn: () =>
      fetch<TeamSettingsTheme[]>(
        makeApiUrl("team-settings", teamId, "weekday", weekday),
      ),
    enabled: teamId !== undefined && weekday !== undefined,
  })
}

export const useTeamSettingsReasons = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.reasons(teamId ?? ""),
    queryFn: () =>
      fetch<components["schemas"]["CaseReason"][]>(
        makeApiUrl("team-settings", teamId, "reasons"),
      ),
    enabled: Boolean(teamId),
  })
}

export const useTeamSettingsScheduleTypes = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.scheduleTypes(teamId ?? ""),
    queryFn: () =>
      fetch<TeamScheduleTypes>(
        makeApiUrl("team-settings", teamId, "schedule-types"),
      ),
    enabled: Boolean(teamId),
  })
}

export const useTeamSettingsStateTypes = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.stateTypes(teamId ?? ""),
    queryFn: () =>
      fetch<components["schemas"]["CaseStateType"][]>(
        makeApiUrl("team-settings", teamId, "state-types"),
      ),
    enabled: Boolean(teamId),
  })
}

export const useTeamSettingsCaseProjects = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.caseProjects(teamId ?? ""),
    queryFn: () =>
      fetch<components["schemas"]["CaseProject"][]>(
        makeApiUrl("team-settings", teamId, "case-projects"),
      ),
    enabled: Boolean(teamId),
  })
}

export const useTeamSettingsSubjects = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.subjects(teamId ?? ""),
    queryFn: () =>
      fetch<components["schemas"]["CaseSubject"][]>(
        makeApiUrl("team-settings", teamId, "subjects"),
      ),
    enabled: Boolean(teamId),
  })
}

export const useTeamSettingsTags = (teamId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.teamSettings.tags(teamId ?? ""),
    queryFn: () =>
      fetch<components["schemas"]["CaseTag"][]>(
        makeApiUrl("team-settings", teamId, "tags"),
      ),
    enabled: Boolean(teamId),
  })
}
