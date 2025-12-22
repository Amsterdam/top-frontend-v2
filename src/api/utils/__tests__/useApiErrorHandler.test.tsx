import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useApiErrorHandler } from "../useApiErrorHandler"
import type { ApiError } from "@/api/types/apiError"
import * as ReactRouter from "react-router"
import * as AlertHook from "@/components/alerts/useAlert"

describe("useApiErrorHandler", () => {
  const navigateMock = vi.fn()
  const showAlertMock = vi.fn()
  const dismissAlertMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(ReactRouter, "useNavigate").mockReturnValue(navigateMock)
    vi.spyOn(AlertHook, "useAlert").mockReturnValue({
      showAlert: showAlertMock,
      dismissAlert: dismissAlertMock,
    })
  })

  it("should show alert and navigate to /login on 401", () => {
    const { result } = renderHook(() => useApiErrorHandler())
    result.current({ status: 401 } as ApiError)

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("uitgelogd") }),
    )
    expect(navigateMock).toHaveBeenCalledWith("/login")
  })

  it("should show alert on 403 without navigation", () => {
    const { result } = renderHook(() => useApiErrorHandler())
    result.current({ status: 403 } as ApiError)

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("Toegang") }),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it("should show alert on 404 without navigation", () => {
    const { result } = renderHook(() => useApiErrorHandler())
    result.current({ status: 404 } as ApiError)

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Niet gevonden"),
      }),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it("should show default alert and navigate to /error on unknown status", () => {
    const { result } = renderHook(() => useApiErrorHandler())
    result.current({ status: 500 } as ApiError)

    expect(showAlertMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("Oeps") }),
    )
    expect(navigateMock).toHaveBeenCalledWith("/error")
  })
})
