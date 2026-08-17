import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"

const createResponse = (
  body: string,
  init: { ok?: boolean; status?: number; statusText?: string } = {},
) => ({
  ok: init.ok ?? true,
  status: init.status ?? 200,
  statusText: init.statusText ?? "OK",
  text: () => Promise.resolve(body),
})

const mockAuth = (accessToken?: string) => {
  vi.doMock("react-oidc-context", () => ({
    useAuth: () => ({
      user: accessToken ? { access_token: accessToken } : undefined,
    }),
  }))
}

describe("useApiFetch", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("sends a GET request without an Authorization header when there is no token", async () => {
    mockAuth(undefined)
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createResponse(JSON.stringify({ hello: "world" })))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    const data = await result.current<{ hello: string }>(
      "https://api.test/things",
    )

    expect(data).toEqual({ hello: "world" })
    expect(fetchMock).toHaveBeenCalledWith("https://api.test/things", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: undefined,
    })
  })

  it("attaches a Bearer Authorization header when a token is present", async () => {
    mockAuth("mock-token")
    const fetchMock = vi.fn().mockResolvedValue(createResponse("null"))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await result.current("https://api.test/things")

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/things",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token",
        },
      }),
    )
  })

  it("JSON-stringifies the data payload for mutating requests", async () => {
    mockAuth(undefined)
    const fetchMock = vi.fn().mockResolvedValue(createResponse("null"))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await result.current("https://api.test/things", {
      method: "POST",
      data: { name: "test" },
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/things",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      }),
    )
  })

  it("skips mutating requests and throws immediately when offline", async () => {
    mockAuth(undefined)
    const fetchMock = vi.fn().mockResolvedValue(createResponse("null"))
    vi.stubGlobal("fetch", fetchMock)
    vi.stubGlobal("navigator", { onLine: false })

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await expect(
      result.current("https://api.test/things", {
        method: "PATCH",
        data: { done: true },
      }),
    ).rejects.toBeInstanceOf(TypeError)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("still attempts GET requests when offline so cached responses can be served", async () => {
    mockAuth(undefined)
    const fetchMock = vi
      .fn()
      .mockResolvedValue(createResponse(JSON.stringify({ hello: "offline" })))
    vi.stubGlobal("fetch", fetchMock)
    vi.stubGlobal("navigator", { onLine: false })

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    const data = await result.current<{ hello: string }>(
      "https://api.test/things",
    )

    expect(data).toEqual({ hello: "offline" })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("throws an ApiError built from the JSON error body on a non-ok response", async () => {
    mockAuth(undefined)
    const fetchMock = vi.fn().mockResolvedValue(
      createResponse(JSON.stringify({ message: "Not found", title: "Oops" }), {
        ok: false,
        status: 404,
        statusText: "Not Found",
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await expect(result.current("https://api.test/things")).rejects.toEqual({
      status: 404,
      message: "Not found",
      title: "Oops",
    })
  })

  it("uses a plain-text error body as the message when it isn't JSON", async () => {
    mockAuth(undefined)
    const fetchMock = vi.fn().mockResolvedValue(
      createResponse("Something went wrong at the edge", {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await expect(result.current("https://api.test/things")).rejects.toEqual({
      status: 500,
      message: "Something went wrong at the edge",
    })
  })

  it("falls back to statusText when the error response has no body", async () => {
    mockAuth(undefined)
    const fetchMock = vi.fn().mockResolvedValue(
      createResponse("", {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    )
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await expect(result.current("https://api.test/things")).rejects.toEqual({
      status: 500,
      message: "Internal Server Error",
    })
  })

  it("returns null for an empty successful response body", async () => {
    mockAuth(undefined)
    const fetchMock = vi.fn().mockResolvedValue(createResponse(""))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    const data = await result.current("https://api.test/things")

    expect(data).toBeNull()
  })
})
