import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useApiFetch } from "@/api/useApiFetch"
import { queryKeys } from "@/api/queryKeys"
import { makeApiUrl } from "../utils/makeApiUrl"
import { stringifyQueryParams } from "../utils/stringifyQueryParams"

export const useCorporations = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.addresses.corporations,
    queryFn: () =>
      fetch<HousingCorporation[]>(
        makeApiUrl("addresses", "housing-corporations"),
      ),
  })
}

export function useCorporationName(corporationId?: number | null) {
  const { data: corporations } = useCorporations()

  return useMemo(() => {
    if (!corporationId) return undefined

    return corporations?.find((c) => c.id === corporationId)?.name
  }, [corporationId, corporations])
}

export const useDistricts = () => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.addresses.districts,
    queryFn: () => fetch<District[]>(makeApiUrl("addresses", "districts")),
  })
}

export const useRegistrations = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.addresses.registrations(bagId ?? ""),
    queryFn: () =>
      fetch<Registration[]>(makeApiUrl("addresses", bagId, "registrations")),
    enabled: Boolean(bagId),
    meta: { globalErrorAlert: false },
  })
}

export const useMeldingen = (bagId?: string, startDate?: string) => {
  const fetch = useApiFetch()
  const resolvedStartDate =
    startDate || dayjs().subtract(1, "year").startOf("year").format()
  const queryString = stringifyQueryParams({ start_date: resolvedStartDate })

  return useQuery({
    queryKey: queryKeys.addresses.meldingen(bagId ?? "", resolvedStartDate),
    queryFn: () =>
      fetch<components["schemas"]["Meldingen"]>(
        makeApiUrl("addresses", bagId, "meldingen", queryString),
      ),
    enabled: Boolean(bagId),
    meta: { globalErrorAlert: false },
  })
}

export const usePermits = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.addresses.permits(bagId ?? ""),
    queryFn: () =>
      fetch<Permit[]>(makeApiUrl("addresses", bagId, "permits-powerbrowser")),
    enabled: Boolean(bagId),
    meta: { globalErrorAlert: false },
  })
}

export const usePermitsDecos = (bagId?: string) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.addresses.permitsDecos(bagId ?? ""),
    queryFn: () =>
      fetch<PermitDecos[]>(makeApiUrl("addresses", bagId, "decos")),
    enabled: Boolean(bagId),
    meta: { globalErrorAlert: false },
  })
}
