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
    expect(screen.getByText("2026: 0 nachten")).toBeDefined()
    expect(screen.getByText("2025: 0 nachten")).toBeDefined()
    expect(screen.getByText("Geen meldingen gevonden.")).toBeDefined()
  })

  it("shows yearly totals alongside the existing melding table", () => {
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
    expect(screen.getByText("2026: 2 nachten")).toBeDefined()
    expect(screen.getByText("2025: 2 nachten")).toBeDefined()
    expect(screen.getByRole("table")).toBeDefined()
    expect(screen.getAllByText("Verwijderd")).toHaveLength(2)
  })

  it("does not show zero totals while loading or when fetching fails", () => {
    const { rerender } = render(
      <MeldingenCard startDate="2025-01-01" loading />,
    )
    expect(screen.queryByText("2026: 0 nachten")).toBeNull()
    expect(screen.getByRole("status")).toBeDefined()

    rerender(<MeldingenCard startDate="2025-01-01" isError />)
    expect(screen.queryByText("2026: 0 nachten")).toBeNull()
    expect(
      screen.getByText("Meldingen konden niet worden opgehaald."),
    ).toBeDefined()
  })
})
