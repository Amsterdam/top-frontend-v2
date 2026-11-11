import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"

/** GET /puntenteller/adressen/:bagId/invoerwaarden/: the known data of the address (BAG, WOZ, EP-Online). */
export const useAddressInvoerwaarden = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.puntenteller.invoerwaarden(bagId ?? ""),
    queryFn: () =>
      fetch<PuntentellerInvoerwaarden>(
        makeApiUrl("puntenteller", "adressen", bagId, "invoerwaarden"),
      ),
    enabled: Boolean(bagId),
  })
}

/** GET /puntenteller/adressen/:bagId/: the puntentellingen of the address, newest first. */
export const useAddressPuntentellingen = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
    queryFn: () =>
      fetch<Puntentelling[]>(makeApiUrl("puntenteller", "adressen", bagId)),
    enabled: Boolean(bagId),
  })
}

/** GET /puntenteller/puntentellingen/:id/: a whole puntentelling, to reopen it in the wizard. */
export const usePuntentelling = (id?: number) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.puntenteller.puntentelling(id ?? 0),
    queryFn: () =>
      fetch<PuntentellingDetail>(
        makeApiUrl("puntenteller", "puntentellingen", id),
      ),
    enabled: id !== undefined,
  })
}

type SavePuntentellingVariables = {
  /** The puntentelling to change; none to make a new one. */
  id?: number
  payload: GebruikersinvoerPayload
}

/**
 * Saves the gebruikersinvoer: a new puntentelling (POST), or changes to an existing one
 * (PATCH). The backend calculates the punten in the same request and returns the whole
 * puntentelling ("Sla op als concept en bereken" in the bijzonderheden- or resultaat-stap).
 */
export const useSavePuntentelling = (bagId?: string) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: SavePuntentellingVariables) =>
      id === undefined
        ? fetch<PuntentellingDetail>(
            makeApiUrl("puntenteller", "adressen", bagId),
            { method: "POST", data: payload },
          )
        : fetch<PuntentellingDetail>(
            makeApiUrl("puntenteller", "puntentellingen", id),
            { method: "PATCH", data: payload },
          ),
    onSuccess: (puntentelling) => {
      // Reopening it shows what was just saved, without waiting for a refetch.
      queryClient.setQueryData(
        queryKeys.puntenteller.puntentelling(puntentelling.id),
        puntentelling,
      )
      // The address's list of puntentellingen is refetched to include it. `exact` leaves the
      // invoerwaarden, which sit under the same address key, alone.
      return queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      })
    },
  })
}

/**
 * Makes a puntentelling definitief: PATCH /puntenteller/puntentellingen/:id/ with only
 * `completed`, so its invoer and berekening stay as they were saved.
 */
export const useMaakPuntentellingDefinitief = (bagId?: string) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      fetch<PuntentellingDetail>(
        makeApiUrl("puntenteller", "puntentellingen", id),
        { method: "PATCH", data: { completed: true } },
      ),
    onSuccess: (puntentelling) => {
      queryClient.setQueryData(
        queryKeys.puntenteller.puntentelling(puntentelling.id),
        puntentelling,
      )
      // The overview drops its Concept badge. `exact` leaves the invoerwaarden alone.
      return queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      })
    },
  })
}

/** DELETE /puntenteller/puntentellingen/:id/ */
export const useDeletePuntentelling = (bagId?: string) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      fetch<void>(makeApiUrl("puntenteller", "puntentellingen", id), {
        method: "DELETE",
      }),
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.puntenteller.puntentelling(id),
      })
      // `exact` leaves the invoerwaarden, which sit under the same address key, alone.
      return queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      })
    },
  })
}
