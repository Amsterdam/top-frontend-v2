import { describe, expect, it } from "vitest"
import dayjs from "dayjs"
import type { Resident, ResidentDatum } from "../../types"
import { filterDeceasedResidents } from "../filterDeceasedResidents"
import { getResidentPersonalDetails } from "../getResidentPersonalDetails"
import { formatResidentDatum, toIsoDate } from "../residentDatum"

const datum: ResidentDatum = {
  type: "Datum",
  datum: "1990-03-04",
  langFormaat: "4 maart 1990",
}
const jaarMaandDatum: ResidentDatum = {
  type: "JaarMaandDatum",
  jaar: 1990,
  maand: 3,
  langFormaat: "maart 1990",
}
const jaarDatum: ResidentDatum = {
  type: "JaarDatum",
  jaar: 1990,
  langFormaat: "1990",
}
const datumOnbekend: ResidentDatum = {
  type: "DatumOnbekend",
  onbekend: true,
  langFormaat: "onbekend",
}

describe("a date from the BRP", () => {
  it("is read as precisely as the BRP knows it", () => {
    expect(toIsoDate(datum)).toBe("1990-03-04")
    expect(toIsoDate(jaarMaandDatum)).toBe("1990-03")
    expect(toIsoDate(jaarDatum)).toBe("1990")
    expect(toIsoDate(datumOnbekend)).toBeUndefined()

    expect(formatResidentDatum(datum)).toBe("04-03-1990")
    expect(formatResidentDatum(jaarMaandDatum)).toBe("03-1990")
    expect(formatResidentDatum(jaarDatum)).toBe("1990")
    expect(formatResidentDatum(datumOnbekend)).toBeUndefined()
  })

  it("shows a birth year when only the year is known", () => {
    const born = (geboorteDatum: ResidentDatum) =>
      getResidentPersonalDetails({ geboorte: { datum: geboorteDatum } }).find(
        (item) => item.label === "Geboren",
      )?.value

    expect(born(jaarDatum)).toMatch(/^1990 \(\d+ jaar\)$/)
    expect(born(datum)).toMatch(/^04-03-1990 \(\d+ jaar\)$/)
    expect(born(datumOnbekend)).toBeUndefined()
  })

  it("keeps someone who died this year or on an unknown date", () => {
    const deceased = (overlijdenDatum: ResidentDatum): Resident => ({
      overlijden: { datum: overlijdenDatum },
    })
    const thisYear: ResidentDatum = { type: "JaarDatum", jaar: dayjs().year() }

    expect(
      filterDeceasedResidents([
        deceased(jaarDatum),
        deceased(thisYear),
        deceased(datumOnbekend),
      ]),
    ).toEqual([deceased(thisYear), deceased(datumOnbekend)])
  })
})
