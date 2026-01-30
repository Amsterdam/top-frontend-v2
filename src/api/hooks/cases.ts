import type { ApiOptions } from "../types/apiOptions"
import useApi from "../useApi"
import { makeApiUrl } from "../utils/makeApiUrl"
import { stringifyQueryParams } from "../utils/stringifyQueryParams"

export const useCasesSearch = (
  addressSearch: string,
  themeName?: string,
  options?: ApiOptions,
) => {
  const params = {
    theme_name: themeName,
    address_search: addressSearch,
  }

  const queryString = stringifyQueryParams(params)

  return useApi<Case[]>({
    ...options,
    url: makeApiUrl("search-v2", queryString),
  })
}

export const useCase = (caseId?: number, options?: ApiOptions) => {
  return useApi<Case>({
    ...options,
    url: makeApiUrl("cases", caseId),
    lazy: options?.lazy ?? !caseId,
  })
}

export const useCaseEvents = (caseId?: number, options?: ApiOptions) => {
  return useApi<CaseEvent[]>({
    ...options,
    url: makeApiUrl("cases", caseId, "events"),
    lazy: options?.lazy ?? !caseId,
  })
}
