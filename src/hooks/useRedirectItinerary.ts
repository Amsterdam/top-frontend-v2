import { useEffect } from "react"
import { useItinerariesSummary } from "@/api/hooks"
import { useNavigate, useParams, useLocation } from "react-router"

export const useRedirectItinerary = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { itineraryId, themeId, caseId } = useParams()
  const [itineraries] = useItinerariesSummary()

  useEffect(() => {
    // Exceptions for certain paths
    if (
      location.pathname.startsWith("/team-settings") ||
      themeId ||
      caseId ||
      itineraryId ||
      !itineraries
    ) {
      return
    }

    if (itineraries.length === 1) {
      navigate(`/lijst/${itineraries[0].id}`)
      return
    }

    if (itineraries.length > 1) {
      navigate("/kies-looplijst")
      return
    }

    navigate("/lijst-instellingen")
  }, [itineraries, itineraryId, navigate, themeId, caseId, location.pathname])
}
