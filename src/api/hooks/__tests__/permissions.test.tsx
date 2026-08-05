import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

const mockFetch = vi.fn()

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

describe("usePermissions", () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it("fetches permissions from the permissions endpoint", async () => {
    mockFetch.mockResolvedValue({ permissions: ["planner.manage_settings"] })

    const { usePermissions } = await import("../permissions")
    const { result } = renderHook(() => usePermissions(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("/permissions"))
    expect(result.current.data).toEqual(["planner.manage_settings"])
  })
})