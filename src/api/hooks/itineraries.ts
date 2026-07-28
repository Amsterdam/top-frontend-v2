import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { stringifyQueryParams } from "@/api/utils/stringifyQueryParams"
import { queryKeys } from "@/api/queryKeys"

type SuggestionsResponse = {
  cases: Case[]
}

export type Coordinates = {
  lat?: number
  lng?: number
}

export const isValidCoordinates = (
  location?: Coordinates,
): location is Required<Coordinates> =>
  typeof location?.lat === "number" &&
  typeof location?.lng === "number" &&
  Number.isFinite(location.lat) &&
  Number.isFinite(location.lng) &&
  location.lat >= -90 &&
  location.lat <= 90 &&
  location.lng >= -180 &&
  location.lng <= 180

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
  position: number
  case: Case
}

export const useItinerariesSummary = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.itineraries.summary(),
    queryFn: () =>
      fetch<ItinerarySummary[]>(makeApiUrl("itineraries", "summary")),
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

export const useItinerarySuggestions = (
  itineraryId?: string,
  location?: Coordinates,
) => {
  const fetch = useApiFetch()
  const hasLocation = isValidCoordinates(location)
  const queryString = hasLocation
    ? stringifyQueryParams({ lat: location.lat, lng: location.lng })
    : ""

  return useQuery({
    queryKey: queryKeys.itineraries.suggestions(
      itineraryId ?? "",
      hasLocation ? location.lat : undefined,
      hasLocation ? location.lng : undefined,
    ),
    queryFn: () =>
      fetch<SuggestionsResponse>(
        makeApiUrl("itineraries", itineraryId, "suggestions") + queryString,
      ),
    enabled: Boolean(itineraryId),
  })
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
      // Purge rather than invalidate: the itinerary is gone, so a
      // background refetch would just 404. This also covers the nested
      // suggestions query since it shares the detail key as a prefix.
      queryClient.removeQueries({
        queryKey: queryKeys.itineraries.detail(itineraryId ?? ""),
      })
      // Update synchronously rather than invalidate: useRedirectItinerary
      // reads this cache on every navigation, and an invalidate-triggered
      // background refetch leaves a window where the deleted itinerary is
      // still the only entry, causing it to navigate straight back into it.
      queryClient.setQueryData(
        queryKeys.itineraries.summary(),
        (current?: ItinerarySummary[]) =>
          current?.filter((itinerary) => itinerary.id !== Number(itineraryId)),
      )
    },
  })
}

export const useChangeTeamMembers = (itineraryId?: string) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { team_members: TeamMemberPayload[] }) =>
      fetch<{ team_members: components["schemas"]["ItineraryTeamMember"][] }>(
        makeApiUrl("itineraries", itineraryId, "team"),
        { method: "PUT", data: payload },
      ),
    onSuccess: (resp) => {
      queryClient.setQueryData(
        queryKeys.itineraries.detail(itineraryId ?? ""),
        (current: Itinerary | undefined) => {
          if (!current || !resp?.team_members) return current
          return { ...current, team_members: resp.team_members }
        },
      )
    },
  })
}

export const useCreateItineraryItem = () => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    // The create endpoint embeds case as the raw { id, data } shape, not the
    // flat Case shape the rest of the app expects, so the response's case is
    // ignored and the item is rebuilt from the case we already have.
    mutationFn: (payload: AddItineraryItemPayload) =>
      fetch<{ id: number }>(makeApiUrl("itinerary-items"), {
        method: "POST",
        data: {
          id: payload.id,
          itinerary: payload.itinerary,
          position: payload.position,
        },
      }),
    onSuccess: (response, variables) => {
      const newItem: ItineraryItem = {
        id: response.id,
        position: variables.position,
        notes: [],
        visits: [],
        case: variables.case,
      }

      queryClient.setQueryData(
        queryKeys.itineraries.detail(String(variables.itinerary)),
        (current: Itinerary | undefined) => {
          if (!current) return current
          return { ...current, items: [...current.items, newItem] }
        },
      )
    },
  })
}

type RemoveItineraryItemOptions = {
  itineraryId?: string
  itineraryItemId?: string | number
}

export const useRemoveItineraryItem = ({
  itineraryId,
  itineraryItemId,
}: RemoveItineraryItemOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetch<unknown>(makeApiUrl("itinerary-items", itineraryItemId), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.setQueryData(
        queryKeys.itineraries.detail(itineraryId ?? ""),
        (current: Itinerary | undefined) => {
          if (!current) return current
          return {
            ...current,
            items: current.items.filter((item) => item.id !== itineraryItemId),
          }
        },
      )
    },
  })
}

type UpdateItineraryItemPositionOptions = {
  itineraryId?: string
  itineraryItemId?: string | number
}

export const useUpdateItineraryItemPosition = ({
  itineraryId,
  itineraryItemId,
}: UpdateItineraryItemPositionOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { position: number }) =>
      fetch<ItineraryItem>(makeApiUrl("itinerary-items", itineraryItemId), {
        method: "PATCH",
        data: payload,
      }),
    onMutate: (payload) => {
      const queryKey = queryKeys.itineraries.detail(itineraryId ?? "")
      const previousItinerary = queryClient.getQueryData<Itinerary>(queryKey)

      queryClient.setQueryData(queryKey, (current: Itinerary | undefined) => {
        if (!current) return current

        const next = structuredClone(current)
        const item = next.items.find((i) => i.id === itineraryItemId)
        if (item) item.position = payload.position
        return next
      })

      return { queryKey, previousItinerary }
    },
    onError: (_error, _payload, context) => {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousItinerary)
      }
    },
  })
}
