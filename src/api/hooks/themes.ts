import { useQuery } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

type ThemeResponse = components["schemas"]["PaginatedTeamSettingsThemeList"]

export const useThemes = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.themes.all,
    queryFn: () => fetch<ThemeResponse>(makeApiUrl("themes")),
  })
}

export const useTheme = (id?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.themes.detail(id ?? ""),
    queryFn: () => fetch<Theme>(makeApiUrl("themes", id)),
    enabled: id !== undefined,
  })
}
