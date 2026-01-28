import { useItinerariesSummary } from "@/api/hooks"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"

export const useRedirectItinerary = () => {
  const navigate = useNavigate()
  const { itineraryId, themeId, caseId } = useParams()
  const [itineraries] = useItinerariesSummary()

  useEffect(() => {
    // If ID's are present, do not redirect
    if (themeId) {
      return
    }
    if (caseId) {
      return
    }

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

    navigate("/lijst-instellingen")
  }, [itineraries, itineraryId, navigate, themeId, caseId])
}
