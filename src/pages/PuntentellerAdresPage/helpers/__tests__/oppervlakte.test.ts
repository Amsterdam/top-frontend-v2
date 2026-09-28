import { describe, expect, it } from "vitest"
import { formatM2, formatMeters, sumOppervlakte } from "../oppervlakte"

describe("sumOppervlakte", () => {
  it("adds up the oppervlakte of all rooms", () => {
    expect(sumOppervlakte([{ oppervlakte: 12.5 }, { oppervlakte: 7.25 }])).toBe(
      19.75,
    )
  })

  it("skips rooms without a (valid) oppervlakte", () => {
    expect(
      sumOppervlakte([
        { oppervlakte: 10 },
        { oppervlakte: null },
        { oppervlakte: Number.NaN },
      ]),
    ).toBe(10)
  })

  it("counts an oppervlakte typed into the input, which arrives as a string", () => {
    expect(
      sumOppervlakte([
        { oppervlakte: "12.5" },
        { oppervlakte: 7 },
        { oppervlakte: "" },
      ]),
    ).toBe(19.5)
  })

  it("rounds away floating point noise", () => {
    expect(sumOppervlakte([{ oppervlakte: 0.1 }, { oppervlakte: 0.2 }])).toBe(
      0.3,
    )
  })

  it("is 0 without rooms", () => {
    expect(sumOppervlakte([])).toBe(0)
  })
})

describe("formatM2 / formatMeters", () => {
  it("formats with a Dutch decimal comma", () => {
    expect(formatM2(12.5)).toBe("12,5 m²")
    expect(formatMeters(3.25)).toBe("3,25 m")
  })

  it("returns null without a (valid) number", () => {
    expect(formatM2(null)).toBeNull()
    expect(formatMeters(Number.NaN)).toBeNull()
  })
})
