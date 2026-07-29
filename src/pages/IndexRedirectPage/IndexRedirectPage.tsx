import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useItinerariesSummary } from "@/api/hooks"
import { AmsterdamCrossSpinner } from "@/components"

export function IndexRedirectPage() {
  const navigate = useNavigate()
  const { data: itineraries } = useItinerariesSummary()

  useEffect(() => {
    if (!itineraries) return

    if (itineraries.length === 1) {
      navigate(`/lijst/${itineraries[0].id}`)
      return
    }

    if (itineraries.length > 1) {
      navigate("/kies-looplijst")
      return
    }

    navigate("/lijst-instellingen")
  }, [itineraries, navigate])

  return <AmsterdamCrossSpinner />
}

export default IndexRedirectPage
