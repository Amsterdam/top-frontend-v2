import { useQuery } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { queryKeys } from "@/api/queryKeys"

/**
 * Hardcoded until this endpoint is merged into the standard API (VITE_API_URL) -
 * it currently lives on a separate puntenteller backend.
 */
const PUNTENTELLER_API_URL = "http://localhost:8080/api/v1"

export const useAddressInvoerwaarden = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.puntenteller.invoerwaarden(bagId ?? ""),
    queryFn: () =>
      fetch<PuntentellerInvoerwaarden>(
        `${PUNTENTELLER_API_URL}/puntenteller/adressen/${bagId}/invoerwaarden`,
      ),
    enabled: Boolean(bagId),
  })
}
