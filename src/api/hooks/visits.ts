import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

export const useVisits = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.visits.all,
    queryFn: () => fetch<Visit[]>(makeApiUrl("visits")),
  })
}

export const useVisit = (
  id?: string | number,
  options?: { enabled?: boolean },
) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.visits.detail(id ?? ""),
    queryFn: () => fetch<Visit>(makeApiUrl("visits", id)),
    enabled: options?.enabled ?? Boolean(id),
  })
}

export const useCaseVisits = (caseId?: number) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.cases.visits(caseId ?? -1),
    queryFn: () => fetch<Visit[]>(makeApiUrl("cases", caseId, "visits")),
    enabled: Boolean(caseId),
  })
}

type SaveVisitOptions = {
  visitId?: string | number
  itineraryId?: string
}

const upsertVisitInItinerary = (
  current: Itinerary | undefined,
  visit: Visit,
) => {
  if (!current || !visit.itinerary_item) return current

  return {
    ...current,
    items: current.items.map((item) => {
      if (item.id !== visit.itinerary_item) return item

      const hasVisit = item.visits.some(
        (existingVisit) => existingVisit.id === visit.id,
      )

      return {
        ...item,
        visits: hasVisit
          ? item.visits.map((existingVisit) =>
              existingVisit.id === visit.id ? visit : existingVisit,
            )
          : [...item.visits, visit],
      }
    }),
  }
}

const setVisitDetailCache = (
  queryClient: QueryClient,
  visit: Visit,
  requestedVisitId?: string | number,
) => {
  queryClient.setQueryData(queryKeys.visits.detail(visit.id), visit)

  if (requestedVisitId !== undefined && requestedVisitId !== visit.id) {
    queryClient.setQueryData(queryKeys.visits.detail(requestedVisitId), visit)
  }
}

const updateVisitCaches = (
  queryClient: QueryClient,
  itineraryId: string | undefined,
  visit: Visit,
  requestedVisitId?: string | number,
) => {
  setVisitDetailCache(queryClient, visit, requestedVisitId)

  if (!itineraryId) return

  queryClient.setQueryData(
    queryKeys.itineraries.detail(itineraryId),
    (current: Itinerary | undefined) => upsertVisitInItinerary(current, visit),
  )
}

export const useSaveVisit = ({ visitId, itineraryId }: SaveVisitOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VisitPayload) =>
      fetch<Visit>(makeApiUrl("visits", visitId), {
        method: visitId ? "PUT" : "POST",
        data: payload,
      }),
    onSuccess: (savedVisit) => {
      updateVisitCaches(queryClient, itineraryId, savedVisit, visitId)

      if (visitId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.visits.detail(visitId),
        })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.visits.all })
      }
    },
  })
}

type CompleteVisitOptions = {
  visitId?: string | number
  itineraryId?: string
  itineraryItemId?: number
}

export const useCompleteVisit = ({
  visitId,
  itineraryId,
  itineraryItemId,
}: CompleteVisitOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { completed: boolean }) => {
      if (visitId === undefined) {
        throw new Error("Cannot complete a visit without a visit id.")
      }

      return fetch<Visit>(makeApiUrl("visits", visitId), {
        method: "PATCH",
        data: payload,
      })
    },
    onSuccess: (savedVisit) => {
      const visitToCache =
        savedVisit.itinerary_item || itineraryItemId === undefined
          ? savedVisit
          : { ...savedVisit, itinerary_item: itineraryItemId }

      updateVisitCaches(queryClient, itineraryId, visitToCache, visitId)
      queryClient.invalidateQueries({
        queryKey: queryKeys.visits.detail(visitId ?? visitToCache.id),
      })
    },
  })
}
