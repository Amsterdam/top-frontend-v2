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
