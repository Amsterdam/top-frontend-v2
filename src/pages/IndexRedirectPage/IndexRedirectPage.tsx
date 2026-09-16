import { useEffect } from "react"
import { useNavigate } from "react-router"
import { RefreshIcon } from "@amsterdam/design-system-react-icons"
import { useItinerariesSummary } from "@/api/hooks"
import { AmsterdamCrossSpinner, ErrorState } from "@/components"

export function IndexRedirectPage() {
  const navigate = useNavigate()
  const { data: itineraries, isError, refetch } = useItinerariesSummary()
  const isOnline = typeof navigator === "undefined" || navigator.onLine

  useEffect(() => {
    if (!itineraries) {
      if (isError && !isOnline) {
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
  }, [isError, isOnline, itineraries, navigate])

  if (isError && !itineraries && isOnline) {
    return (
      <ErrorState
        title="Looplijsten konden niet worden geladen"
        description="Er is iets misgegaan bij het controleren of je al een looplijst hebt. Probeer het later opnieuw."
        actionLabel="Opnieuw proberen"
        actionIcon={RefreshIcon}
        onAction={() => refetch()}
      />
    )
  }

  return <AmsterdamCrossSpinner />
}

export default IndexRedirectPage
