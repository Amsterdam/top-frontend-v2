import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import type { ApiOptions } from "@/api/types/apiOptions"

type SuggestionsResponse = {
  cases: Case[]
}

type TeamMemberPayload = {
  user: {
    id: string
  }
}

type CreateItineraryPayload = {
  created_at: string
  team_members: TeamMemberPayload[]
  day_settings_id: number
  target_length: number
  start_case: Record<string, unknown>
}

type UpdateItineraryPayload = {
  id: number
  itinerary: number
}

export const useItinerariesSummary = () => {
  return useApi<Itinerary[]>({
    url: makeApiUrl("itineraries", "summary"),
  })
}

export const useItinerary = (itineraryId?: string, options?: ApiOptions) => {
  return useApi<Itinerary, CreateItineraryPayload>({
    ...options,
    url: makeApiUrl("itineraries", itineraryId),
    lazy: options?.lazy ?? !itineraryId,
  })
}

export const useItinerarySuggestions = (
  itineraryId?: string,
  options?: ApiOptions,
) => {
  return useApi<SuggestionsResponse>({
    ...options,
    url: makeApiUrl("itineraries", itineraryId, "suggestions"),
  })
}

export const useItineraryChangeTeamMembers = (itineraryId?: string) => {
  return useApi<
    { team_members: components["schemas"]["ItineraryTeamMember"][] },
    { team_members: TeamMemberPayload[] }
  >({
    url: makeApiUrl("itineraries", itineraryId, "team"),
    lazy: true,
  })
}

export const useItineraryItem = (
  itineraryItemId?: string | number,
  options?: ApiOptions,
) => {
  return useApi<ItineraryItem>({
    ...options,
    url: makeApiUrl("itinerary-items", itineraryItemId),
  })
}

export const useItineraryItems = (options?: ApiOptions) => {
  return useApi<ItineraryItem, UpdateItineraryPayload>({
    ...options,
    url: makeApiUrl("itinerary-items"),
  })
}
