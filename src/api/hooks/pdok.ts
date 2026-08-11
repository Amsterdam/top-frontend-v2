import { useQuery } from "@tanstack/react-query"
import { stringifyQueryParams } from "@/api/utils/stringifyQueryParams"
import { queryKeys } from "@/api/queryKeys"

/**
 * PDOK is a public, unauthenticated government API (not our own backend),
 * so this bypasses useApiFetch and its bearer token entirely.
 *
 * Difference between /free and /suggest endpoint is the speed and the search criteria:
 * /suggest is faster but you cannot search on bagId.
 */

const PDOK_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1"
const MUNICIPALITY_FILTER = "gemeentenaam:(amsterdam)"
const ADDRESS_FILTER = "AND (type:adres) AND (adrestype: hoofdadres)"
const DEFAULT_SORT = "score desc, weergavenaam asc"
const FIELD_LIST =
  "weergavenaam,adrestype,gemeentenaam,nummeraanduiding_id,adresseerbaarobject_id,straatnaam,huisnummer,huisletter,huisnummertoevoeging,postcode,woonplaatsnaam,centroide_ll,score"
const START = 0
export const RESULTS_PER_PAGE = 10

const getBagPdok = async (searchString: string): Promise<BAGPdokResponse> => {
  const queryString = stringifyQueryParams({
    q: searchString,
    fq: `${MUNICIPALITY_FILTER}${ADDRESS_FILTER}`,
    fl: FIELD_LIST,
    start: START,
    rows: RESULTS_PER_PAGE,
    sort: DEFAULT_SORT,
  })

  const response = await fetch(`${PDOK_URL}/suggest${queryString}`)

  if (!response.ok) {
    throw new Error(`PDOK-aanvraag mislukt: ${response.status}`)
  }

  return response.json()
}

export const useBagPdokSearch = (
  searchString: string,
  options?: { lazy?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.pdok.search(searchString),
    queryFn: () => getBagPdok(searchString),
    enabled: !(options?.lazy ?? false),
  })
}
