import { useNavigate } from "react-router"

export const useRedirectItinerary = () => {
  const navigate = useNavigate()

  const redirectItinerary = (
    itineraries?: Record<string, string>[],
    itineraryId?: string,
  ) => {
    if (!itineraries) {
      return
    }

    if (itineraries.length === 0) {
      navigate("/lijst-instellingen")
    }

    if (itineraries.length === 1) {
      navigate(`/lijst/${itineraries[0].id.toString()}`)
    }

    if (itineraries.length > 1 && !itineraryId) {
      navigate("/kies-looplijst")
    }
  }

  return { redirectItinerary }
}
