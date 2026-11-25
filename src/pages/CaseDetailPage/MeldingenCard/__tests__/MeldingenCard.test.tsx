import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import MeldingenCard from "../MeldingenCard"

describe("MeldingenCard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 20))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it("shows a title without a count and zero totals when no meldingen exist", () => {
    render(<MeldingenCard startDate="2025-01-01" />)

    expect(screen.getByRole("heading", { name: "Meldingen" })).toBeDefined()
    expect(screen.getByText("0 nachten in 2026")).toBeDefined()
    expect(screen.getByText("0 nachten in 2025")).toBeDefined()
    expect(screen.getByText("Geen meldingen gevonden.")).toBeDefined()
  })

  it("excludes deleted meldingen from yearly totals but keeps them in the table", () => {
    render(
      <MeldingenCard
        startDate="2025-01-01"
        meldingen={[
          {
            startDatum: "2025-12-30",
            eindDatum: "2026-01-03",
            nachten: 4,
            gasten: 2,
            gemaaktOp: "2025-12-01",
            isAangepast: false,
            isVerwijderd: true,
          },
        ]}
      />,
    )

    expect(screen.getByRole("heading", { name: "Meldingen" })).toBeDefined()
    expect(screen.getByText("0 nachten in 2026")).toBeDefined()
    expect(screen.getByText("0 nachten in 2025")).toBeDefined()
    expect(screen.getByRole("table")).toBeDefined()
    expect(screen.getAllByText("Verwijderd")).toHaveLength(2)
  })

  it("shows future yearly totals based on reported nights", () => {
    render(
      <MeldingenCard
        startDate="2025-01-01"
        meldingen={[
          {
            startDatum: "2026-12-30",
            eindDatum: "2027-01-10",
            nachten: 3,
            gasten: 2,
            gemaaktOp: "2026-11-01",
            isAangepast: false,
            isVerwijderd: false,
          },
        ]}
      />,
    )

    expect(screen.getByText("1 nacht in 2027")).toBeDefined()
    expect(screen.getByText("2 nachten in 2026")).toBeDefined()
    expect(screen.getByText("0 nachten in 2025")).toBeDefined()
    expect(screen.getByRole("table")).toBeDefined()
  })

  it("does not show zero totals while loading or when fetching fails", () => {
    const { rerender } = render(
      <MeldingenCard startDate="2025-01-01" loading />,
    )
    expect(screen.queryByText("0 nachten in 2026")).toBeNull()
    expect(screen.getByRole("status")).toBeDefined()

    rerender(<MeldingenCard startDate="2025-01-01" isError />)
    expect(screen.queryByText("0 nachten in 2026")).toBeNull()
    expect(
      screen.getByText("Meldingen konden niet worden opgehaald."),
    ).toBeDefined()
  })
})
