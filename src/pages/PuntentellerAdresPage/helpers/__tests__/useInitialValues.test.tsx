import type { ReactNode } from "react"
import { renderHook } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DUMMY_DATA } from "../../dummyData"
import { useInitialValues } from "../useInitialValues"

const mockIsAcceptanceOrLocalEnvironment = vi.fn()

vi.mock("@/config/isAcceptanceOrLocalEnvironment", () => ({
  isAcceptanceOrLocalEnvironment: () => mockIsAcceptanceOrLocalEnvironment(),
}))

const renderAt = (url: string) =>
  renderHook(() => useInitialValues(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  })

describe("useInitialValues", () => {
  beforeEach(() => {
    mockIsAcceptanceOrLocalEnvironment.mockReturnValue(true)
  })

  it("returns the dummydata named in ?dummydata", () => {
    const { result } = renderAt("/puntenteller/abc123?dummydata=middenhuur")

    expect(result.current).toEqual({
      values: DUMMY_DATA.middenhuur,
      isPending: false,
    })
  })

  it("returns no values without ?dummydata", () => {
    const { result } = renderAt("/puntenteller/abc123")

    expect(result.current).toEqual({ isPending: false })
  })

  it("returns no values for an unknown naam", () => {
    const { result } = renderAt("/puntenteller/abc123?dummydata=toString")

    expect(result.current).toEqual({ isPending: false })
  })

  it("ignores ?dummydata in PROD", () => {
    mockIsAcceptanceOrLocalEnvironment.mockReturnValue(false)
    const { result } = renderAt("/puntenteller/abc123?dummydata=middenhuur")

    expect(result.current).toEqual({ isPending: false })
  })
})
