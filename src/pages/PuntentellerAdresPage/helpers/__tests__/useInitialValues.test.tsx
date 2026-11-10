import type { ReactNode } from "react"
import { renderHook } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DUMMY_DATA } from "../../dummyData"
import { mapPuntentellingToFormValues } from "../mapPuntentellingToFormValues"
import { useInitialValues } from "../useInitialValues"

const mockIsAcceptanceOrLocalEnvironment = vi.fn()
const mockUsePuntentelling = vi.fn()

vi.mock("@/config/isAcceptanceOrLocalEnvironment", () => ({
  isAcceptanceOrLocalEnvironment: () => mockIsAcceptanceOrLocalEnvironment(),
}))

vi.mock("@/api/hooks", () => ({
  usePuntentelling: (id?: number) => mockUsePuntentelling(id),
}))

vi.mock("../mapPuntentellingToFormValues", () => ({
  mapPuntentellingToFormValues: vi.fn(() => ({ woz_waarde: 123456 })),
}))

const PUNTENTELLING = { id: 181 } as PuntentellingDetail

// The routes of the wizard, so useParams sees the puntentellingId.
const renderAt = (url: string) =>
  renderHook(() => useInitialValues(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/puntenteller/:bagId/nieuw" element={children} />
          <Route
            path="/puntenteller/:bagId/:puntentellingId"
            element={children}
          />
        </Routes>
      </MemoryRouter>
    ),
  })

describe("useInitialValues", () => {
  beforeEach(() => {
    mockIsAcceptanceOrLocalEnvironment.mockReturnValue(true)
    mockUsePuntentelling.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: false,
    })
  })

  it("returns the values of the saved puntentelling in the url", () => {
    mockUsePuntentelling.mockReturnValue({
      data: PUNTENTELLING,
      isPending: false,
      isError: false,
    })
    const { result } = renderAt("/puntenteller/abc123/181?dummydata=middenhuur")

    expect(mockUsePuntentelling).toHaveBeenCalledWith(181)
    expect(mapPuntentellingToFormValues).toHaveBeenCalledWith(PUNTENTELLING)
    // The saved puntentelling wins over the dummydata.
    expect(result.current).toEqual({
      values: { woz_waarde: 123456 },
      puntentelling: PUNTENTELLING,
      isPending: false,
      isError: false,
    })
  })

  it("waits for the saved puntentelling", () => {
    mockUsePuntentelling.mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    })
    const { result } = renderAt("/puntenteller/abc123/181")

    expect(result.current).toEqual(
      expect.objectContaining({ values: undefined, isPending: true }),
    )
  })

  it("says so when the saved puntentelling can't be fetched", () => {
    mockUsePuntentelling.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    })
    const { result } = renderAt("/puntenteller/abc123/181")

    expect(result.current).toEqual(
      expect.objectContaining({ values: undefined, isError: true }),
    )
  })

  it("fetches no puntentelling for a new one", () => {
    renderAt("/puntenteller/abc123/nieuw")

    expect(mockUsePuntentelling).toHaveBeenCalledWith(undefined)
  })

  it("returns the dummydata named in ?dummydata", () => {
    const { result } = renderAt(
      "/puntenteller/abc123/nieuw?dummydata=middenhuur",
    )

    expect(result.current).toEqual({
      values: DUMMY_DATA.middenhuur,
      isPending: false,
    })
  })

  it("returns no values without ?dummydata", () => {
    const { result } = renderAt("/puntenteller/abc123/nieuw")

    expect(result.current).toEqual({ isPending: false })
  })

  it("returns no values for an unknown naam", () => {
    const { result } = renderAt("/puntenteller/abc123/nieuw?dummydata=toString")

    expect(result.current).toEqual({ isPending: false })
  })

  it("ignores ?dummydata in PROD", () => {
    mockIsAcceptanceOrLocalEnvironment.mockReturnValue(false)
    const { result } = renderAt(
      "/puntenteller/abc123/nieuw?dummydata=middenhuur",
    )

    expect(result.current).toEqual({ isPending: false })
  })
})
