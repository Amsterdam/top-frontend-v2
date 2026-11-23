import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getNightsPerYear } from "../getNightsPerYear"

function melding(startDatum: string, eindDatum: string): Melding {
  return {
    startDatum,
    eindDatum,
    nachten: 0,
    gasten: 2,
    gemaaktOp: startDatum,
    isAangepast: false,
    isVerwijderd: false,
  }
}

describe("getNightsPerYear", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 20))
  })

  afterEach(() => vi.useRealTimers())

  it("includes empty query years, oldest first, even without meldingen", () => {
    expect(getNightsPerYear([])).toEqual([
      [2025, 0],
      [2026, 0],
    ])
    expect(getNightsPerYear([], "2025-01-01")).toEqual([
      [2025, 0],
      [2026, 0],
    ])
    expect(getNightsPerYear([], "2026-01-01")).toEqual([
      [2026, 0],
    ])
  })

  it("sums stays and keeps counting changed and deleted meldingen", () => {
    expect(
      getNightsPerYear(
        [
          melding("2026-05-01", "2026-05-04"),
          { ...melding("2026-06-01", "2026-06-03"), isVerwijderd: true },
          { ...melding("2026-07-01", "2026-07-05"), isAangepast: true },
        ],
        "2025-01-01",
      ),
    ).toEqual([
      [2025, 0],
      [2026, 9],
    ])
  })

  it("splits a stay across calendar years, excluding the departure date", () => {
    expect(
      getNightsPerYear([melding("2025-12-30", "2026-01-03")], "2025-01-01"),
    ).toEqual([
      [2025, 2],
      [2026, 2],
    ])
  })

  it("does not count a departure on January 1 in the new year", () => {
    expect(
      getNightsPerYear([melding("2025-12-30", "2026-01-01")], "2025-01-01"),
    ).toEqual([
      [2025, 2],
      [2026, 0],
    ])
  })

  it("handles multiple years and leap years", () => {
    expect(
      getNightsPerYear([melding("2023-12-31", "2026-01-02")], "2023-01-01"),
    ).toEqual([
      [2023, 1],
      [2024, 366],
      [2025, 365],
      [2026, 1],
    ])
  })

  it("clips stays at the query start and omits earlier years", () => {
    expect(
      getNightsPerYear(
        [
          melding("2024-12-29", "2025-01-04"),
          melding("2024-05-01", "2024-05-05"),
        ],
        "2025-01-02",
      ),
    ).toEqual([
      [2025, 2],
      [2026, 0],
    ])
  })

  it("does not include years later than the current year", () => {
    expect(
      getNightsPerYear([melding("2028-12-30", "2029-01-01")], "2025-01-01"),
    ).toEqual([
      [2025, 0],
      [2026, 0],
    ])
  })

  it("counts calendar nights rather than elapsed hours around daylight saving", () => {
    expect(
      getNightsPerYear(
        [
          melding("2026-03-28T15:00:00+01:00", "2026-03-30T10:00:00+02:00"),
          melding("2026-10-24T15:00:00+02:00", "2026-10-26T10:00:00+01:00"),
        ],
        "2026-01-01",
      ),
    ).toEqual([[2026, 4]])
  })

  it("counts no nights for departure on the arrival date", () => {
    expect(
      getNightsPerYear([melding("2026-05-01", "2026-05-01")], "2026-01-01"),
    ).toEqual([[2026, 0]])
  })

  it("rejects invalid query dates and stay periods", () => {
    expect(() => getNightsPerYear([], "invalid")).toThrow(
      "Ongeldige begindatum",
    )
    for (const period of [
      melding("invalid", "2026-05-04"),
      melding("2026-05-01", "invalid"),
      melding("2026-05-04", "2026-05-01"),
    ]) {
      expect(() => getNightsPerYear([period], "2025-01-01")).toThrow(
        "Ongeldige verblijfsperiode",
      )
    }
  })
})
