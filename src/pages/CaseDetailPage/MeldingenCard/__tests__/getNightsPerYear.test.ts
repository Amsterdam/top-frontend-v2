import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getNightsPerYear } from "../getNightsPerYear"

function melding(
  startDatum: string,
  eindDatum: string,
  nachten: number,
): Melding {
  return {
    startDatum,
    eindDatum,
    nachten,
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

  it("includes empty query years, newest first, even without meldingen", () => {
    expect(getNightsPerYear([])).toEqual([
      [2026, 0],
      [2025, 0],
    ])
    expect(getNightsPerYear([], "2025-01-01")).toEqual([
      [2026, 0],
      [2025, 0],
    ])
    expect(getNightsPerYear([], "2026-01-01")).toEqual([[2026, 0]])
  })

  it("sums active stays and does not count deleted meldingen", () => {
    expect(
      getNightsPerYear(
        [
          melding("2026-05-01", "2026-05-04", 3),
          { ...melding("2026-06-01", "2026-06-03", 2), isVerwijderd: true },
          { ...melding("2026-07-01", "2026-07-05", 4), isAangepast: true },
        ],
        "2025-01-01",
      ),
    ).toEqual([
      [2026, 7],
      [2025, 0],
    ])
  })

  it("splits a stay across calendar years, excluding the departure date", () => {
    expect(
      getNightsPerYear([melding("2025-12-30", "2026-01-03", 4)], "2025-01-01"),
    ).toEqual([
      [2026, 2],
      [2025, 2],
    ])
  })

  it("does not count a departure on January 1 in the new year", () => {
    expect(
      getNightsPerYear([melding("2025-12-30", "2026-01-01", 2)], "2025-01-01"),
    ).toEqual([
      [2026, 0],
      [2025, 2],
    ])
  })

  it("handles multiple years and leap years", () => {
    expect(
      getNightsPerYear(
        [melding("2023-12-31", "2026-01-02", 733)],
        "2023-01-01",
      ),
    ).toEqual([
      [2026, 1],
      [2025, 365],
      [2024, 366],
      [2023, 1],
    ])
  })

  it("clips stays at the query start and omits earlier years", () => {
    expect(
      getNightsPerYear(
        [
          melding("2024-12-29", "2025-01-04", 6),
          melding("2024-05-01", "2024-05-05", 4),
        ],
        "2025-01-02",
      ),
    ).toEqual([
      [2026, 0],
      [2025, 2],
    ])
  })

  it("includes future nights but ignores future nights from deleted meldingen", () => {
    expect(
      getNightsPerYear(
        [
          melding("2028-12-30", "2029-01-01", 2),
          {
            ...melding("2030-12-30", "2031-01-01", 2),
            isVerwijderd: true,
          },
        ],
        "2025-01-01",
      ),
    ).toEqual([
      [2028, 2],
      [2026, 0],
      [2025, 0],
    ])
  })

  it("has no query years before a future query start when there are no stays", () => {
    expect(getNightsPerYear([], "2028-01-01")).toEqual([])
  })

  it("does not include years after the last active night", () => {
    expect(
      getNightsPerYear([melding("2028-12-30", "2029-01-01", 2)], "2025-01-01"),
    ).toEqual([
      [2028, 2],
      [2026, 0],
      [2025, 0],
    ])
  })

  it("counts calendar nights rather than elapsed hours around daylight saving", () => {
    expect(
      getNightsPerYear(
        [
          melding("2026-03-28T15:00:00+01:00", "2026-03-30T10:00:00+02:00", 2),
          melding("2026-10-24T15:00:00+02:00", "2026-10-26T10:00:00+01:00", 2),
        ],
        "2026-01-01",
      ),
    ).toEqual([[2026, 4]])
  })

  it("counts no nights for departure on the arrival date", () => {
    expect(
      getNightsPerYear([melding("2026-05-01", "2026-05-01", 0)], "2026-01-01"),
    ).toEqual([[2026, 0]])
  })

  it("uses the reported nights rather than the departure date", () => {
    expect(
      getNightsPerYear([melding("2025-12-30", "2026-01-10", 3)], "2025-01-01"),
    ).toEqual([
      [2026, 1],
      [2025, 2],
    ])
  })

  it("does not use or validate the departure date for counting nights", () => {
    for (const endDate of ["invalid", "2026-04-01"]) {
      expect(
        getNightsPerYear([melding("2026-05-01", endDate, 2)], "2026-01-01"),
      ).toEqual([[2026, 2]])
    }
  })

  it("rejects invalid query and arrival dates", () => {
    expect(() => getNightsPerYear([], "invalid")).toThrow(
      "Ongeldige begindatum",
    )
    expect(() =>
      getNightsPerYear([melding("invalid", "2026-05-04", 3)], "2025-01-01"),
    ).toThrow("Ongeldige begindatum")
  })

  it("does not validate deleted periods because they are excluded from totals", () => {
    expect(
      getNightsPerYear(
        [{ ...melding("invalid", "invalid", 3), isVerwijderd: true }],
        "2025-01-01",
      ),
    ).toEqual([
      [2026, 0],
      [2025, 0],
    ])
  })
})
