import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type Itinerary = components["schemas"]["Itinerary"]

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

export const useItinerariesSummary = () => {
  return useApi<Itinerary[]>({
    url: makeApiUrl("itineraries", "summary"),
  })
}

export const useItinerary = (itineraryId?: string) => {
  return useApi<Itinerary, CreateItineraryPayload>({
    url: makeApiUrl("itineraries", itineraryId),
    lazy: itineraryId === undefined,
  })
}
