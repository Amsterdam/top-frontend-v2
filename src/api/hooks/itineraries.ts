import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import stringifyQueryParams from "../utils/stringifyQueryParams"

type ItineraryResponse = {
  itineraries: components["schemas"]["Itinerary"][]
}

export const useItineraries = () => {
  const today = new Date()
  const created_at = today.toISOString().split("T")[0]
  const queryString = stringifyQueryParams({ created_at })
  return useApi<ItineraryResponse>({
    url: makeApiUrl("itineraries", queryString),
  })
}
