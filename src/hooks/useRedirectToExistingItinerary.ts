import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useItinerariesSummary } from "@/api/hooks"

/**
 * Redirects the user away from the "create a new looplijst" flow if they
 * already have one (or more) looplijsten. Without this, opening (or
 * refreshing) a URL like `/looplijsten/nieuw/:themeId` directly skips the
 * check that `IndexRedirectPage` normally does on `/`, letting the user
 * start creating a duplicate looplijst.
 *
 * Mirrors the branching in `IndexRedirectPage`: a single existing looplijst
 * sends the user straight to it, multiple send them to the overview.
 *
 * Call this in a page that's part of the "create new" flow. While
 * `isPending` or `hasExistingItinerary` is true, render a spinner instead of
 * the page content to avoid a flash of the create form.
 */
export const useRedirectToExistingItinerary = () => {
  const navigate = useNavigate()
  const { data: itineraries, isPending } = useItinerariesSummary()

  useEffect(() => {
    if (!itineraries || itineraries.length === 0) return

    if (itineraries.length === 1) {
      navigate(`/looplijsten/${itineraries[0].id}`, { replace: true })
    } else {
      navigate("/looplijsten", { replace: true })
    }
  }, [itineraries, navigate])

  return {
    isPending,
    hasExistingItinerary: Boolean(itineraries?.length),
  }
}

export default useRedirectToExistingItinerary
