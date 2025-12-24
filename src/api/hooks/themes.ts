import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type ThemeResponse = components["schemas"]["PaginatedTeamSettingsThemeList"]

type Theme = components["schemas"]["TeamSettingsTheme"]

export const useThemes = () =>
  useApi<ThemeResponse>({
    url: makeApiUrl("themes"),
  })

export const useTheme = (id: string) =>
  useApi<Theme>({
    url: makeApiUrl("themes", id),
    lazy: id === undefined,
  })
