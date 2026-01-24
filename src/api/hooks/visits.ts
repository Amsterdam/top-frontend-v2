import { useApi } from "@/api/useApi"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import type { ApiOptions } from "@/api/types/apiOptions"

export const useVisits = (options?: ApiOptions) =>
  useApi<Visit[], VisitPayload>({
    ...options,
    url: makeApiUrl("visits"),
  })

export const useVisit = (id?: string | number, options?: ApiOptions) =>
  useApi<Visit, VisitPayload>({
    ...options,
    url: makeApiUrl(`visits/${id}`),
    lazy: options?.lazy ?? !id,
  })
