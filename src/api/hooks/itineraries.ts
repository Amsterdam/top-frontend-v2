import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import stringifyQueryParams from "../utils/stringifyQueryParams"

type Theme = {
  id: string
  name: string
}

type ThemeResponse = {
  results: Theme[]
}

export const useItineraries = () => {
  const today = new Date()
  const created_at = today.toISOString().split("T")[0]
  const queryString = stringifyQueryParams({ created_at })
  return useApi<ThemeResponse>({
    url: makeApiUrl("itineraries", queryString),
    lazy: false,
    isProtected: true,
  })
}
