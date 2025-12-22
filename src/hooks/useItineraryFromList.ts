import { useItineraries } from "@/api/hooks"

export const useItineraryFromList = (itineraryId?: string) => {
  const [data] = useItineraries()
  const id = itineraryId ? Number(itineraryId) : undefined

  return data?.itineraries.find((itinerary) => itinerary.id === id)
}
