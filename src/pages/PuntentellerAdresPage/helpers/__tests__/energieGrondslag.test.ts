import { describe, expect, it } from "vitest"
import { parseEnergieIndex, selectEnergieGrondslag } from "../energieGrondslag"

const energie = (
  overrides: Partial<PuntentellerEnergie> = {},
): PuntentellerEnergie => ({
  energielabel: "C",
  energieindex: null,
  registratiedatum: null,
  opnamedatum: "2021-03-01",
  meting_geldig_tot: "2031-03-01",
  ...overrides,
})

const TODAY = "2025-06-15"

describe("parseEnergieIndex", () => {
  it("reads the decimal comma EP-Online uses", () => {
    expect(parseEnergieIndex("1,13")).toBe(1.13)
    expect(parseEnergieIndex("2")).toBe(2)
  })

  it("gives null when there's no (valid) number", () => {
    expect(parseEnergieIndex(null)).toBeNull()
    expect(parseEnergieIndex(undefined)).toBeNull()
    expect(parseEnergieIndex("")).toBeNull()
    expect(parseEnergieIndex("onbekend")).toBeNull()
  })
})

describe("selectEnergieGrondslag", () => {
  it("uses the energie-index of the EP-Online response while it's valid", () => {
    const response = {
      energielabel: "C",
      energieindex: "1,13",
      registratiedatum: "2016-09-13",
      opnamedatum: "2016-09-01",
      meting_geldig_tot: "2026-09-01",
    }
    expect(selectEnergieGrondslag(response, "2026-09-01")).toEqual({
      type: "index",
      energieindex: 1.13,
    })
    expect(selectEnergieGrondslag(response, "2026-09-26")).toEqual({
      type: "bouwjaar",
      reason: "expired",
    })
  })

  it("uses the bouwjaar when EP-Online has neither a label nor an index", () => {
    const noData = { type: "bouwjaar", reason: "no_data" }
    expect(selectEnergieGrondslag(null, TODAY)).toEqual(noData)
    expect(selectEnergieGrondslag(undefined, TODAY)).toEqual(noData)
    expect(
      selectEnergieGrondslag(energie({ energielabel: null }), TODAY),
    ).toEqual(noData)
  })

  it.each([
    ["before 1 January 2015", "2014-12-31"],
    ["on 1 January 2021", "2021-01-01"],
    ["after 1 January 2021", "2023-05-10"],
  ])("uses an energielabel opgenomen %s", (_, opnamedatum) => {
    expect(selectEnergieGrondslag(energie({ opnamedatum }), TODAY)).toEqual({
      type: "label",
      energielabel: "C",
    })
  })

  it.each([
    ["on 1 January 2015", "2015-01-01"],
    ["on 31 December 2020", "2020-12-31"],
  ])("uses the bouwjaar for an energielabel opgenomen %s", (_, opnamedatum) => {
    expect(selectEnergieGrondslag(energie({ opnamedatum }), TODAY)).toEqual({
      type: "bouwjaar",
      reason: "label_2015_2021",
    })
  })

  it("uses the bouwjaar when it's unknown when the energielabel was opgenomen", () => {
    expect(
      selectEnergieGrondslag(energie({ opnamedatum: null }), TODAY),
    ).toEqual({ type: "bouwjaar", reason: "unknown_opnamedatum" })
  })

  it("uses the energie-index whenever there is one, also next to a label", () => {
    expect(
      selectEnergieGrondslag(
        energie({ energieindex: "1,45", opnamedatum: "2016-09-01" }),
        TODAY,
      ),
    ).toEqual({ type: "index", energieindex: 1.45 })
    expect(
      selectEnergieGrondslag(
        energie({ energielabel: null, energieindex: "0", opnamedatum: null }),
        TODAY,
      ),
    ).toEqual({ type: "index", energieindex: 0 })
  })

  it("uses the bouwjaar once meting_geldig_tot has passed, whatever the label or index", () => {
    const expired = { type: "bouwjaar", reason: "expired" }
    expect(
      selectEnergieGrondslag(
        energie({ meting_geldig_tot: "2025-06-14" }),
        TODAY,
      ),
    ).toEqual(expired)
    expect(
      selectEnergieGrondslag(
        energie({ energieindex: "1,45", meting_geldig_tot: "2025-06-14" }),
        TODAY,
      ),
    ).toEqual(expired)
  })

  it("still counts the measurement on the day of meting_geldig_tot", () => {
    expect(
      selectEnergieGrondslag(energie({ meting_geldig_tot: TODAY }), TODAY),
    ).toEqual({ type: "label", energielabel: "C" })
  })
})
