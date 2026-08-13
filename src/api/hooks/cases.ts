import { useQuery } from "@tanstack/react-query"
import { useApiFetch } from "@/api/useApiFetch"
import { makeApiUrl } from "@/api/utils/makeApiUrl"
import { stringifyQueryParams } from "@/api/utils/stringifyQueryParams"
import { queryKeys } from "@/api/queryKeys"

export const useCasesSearch = (
  addressSearch: string,
  themeName?: string,
  options?: { lazy?: boolean },
) => {
  const fetch = useApiFetch()
  const queryString = stringifyQueryParams({
    theme_name: themeName,
    address_search: addressSearch,
  })

  return useQuery({
    queryKey: queryKeys.cases.search(addressSearch, themeName),
    queryFn: () => fetch<Case[]>(makeApiUrl("search-v2", queryString)),
    enabled: !(options?.lazy ?? false),
  })
}

export const useCase = (caseId?: number) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.cases.detail(caseId ?? -1),
    queryFn: () => fetch<Case>(makeApiUrl("cases", caseId)),
    enabled: Boolean(caseId),
  })
}

export const useCaseEvents = (caseId?: number) => {
  const fetch = useApiFetch()

  return useQuery({
    queryKey: queryKeys.cases.events(caseId ?? -1),
    queryFn: () => fetch<CaseEvent[]>(makeApiUrl("cases", caseId, "events")),
    enabled: Boolean(caseId),
    meta: { globalErrorToast: false },
  })
}
