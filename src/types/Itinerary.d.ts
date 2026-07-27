type ItineraryFromApi = components["schemas"]["Itinerary"]
type ItineraryItemFromApi = components["schemas"]["ItineraryItem"]
type CaseFromApi = ItineraryItemFromApi["case"]
type ItinerarySummaryFromApi = components["schemas"]["ItinerarySummary"]

type ItineraryItem = Omit<ItineraryItemFromApi, "case"> & {
  id: number
  position: number
  case: Case
}

type Itinerary = Omit<ItineraryFromApi, "items"> & {
  items: ItineraryItem[]
}

// team_members is typed as `string` in the generated schema, but the API
// actually returns a string[]; the OpenAPI schema is stale.
type ItinerarySummary = Omit<ItinerarySummaryFromApi, "team_members"> & {
  team_members: string[]
}
