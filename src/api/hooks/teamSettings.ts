import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type ThemeResponse = components["schemas"]["PaginatedTeamSettingsList"]

export const useTeamSettings = (teamId?: string) =>
  useApi<ThemeResponse>({
    url: makeApiUrl("team-settings", teamId),
    lazy: teamId === undefined,
    isProtected: true,
  })
