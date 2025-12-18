import { useItineraries } from "@/api/hooks"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"

export const useRedirectItinerary = () => {
  const navigate = useNavigate()
  const { itineraryId } = useParams()
  const [data] = useItineraries()

  useEffect(() => {
    const itineraries = data?.itineraries
    if (!itineraries || itineraryId) {
      return
    }

    if (itineraries.length === 0) {
      navigate("/lijst-instellingen")
      return
    }

    if (itineraries.length === 1) {
      navigate(`/lijst/${itineraries[0].id}`)
      return
    }

    navigate("/kies-looplijst")
  }, [data, itineraryId, navigate])
}
