import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

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

type AddItineraryItemPayload = {
  id: number
  itinerary: number
  position?: number
}

export const useItinerariesSummary = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.itineraries.summary(),
    queryFn: () =>
      fetch<components["schemas"]["ItinerarySummary"][]>(
        makeApiUrl("itineraries", "summary"),
      ),
  })
}

export const useItinerary = (
  itineraryId?: string,
  options?: { enabled?: boolean },
) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.itineraries.detail(itineraryId ?? ""),
    queryFn: () => fetch<Itinerary>(makeApiUrl("itineraries", itineraryId)),
    enabled: options?.enabled ?? Boolean(itineraryId),
  })
}

export const useItinerarySuggestions = (itineraryId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.itineraries.suggestions(itineraryId ?? ""),
    queryFn: () =>
      fetch<SuggestionsResponse>(
        makeApiUrl("itineraries", itineraryId, "suggestions"),
      ),
    enabled: Boolean(itineraryId),
  })
}

/**
 * Optimistically patches the cached itinerary detail for itineraryId. Several
 * components (drag-reorder, delete item, complete visit, ...) need to patch
 * this same cache entry without necessarily holding a live useItinerary query.
 */
export const useUpdateItineraryCache = (itineraryId?: string) => {
  const queryClient = useQueryClient()

  return useCallback(
    (updater: (itinerary: Itinerary | undefined) => void) => {
      queryClient.setQueryData(
        queryKeys.itineraries.detail(itineraryId ?? ""),
        (current: Itinerary | undefined) => {
          const next = current ? structuredClone(current) : undefined
          updater(next)
          return next
        },
      )
    },
    [queryClient, itineraryId],
  )
}

export const useCreateItinerary = () => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateItineraryPayload) =>
      fetch<Itinerary>(makeApiUrl("itineraries"), {
        method: "POST",
        data: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.all })
    },
  })
}

export const useDeleteItinerary = (itineraryId?: string) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetch<unknown>(makeApiUrl("itineraries", itineraryId), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.itineraries.summary(),
      })
    },
  })
}

export const useChangeTeamMembers = (itineraryId?: string) => {
  const fetch = useApiFetch()

  return useMutation({
    mutationFn: (payload: { team_members: TeamMemberPayload[] }) =>
      fetch<{ team_members: components["schemas"]["ItineraryTeamMember"][] }>(
        makeApiUrl("itineraries", itineraryId, "team"),
        { method: "PUT", data: payload },
      ),
  })
}

export const useCreateItineraryItem = () => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddItineraryItemPayload) =>
      fetch<ItineraryItem>(makeApiUrl("itinerary-items"), {
        method: "POST",
        data: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itineraryItems.all })
    },
  })
}

export const useRemoveItineraryItem = (itineraryItemId?: string | number) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetch<unknown>(makeApiUrl("itinerary-items", itineraryItemId), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.itineraryItems.detail(itineraryItemId ?? ""),
      })
    },
  })
}

export const useUpdateItineraryItemPosition = (
  itineraryItemId?: string | number,
) => {
  const fetch = useApiFetch()

  return useMutation({
    mutationFn: (payload: { position: number }) =>
      fetch<ItineraryItem>(makeApiUrl("itinerary-items", itineraryItemId), {
        method: "PATCH",
        data: payload,
      }),
  })
}
