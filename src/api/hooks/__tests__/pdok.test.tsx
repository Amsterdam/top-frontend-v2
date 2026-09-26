import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { queryKeys } from "../../queryKeys"
import { useBagPdokAddress } from "../pdok"

const mockFetch = vi.fn()

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

const pdokResponse = (docs: Partial<BAGPdokAddress>[]) => ({
  ok: true,
  json: async () => ({ response: { numFound: docs.length, docs } }),
})

describe("useBagPdokAddress", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    mockFetch.mockReset()
  })

  it("fetches the hoofdadres of the bagId from PDOK's /free endpoint", async () => {
    mockFetch.mockResolvedValue(
      pdokResponse([{ weergavenaam: "Aalsmeerplein 1-H, 1059AS Amsterdam" }]),
    )

    const { result } = renderHook(() => useBagPdokAddress("0363010000980959"), {
      wrapper: createWrapper(createQueryClient()),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.weergavenaam).toBe(
      "Aalsmeerplein 1-H, 1059AS Amsterdam",
    )
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toMatch(/\/free$/)
    expect(url.searchParams.get("fq")).toBe(
      "adresseerbaarobject_id:0363010000980959 AND (type:adres) AND (adrestype: hoofdadres)",
    )
    expect(url.searchParams.get("rows")).toBe("1")
  })

  it("gives null when PDOK doesn't know the bagId", async () => {
    mockFetch.mockResolvedValue(pdokResponse([]))

    const { result } = renderHook(() => useBagPdokAddress("onbekend"), {
      wrapper: createWrapper(createQueryClient()),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeNull()
  })

  it("doesn't fetch an address that's in the cache already, e.g. picked in the search", () => {
    const queryClient = createQueryClient()
    const address = { weergavenaam: "Tjasker 59, 1035CS Amsterdam" }
    queryClient.setQueryData(
      queryKeys.pdok.address("0363010000828554"),
      address,
    )

    const { result } = renderHook(() => useBagPdokAddress("0363010000828554"), {
      wrapper: createWrapper(queryClient),
    })

    expect(result.current.data).toBe(address)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("doesn't fetch without a bagId", () => {
    renderHook(() => useBagPdokAddress(undefined), {
      wrapper: createWrapper(createQueryClient()),
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })
})
