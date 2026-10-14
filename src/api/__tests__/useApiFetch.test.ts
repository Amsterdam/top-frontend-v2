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

const mockAuth = (accessToken?: string, expiresIn?: number) => {
  const auth = {
    user: accessToken
      ? { access_token: accessToken, expires_in: expiresIn }
      : undefined,
    signinSilent: vi.fn(),
    signinRedirect: vi.fn().mockResolvedValue(undefined),
  }
  vi.doMock("react-oidc-context", () => ({
    useAuth: () => auth,
  }))
  return auth
}

describe("useApiFetch", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
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

  it("renews an expiring token before sending the request", async () => {
    const auth = mockAuth("old-token", 10)
    auth.signinSilent.mockResolvedValue({ access_token: "new-token" })
    const fetchMock = vi.fn().mockResolvedValue(createResponse("null"))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await result.current("https://api.test/things")

    expect(auth.signinSilent).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer new-token",
    )
  })

  it("does not renew a token that is still valid", async () => {
    const auth = mockAuth("valid-token", 3600)
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(createResponse("null")))

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await result.current("https://api.test/things")

    expect(auth.signinSilent).not.toHaveBeenCalled()
  })

  it("renews once and retries when the API answers with a 403", async () => {
    const auth = mockAuth("rejected-token", 3600)
    auth.signinSilent.mockResolvedValue({ access_token: "new-token" })
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        createResponse("", { ok: false, status: 403, statusText: "Forbidden" }),
      )
      .mockResolvedValueOnce(createResponse(JSON.stringify({ hello: "world" })))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    const data = await result.current("https://api.test/things")

    expect(data).toEqual({ hello: "world" })
    expect(auth.signinSilent).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe(
      "Bearer new-token",
    )
  })

  it("throws the 403 when the retry is rejected as well", async () => {
    const auth = mockAuth("token", 3600)
    auth.signinSilent.mockResolvedValue({ access_token: "new-token" })
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        createResponse("", { ok: false, status: 403, statusText: "Forbidden" }),
      )
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await expect(result.current("https://api.test/things")).rejects.toEqual({
      status: 403,
      message: "Forbidden",
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("redirects to the login when renewing fails", async () => {
    const auth = mockAuth("old-token", 10)
    auth.signinSilent.mockRejectedValue(new Error("invalid_grant"))
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await expect(result.current("https://api.test/things")).rejects.toThrow(
      "invalid_grant",
    )
    expect(auth.signinRedirect).toHaveBeenCalledTimes(1)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("shares a single renewal between concurrent requests", async () => {
    const auth = mockAuth("old-token", 10)
    auth.signinSilent.mockResolvedValue({ access_token: "new-token" })
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(createResponse("null")))

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await Promise.all([
      result.current("https://api.test/a"),
      result.current("https://api.test/b"),
    ])

    expect(auth.signinSilent).toHaveBeenCalledTimes(1)
  })

  it("skips renewing while offline so cached responses can still be served", async () => {
    const auth = mockAuth("old-token", 10)
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false)
    const fetchMock = vi.fn().mockResolvedValue(createResponse("null"))
    vi.stubGlobal("fetch", fetchMock)

    const { useApiFetch } = await import("../useApiFetch")
    const { result } = renderHook(() => useApiFetch())

    await result.current("https://api.test/things")

    expect(auth.signinSilent).not.toHaveBeenCalled()
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer old-token",
    )
  })
})
