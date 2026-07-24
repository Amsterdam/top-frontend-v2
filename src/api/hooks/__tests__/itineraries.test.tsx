import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

const mockFetch = vi.fn().mockResolvedValue({ cases: [] })

vi.mock("@/api/useApiFetch", () => ({
  useApiFetch: () => mockFetch,
}))

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useItinerarySuggestions", () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it("fetches suggestions without a query string when no location is given", async () => {
    const { useItinerarySuggestions } = await import("../itineraries")
    renderHook(() => useItinerarySuggestions("1"), { wrapper })

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("/itineraries/1/suggestions")
    expect(url).not.toContain("?")
  })

  it("includes lat/lng as query params when a valid location is given", async () => {
    const { useItinerarySuggestions } = await import("../itineraries")
    renderHook(() => useItinerarySuggestions("1", { lat: 52.37, lng: 4.89 }), {
      wrapper,
    })

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("lat=52.37")
    expect(url).toContain("lng=4.89")
  })

  it.each([
    { lat: 52.37, lng: undefined },
    { lat: undefined, lng: 4.89 },
    { lat: 200, lng: 4.89 },
    { lat: 52.37, lng: -200 },
  ])("omits the query string for an invalid location %o", async (location) => {
    const { useItinerarySuggestions } = await import("../itineraries")
    renderHook(() => useItinerarySuggestions("1", location), { wrapper })

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    expect(mockFetch.mock.calls[0][0]).not.toContain("?")
  })
})
