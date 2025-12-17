import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type Theme = {
  id: string
  name: string
}

type ThemeResponse = {
  results: Theme[]
}

export const useTeamSettings = (teamId?: string) =>
  useApi<ThemeResponse>({
    url: makeApiUrl("team-settings", teamId),
    lazy: teamId === undefined,
    isProtected: true,
  })
