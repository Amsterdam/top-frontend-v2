import { ItineraryListItemVariant, SearchAddressView } from "@/components"

export function SearchPage() {
  return (
    <SearchAddressView
      title="Zoek adressen"
      variant={ItineraryListItemVariant.AddToItinerary}
    />
  )
}

export default SearchPage
