import { useApi } from "../useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import stringifyQueryParams from "../utils/stringifyQueryParams"

type ItineraryResponse = {
  itineraries: components["schemas"]["Itinerary"][]
}

type CreateItineraryPayload = {
  created_at: string
  team_members: {
    user: {
      id: string
    }
  }[]
  day_settings_id: number
  target_length: number
  start_case: Record<string, unknown>
}

type CreateItineraryResponse = {
  message: string
  itinerary_id: string
}

export const useItineraries = () => {
  const today = new Date()
  const created_at = today.toISOString().split("T")[0]
  const queryString = stringifyQueryParams({ created_at })
  return useApi<ItineraryResponse>({
    url: makeApiUrl("itineraries", queryString),
  })
}

export const useCreateItinerary = () => {
  return useApi<CreateItineraryResponse, CreateItineraryPayload>({
    url: makeApiUrl("itineraries"),
  })
}
