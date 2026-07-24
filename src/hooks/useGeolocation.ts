import { useEffect, useState } from "react"

type GeolocationState = {
  lat?: number
  lng?: number
  isLoading: boolean
  error?: string
}

/**
 * Asks the browser for the user's current position. Permission may be
 * denied, unsupported, or simply not answered yet, so callers must treat
 * lat/lng as optional and keep working without them.
 */
export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>(() =>
    "geolocation" in navigator
      ? { isLoading: true }
      : { isLoading: false, error: "Geolocation is not supported" },
  )

  useEffect(() => {
    if (!("geolocation" in navigator)) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isLoading: false,
        })
      },
      (error) => {
        setState({ isLoading: false, error: error.message })
      },
    )
  }, [])

  return state
}
