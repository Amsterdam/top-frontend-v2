import { renderHook } from "@testing-library/react"
import { vi, describe, it, expect, beforeEach } from "vitest"
import { useRedirectFromState } from "../useRedirectFromState"
import * as router from "react-router"

// Mock useNavigate
const mockNavigate = vi.fn()
vi.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate)

describe("useRedirectFromState", () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockReset()

    // Mock window.location
    const url = "http://localhost/"
    Object.defineProperty(window, "location", {
      value: new URL(url),
      writable: true,
    })

    // Mock window.history.replaceState
    vi.spyOn(window.history, "replaceState")
  })

  it("redirects to the decoded URL if state is present", () => {
    const originalUrl = "/dashboard?foo=bar"
    const encodedState = `abc;${encodeURIComponent(originalUrl)}`

    Object.defineProperty(window, "location", {
      value: new URL(`http://localhost/?state=${encodedState}`),
      writable: true,
    })

    renderHook(() => useRedirectFromState())

    expect(window.history.replaceState).toHaveBeenCalledWith(
      {},
      document.title,
      "/",
    )
    expect(mockNavigate).toHaveBeenCalledWith(originalUrl)
  })

  it("does nothing if state is not present", () => {
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/"),
      writable: true,
    })

    renderHook(() => useRedirectFromState())

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
