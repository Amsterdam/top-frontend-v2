import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type ThemeResponse = components["schemas"]["PaginatedTeamSettingsList"]

type TeamSettingsTheme = components["schemas"]["TeamSettingsTheme"]

export const useTeamSettings = (teamId?: string) =>
  useApi<ThemeResponse>({
    url: makeApiUrl("team-settings", teamId),
    lazy: teamId === undefined,
  })

export const useTeamSettingsOptions = (teamId?: string, weekday?: number) =>
  useApi<TeamSettingsTheme[]>({
    url: makeApiUrl("team-settings", teamId, "weekday", weekday),
    lazy: teamId === undefined || weekday === undefined,
  })
