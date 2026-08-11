import { useItinerariesSummary } from "@/api/hooks"
import { ItineraryListItemVariant, SearchAddressView } from "@/components"

export function SearchPage() {
  const { data: itineraries } = useItinerariesSummary()
  const itinerary = itineraries?.[0]

  const description = itinerary
    ? `Toevoegen aan looplijst "${itinerary.theme} – ${itinerary.day_settings_name} - ${itinerary.team_members.map((member) => member).join(", ")}". Alleen zaken van dit thema kunnen worden toegevoegd.`
    : undefined

  return (
    <SearchAddressView
      title="Zoeken"
      subTitle="Bekijk een adres"
      description={description}
      variant={ItineraryListItemVariant.AddToItinerary}
    />
  )
}

export default SearchPage
