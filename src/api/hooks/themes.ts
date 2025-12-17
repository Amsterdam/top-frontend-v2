import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type Theme = {
  id: string
  name: string
}

type ThemeResponse = {
  results: Theme[]
}

export const useThemes = () =>
  useApi<ThemeResponse>({
    url: makeApiUrl("themes"),
    lazy: false,
    isProtected: true,
  })

export const useTheme = (id: string) =>
  useApi<Theme>({
    url: makeApiUrl("themes", id),
    lazy: false,
    isProtected: true,
  })
