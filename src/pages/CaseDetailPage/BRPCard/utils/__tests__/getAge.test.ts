import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Resident } from "../../types"
import { getAge } from "../getAge"
import { getVisibleResidentsSortedByAge } from "../getVisibleResidentsSortedByAge"

const bornOn = (datum: string): Resident => ({
  geboorte: { datum: { type: "Datum", datum } },
})

describe("the age of a resident", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-11-25T12:00:00"))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("is the age from the BRP", () => {
    expect(getAge({ ...bornOn("2001-12-11"), leeftijd: 30 })).toBe(30)
  })

  it("is worked out from the date of birth when the BRP has no age", () => {
    // Turns 25 in two weeks: still 24.
    expect(getAge(bornOn("2001-12-11"))).toBe(24)
  })

  it("is unknown when only the year of birth is known, or someone died", () => {
    expect(
      getAge({ geboorte: { datum: { type: "JaarDatum", jaar: 2001 } } }),
    ).toBeUndefined()
    expect(
      getAge({ ...bornOn("2001-12-11"), overlijden: { datum: {} } }),
    ).toBeUndefined()
    expect(getAge({})).toBeUndefined()
  })

  it("sorts the residents oldest first, also without an age from the BRP", () => {
    const unknown: Resident = {}
    const young = { ...bornOn("2010-01-01") }
    const old = { leeftijd: 60 }
    const middle = { ...bornOn("1990-01-01") }

    expect(
      getVisibleResidentsSortedByAge([unknown, young, old, middle]),
    ).toEqual([old, middle, young, unknown])
  })
})
