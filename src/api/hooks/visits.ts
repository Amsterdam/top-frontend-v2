import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

export const useSaveVisit = ({ visitId, itineraryId }: SaveVisitOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VisitPayload) =>
      fetch<Visit>(makeApiUrl("visits", visitId), {
        method: visitId ? "PUT" : "POST",
        data: payload,
      }),
    onSuccess: () => {
      if (visitId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.visits.detail(visitId),
        })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.visits.all })
      }

      if (itineraryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.itineraries.detail(itineraryId),
        })
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
    mutationFn: (payload: { completed: boolean }) =>
      fetch<Visit>(makeApiUrl("visits", visitId), {
        method: "PATCH",
        data: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.visits.detail(visitId ?? ""),
      })

      queryClient.setQueryData(
        queryKeys.itineraries.detail(itineraryId ?? ""),
        (current: Itinerary | undefined) => {
          if (!current) return current
          return {
            ...current,
            items: current.items.map((item) =>
              item.id === itineraryItemId
                ? {
                    ...item,
                    visits: item.visits.map((visit) =>
                      visit.id === visitId
                        ? { ...visit, completed: true }
                        : visit,
                    ),
                  }
                : item,
            ),
          }
        },
      )
    },
  })
}
