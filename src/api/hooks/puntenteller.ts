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

type SaveGebruikersinvoerOptions = {
  bagId?: string
}

/**
 * Saves the gebruikersinvoer; the backend calculates the punten in the same request and only
 * returns the resultaat ("Sla op en bereken" in the overzicht-stap).
 */
export const useSaveGebruikersinvoer = ({
  bagId,
}: SaveGebruikersinvoerOptions) => {
  const fetch = useApiFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GebruikersinvoerPayload) =>
      fetch<PuntentellerResultaat>(
        makeApiUrl("puntenteller", "adressen", bagId),
        { method: "POST", data: payload },
      ),
    // The response is only the berekening (the resultaat-stap reads it from the mutation), so
    // the address's list of gebruikersinvoer is refetched to include the new one. `exact`
    // leaves the invoerwaarden, which sit under the same address key, alone.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.puntenteller.adres(bagId ?? ""),
        exact: true,
      }),
  })
}
