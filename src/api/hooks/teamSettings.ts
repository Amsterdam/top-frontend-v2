import { useApi } from "../useApi"

type Theme = {
  id: string
  name: string
}

type ThemeResponse = {
  results: Theme[]
}

export const useThemeSettings = (themeId?: string) => useApi<ThemeResponse>(`team-settings/${themeId}`)
