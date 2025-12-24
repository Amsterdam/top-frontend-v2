import { useItinerariesSummary } from "@/api/hooks"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"

export const useRedirectItinerary = () => {
  const navigate = useNavigate()
  const { itineraryId, themeId } = useParams()
  const [itineraries] = useItinerariesSummary()

  useEffect(() => {
    if (!itineraries || itineraryId) {
      return
    }

    if (itineraries.length === 1) {
      navigate(`/lijst/${itineraries[0].id}`)
      return
    }

    if (itineraries.length > 1) {
      navigate("/kies-looplijst")
    }

    if (themeId) {
      return
    }
    navigate("/lijst-instellingen")
  }, [itineraries, itineraryId, navigate, themeId])
}
