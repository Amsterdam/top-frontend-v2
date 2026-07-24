import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useGeolocation } from "../useGeolocation"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("useGeolocation", () => {
  it("returns lat/lng once permission is granted", async () => {
    const getCurrentPosition = vi.fn((success) => {
      success({ coords: { latitude: 52.37, longitude: 4.89 } })
    })
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current).toEqual({
        lat: 52.37,
        lng: 4.89,
        isLoading: false,
      })
    })
  })

  it("returns no coordinates when permission is denied", async () => {
    const getCurrentPosition = vi.fn((_success, error) => {
      error({ message: "User denied Geolocation" })
    })
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current).toEqual({
        isLoading: false,
        error: "User denied Geolocation",
      })
    })
  })

  it("returns no coordinates when geolocation is not supported", async () => {
    vi.stubGlobal("navigator", {})

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current).toEqual({
        isLoading: false,
        error: "Geolocation is not supported",
      })
    })
  })
})
