type ItineraryFromApi = components["schemas"]["Itinerary"]
type ItineraryItemFromApi = components["schemas"]["ItineraryItem"]
type CaseFromApi = ItineraryItemFromApi["case"]

type ItineraryItem = Omit<ItineraryItemFromApi, "case"> & {
  id: number
  position: number
  case?: {
    data: Case
  }
}

type Itinerary = Omit<ItineraryFromApi, "items"> & {
  items: ItineraryItem[]
}
