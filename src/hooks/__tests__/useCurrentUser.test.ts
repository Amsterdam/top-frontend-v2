import { describe, it, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"

describe("useCurrentUser", () => {
  it("returns the matching user based on token payload", async () => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.doMock("@/hooks/useTokenPayload", () => ({
      useTokenPayload: () => ({
        unique_name: "JOHN",
      }),
    }))

    vi.doMock("@/api/hooks", () => ({
      useUsers: () => ({
        data: {
          results: [
            { id: "1", username: "john", name: "John Doe" },
            { id: "2", username: "jane", name: "Jane Doe" },
          ],
        },
      }),
    }))

    const { useCurrentUser } = await import("@/hooks/useCurrentUser")
    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toEqual({
      id: "1",
      username: "john",
      name: "John Doe",
    })
  })

  it("returns undefined when no user matches", async () => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.doMock("@/hooks/useTokenPayload", () => ({
      useTokenPayload: () => ({
        unique_name: "unknown",
      }),
    }))

    vi.doMock("@/api/hooks", () => ({
      useUsers: () => ({
        data: {
          results: [
            { id: "1", username: "john", name: "John Doe" },
            { id: "2", username: "jane", name: "Jane Doe" },
          ],
        },
      }),
    }))

    const { useCurrentUser } = await import("@/hooks/useCurrentUser")
    const { result } = renderHook(() => useCurrentUser())

    expect(result.current).toBeUndefined()
  })
})
