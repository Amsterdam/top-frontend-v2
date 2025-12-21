import { useItineraries } from "@/api/hooks"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"

export const useRedirectItinerary = () => {
  const navigate = useNavigate()
  const { itineraryId, themeId } = useParams()
  const [data] = useItineraries()

  useEffect(() => {
    const itineraries = data?.itineraries
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
  }, [data, itineraryId, navigate, themeId])
}
