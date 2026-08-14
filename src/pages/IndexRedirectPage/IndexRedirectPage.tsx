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
        navigate("/looplijsten/nieuw")
      }
      return
    }

    if (itineraries.length === 1) {
      navigate(`/looplijsten/${itineraries[0].id}`)
      return
    }

    if (itineraries.length > 1) {
      navigate("/looplijsten")
      return
    }

    navigate("/looplijsten/nieuw")
  }, [isError, itineraries, navigate])

  return <AmsterdamCrossSpinner />
}

export default IndexRedirectPage
