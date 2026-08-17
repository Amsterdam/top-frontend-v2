import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"
import {
  applyQueuedVisitToCache,
  queueVisitCompletion,
  queueVisitSave,
  type MutationResult,
} from "@/offline/visitSync"

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

const shouldQueueMutation = (error: unknown) =>
  !window.navigator.onLine || error instanceof TypeError

const normalizeVisitId = (visitId?: string | number) => {
  if (visitId === undefined) return undefined

  const normalized = Number(visitId)
  return Number.isFinite(normalized) ? normalized : undefined
}

export const useSaveVisit = ({ visitId, itineraryId }: SaveVisitOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()
  const normalizedVisitId = normalizeVisitId(visitId)

  return useMutation({
    mutationFn: async (
      payload: VisitPayload,
    ): Promise<MutationResult<Visit>> => {
      if (normalizedVisitId !== undefined && normalizedVisitId < 0) {
        return {
          data: queueVisitSave({
            visitId: normalizedVisitId,
            itineraryId,
            payload,
          }),
          queued: true,
        }
      }

      try {
        const savedVisit = await fetch<Visit>(makeApiUrl("visits", visitId), {
          method: visitId ? "PUT" : "POST",
          data: payload,
        })

        return { data: savedVisit, queued: false }
      } catch (error) {
        if (!shouldQueueMutation(error)) throw error

        return {
          data: queueVisitSave({ visitId, itineraryId, payload }),
          queued: true,
        }
      }
    },
    onSuccess: ({ data: savedVisit, queued }) => {
      applyQueuedVisitToCache(itineraryId, savedVisit)

      if (!queued) {
        if (visitId) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.visits.detail(visitId),
          })
        } else {
          queryClient.invalidateQueries({ queryKey: queryKeys.visits.all })
        }
      }

      if (itineraryId) {
        queryClient.setQueryData(
          queryKeys.itineraries.detail(itineraryId),
          (current: Itinerary | undefined) =>
            upsertVisitInItinerary(current, savedVisit),
        )
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
  const normalizedVisitId = normalizeVisitId(visitId)

  return useMutation({
    mutationFn: async (payload: {
      completed: boolean
    }): Promise<MutationResult<Visit>> => {
      if (normalizedVisitId !== undefined && normalizedVisitId < 0) {
        return {
          data: queueVisitCompletion({
            visitId: normalizedVisitId,
            itineraryId,
            payload,
          }),
          queued: true,
        }
      }

      try {
        const savedVisit = await fetch<Visit>(makeApiUrl("visits", visitId), {
          method: "PATCH",
          data: payload,
        })

        return { data: savedVisit, queued: false }
      } catch (error) {
        if (!shouldQueueMutation(error)) throw error

        return {
          data: queueVisitCompletion({ visitId, itineraryId, payload }),
          queued: true,
        }
      }
    },
    onSuccess: ({ data: savedVisit, queued }) => {
      const visitToCache =
        savedVisit.itinerary_item || itineraryItemId === undefined
          ? savedVisit
          : { ...savedVisit, itinerary_item: itineraryItemId }

      applyQueuedVisitToCache(itineraryId, visitToCache)

      if (!queued) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.visits.detail(visitId ?? ""),
        })
      }
    },
  })
}
