import { useMemo } from "react"
import type { ApiOptions } from "../types/apiOptions"
import useApi from "../useApi"
import { makeApiUrl } from "../utils/makeApiUrl"

type HousingCorporation = components["schemas"]["HousingCorporation"]

export const useCorporations = (options?: ApiOptions) => {
  return useApi<HousingCorporation[]>({
    ...options,
    url: makeApiUrl("addresses", "housing-corporations"),
  })
}

export function useCorporationName(corporationId?: number | null) {
  const [corporations] = useCorporations()

  return useMemo(() => {
    if (!corporationId) return undefined

    return corporations?.find((c) => c.id === corporationId)?.name
  }, [corporationId, corporations])
}
