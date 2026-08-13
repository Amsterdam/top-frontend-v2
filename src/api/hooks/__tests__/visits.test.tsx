import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { queryKeys } from "../../queryKeys"

const mockFetch = vi.fn()

vi.mock("@/api/useApiFetch", () => ({
  useApiFetch: () => mockFetch,
}))

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

const createWrapper = (queryClient: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

const createItinerary = (visits: unknown[] = []) => ({
  items: [
    {
      id: 123,
      visits,
    },
  ],
})

describe("useSaveVisit", () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it("adds a newly created visit to the cached itinerary item", async () => {
    const savedVisit = {
      id: 456,
      itinerary_item: 123,
      completed: false,
      case_id: "6711",
      start_time: "2026-08-13T11:02:00Z",
    }

    mockFetch.mockResolvedValue(savedVisit)

    const queryClient = createQueryClient()
    queryClient.setQueryData(
      queryKeys.itineraries.detail("978"),
      createItinerary(),
    )

    const { useSaveVisit } = await import("../visits")
    const { result } = renderHook(() => useSaveVisit({ itineraryId: "978" }), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.mutateAsync({} as never)
    })

    const updatedItinerary = queryClient.getQueryData(
      queryKeys.itineraries.detail("978"),
    ) as { items: Array<{ visits: unknown[] }> } | undefined

    expect(updatedItinerary?.items[0].visits).toEqual([savedVisit])
  })

  it("replaces an existing cached visit when editing a visit", async () => {
    const existingVisit = {
      id: 456,
      itinerary_item: 123,
      completed: false,
      case_id: "6711",
      start_time: "2026-08-13T11:02:00Z",
    }

    const savedVisit = {
      ...existingVisit,
      completed: true,
      description: "Warm onthaal",
    }

    mockFetch.mockResolvedValue(savedVisit)

    const queryClient = createQueryClient()
    queryClient.setQueryData(
      queryKeys.itineraries.detail("978"),
      createItinerary([existingVisit]),
    )

    const { useSaveVisit } = await import("../visits")
    const { result } = renderHook(
      () => useSaveVisit({ itineraryId: "978", visitId: savedVisit.id }),
      {
        wrapper: createWrapper(queryClient),
      },
    )

    await act(async () => {
      await result.current.mutateAsync({} as never)
    })

    const updatedItinerary = queryClient.getQueryData(
      queryKeys.itineraries.detail("978"),
    ) as { items: Array<{ visits: unknown[] }> } | undefined

    expect(updatedItinerary?.items[0].visits).toEqual([savedVisit])
  })
})
