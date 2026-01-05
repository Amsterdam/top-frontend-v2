import type { ApiOptions } from "../types/apiOptions"
import useApi from "../useApi"
import { makeApiUrl } from "../utils/makeApiUrl"
import { stringifyQueryParams } from "../utils/stringifyQueryParams"

export const useAddressSearch = (
  streetNumber: number,
  postalCode?: string,
  streetName?: string,
  suffix?: string,
  themeId?: string,
  options?: ApiOptions,
) => {
  // Remove all spaces from postal code to match format requested by API.
  // Trim streetName and suffix to forgive a user typing accidental spaces.
  const params = {
    postalCode: postalCode?.replace(/\s+/g, ""),
    streetName: streetName?.trim(),
    streetNumber,
    suffix: suffix?.trim(),
    theme: themeId,
  }

  const queryString = stringifyQueryParams(params)

  return useApi<{ cases: Case[] }>({
    ...options,
    url: makeApiUrl("search", queryString),
  })
}
