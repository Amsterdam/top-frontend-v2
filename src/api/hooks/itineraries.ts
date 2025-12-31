import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"

type Options = {
  isProtected?: boolean
  lazy?: boolean
  keepUsingInvalidCache?: boolean
}

type TeamMember = {
  user: {
    id: string
  }
}

type CreateItineraryPayload = {
  created_at: string
  team_members: TeamMember[]
  day_settings_id: number
  target_length: number
  start_case: Record<string, unknown>
}

export const useItinerariesSummary = () => {
  return useApi<Itinerary[]>({
    url: makeApiUrl("itineraries", "summary"),
  })
}

export const useItinerary = (itineraryId?: string, lazy?: boolean) => {
  return useApi<Itinerary, CreateItineraryPayload>({
    url: makeApiUrl("itineraries", itineraryId),
    lazy: lazy ?? !itineraryId,
  })
}

export const useItineraryChangeTeamMembers = (itineraryId?: string) => {
  return useApi<{ team_members: TeamMember[] }>({
    url: makeApiUrl("itineraries", itineraryId, "team"),
    lazy: true,
  })
}

export const useItineraryItem = (
  itineraryItemId?: string | number,
  options?: Options,
) => {
  return useApi<ItineraryItem>({
    ...options,
    url: makeApiUrl("itinerary-items", itineraryItemId),
  })
}
