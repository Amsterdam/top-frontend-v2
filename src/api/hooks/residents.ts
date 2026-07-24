import { useQuery } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { queryKeys } from "@/api/queryKeys"
import type { Resident } from "@/pages/CaseDetailPage/BRPCard/types"

type ResidentsResponse = {
  personen: Resident[]
}

export const useResidents = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.addresses.residents(bagId ?? ""),
    queryFn: () =>
      fetch<ResidentsResponse>(makeApiUrl("addresses", bagId, "residents")),
    enabled: Boolean(bagId),
  })
}
