import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useItinerariesSummary } from "@/api/hooks"
import { AmsterdamCrossSpinner } from "@/components"

export function IndexRedirectPage() {
  const navigate = useNavigate()
  const { data: itineraries, isError } = useItinerariesSummary()

  useEffect(() => {
    if (!itineraries) {
      if (isError && !window.navigator.onLine) {
        navigate("/lijst-instellingen")
      }
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
  }, [isError, itineraries, navigate])

  return <AmsterdamCrossSpinner />
}

export default IndexRedirectPage
