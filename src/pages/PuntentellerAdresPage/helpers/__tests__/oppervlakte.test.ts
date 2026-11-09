import { describe, expect, it } from "vitest"
import { multiply, sumVlakken, vlakOppervlakteErrors } from "../oppervlakte"

const vlak = (oppervlakte: number | null): Vlak => ({
  lengte: null,
  breedte: null,
  oppervlakte,
})

describe("multiply", () => {
  it("multiplies lengte and breedte, rounded to cm²", () => {
    expect(multiply(5, 4)).toBe(20)
    expect(multiply("1.111", "1")).toBe(1.11)
  })

  it("is null while either is missing", () => {
    expect(multiply(5, null)).toBeNull()
    expect(multiply("", 4)).toBeNull()
  })
})

describe("sumVlakken", () => {
  it("adds up the oppervlakte of every row", () => {
    expect(sumVlakken([vlak(20), vlak(3)])).toBe(23)
  })

  it("skips a row without an oppervlakte and rounds the total to cm²", () => {
    expect(sumVlakken([vlak(1.111), vlak(null), vlak(1.111)])).toBe(2.22)
  })

  it("is null when no row has an oppervlakte", () => {
    expect(sumVlakken([vlak(null)])).toBeNull()
    expect(sumVlakken([])).toBeNull()
    expect(sumVlakken(undefined)).toBeNull()
  })
})

describe("vlakOppervlakteErrors", () => {
  it("flattens the rows' oppervlakte errors to their input names", () => {
    const error = { type: "required", message: "Vul de oppervlakte in." }
    expect(
      vlakOppervlakteErrors("binnenruimtes", 2, [
        undefined,
        { oppervlakte: error },
      ]),
    ).toEqual({ "binnenruimtes.2.vlakken.1.oppervlakte": error })
  })
})
