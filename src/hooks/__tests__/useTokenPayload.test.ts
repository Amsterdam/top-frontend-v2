import { describe, it, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"

describe("useTokenPayload", () => {
  it("returns undefined when no access token exists", async () => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.doMock("react-oidc-context", () => ({
      useAuth: () => ({
        user: undefined,
      }),
    }))

    vi.doMock("jwt-decode", () => ({
      jwtDecode: vi.fn(),
    }))

    const { useTokenPayload } = await import("@/hooks/useTokenPayload")
    const { result } = renderHook(() => useTokenPayload())

    expect(result.current).toBeUndefined()
  })

  it("decodes and returns the token payload", async () => {
    vi.resetModules()
    vi.clearAllMocks()

    const mockPayload = {
      given_name: "John",
      family_name: "Doe",
      name: "John Doe",
      unique_name: "john.doe",
    }

    vi.doMock("react-oidc-context", () => ({
      useAuth: () => ({
        user: {
          access_token: "mock.jwt.token",
        },
      }),
    }))

    vi.doMock("jwt-decode", () => ({
      jwtDecode: vi.fn(() => mockPayload),
    }))

    const { useTokenPayload } = await import("@/hooks/useTokenPayload")
    const { result } = renderHook(() => useTokenPayload())

    expect(result.current).toEqual(mockPayload)
  })
})
