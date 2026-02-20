import { useMemo } from "react"
import type { ApiOptions } from "../types/apiOptions"
import useApi from "../useApi"
import { makeApiUrl } from "../utils/makeApiUrl"
import { stringifyQueryParams } from "../utils/stringifyQueryParams"
import dayjs from "dayjs"

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

export const useRegistrations = (bagId?: string, options?: ApiOptions) =>
  useApi<Registration[]>({
    ...options,
    url: makeApiUrl("addresses", bagId, "registrations"),
    lazy: options?.lazy ?? !bagId,
  })

export const useMeldingen = (
  bagId?: string,
  startDate?: string,
  options?: ApiOptions,
) => {
  const params = {
    start_date:
      startDate || dayjs().subtract(1, "year").startOf("year").format(),
  }
  const queryString = stringifyQueryParams(params)
  return useApi<components["schemas"]["Meldingen"]>({
    ...options,
    url: makeApiUrl("addresses", bagId, "meldingen", queryString),
    lazy: options?.lazy ?? !bagId,
  })
}

export const usePermits = (bagId?: string, options?: ApiOptions) =>
  useApi<Permit[]>({
    ...options,
    url: makeApiUrl("addresses", bagId, "permits-powerbrowser"),
    lazy: options?.lazy ?? !bagId,
  })
