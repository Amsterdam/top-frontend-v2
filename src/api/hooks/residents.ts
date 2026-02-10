import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import type { ApiOptions } from "../types/apiOptions"
import type { Resident } from "@/pages/CaseDetailPage/BRPCard/types"

type ResidentsResponse = {
  personen: Resident[]
}

export const useResidents = (bagId?: string, options?: ApiOptions) =>
  useApi<ResidentsResponse>({
    url: makeApiUrl("addresses", bagId, "residents"),
    lazy: options?.lazy ?? !bagId,
  })
