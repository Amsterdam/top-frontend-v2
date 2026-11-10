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

type SaveGebruikersinvoerOptions = {
  bagId?: string
}

/**
 * Saves the gebruikersinvoer as a new puntentelling; the backend calculates the punten in the
 * same request and returns the whole puntentelling ("Sla op en bereken" in the bijzonderheden-
 * or resultaat-stap).
 */
export const useSaveGebruikersinvoer = ({
  bagId,
}: SaveGebruikersinvoerOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GebruikersinvoerPayload) =>
      fetch<Puntentelling>(makeApiUrl("puntenteller", "adressen", bagId), {
        method: "POST",
        data: payload,
      }),
    // The address's list of puntentellingen is refetched to include the new one. `exact`
    // leaves the invoerwaarden, which sit under the same address key, alone.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      }),
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
    // `exact` leaves the invoerwaarden, which sit under the same address key, alone.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      }),
  })
}
