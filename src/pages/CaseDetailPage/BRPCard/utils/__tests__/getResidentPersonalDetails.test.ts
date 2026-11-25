import { describe, expect, it } from "vitest"
import type { Resident } from "../../types"
import { getResidentPersonalDetails } from "../getResidentPersonalDetails"

const nationality = (nationaliteiten: Resident["nationaliteiten"]) =>
  getResidentPersonalDetails({ nationaliteiten }).find(
    (item) => item.label === "Nationaliteit",
  )?.value

describe("the nationality of a resident", () => {
  it("lists the nationalities", () => {
    expect(
      nationality([
        { nationaliteit: { omschrijving: "Nederlandse" } },
        { nationaliteit: { omschrijving: "Marokkaanse" } },
      ]),
    ).toBe("Nederlandse, Marokkaanse")
  })

  it("leaves out a nationality without a description", () => {
    expect(
      nationality([{ nationaliteit: { omschrijving: "Nederlandse" } }, {}]),
    ).toBe("Nederlandse")
  })

  it("leaves out the row when there is nothing to show", () => {
    expect(nationality([{}])).toBeUndefined()
    expect(nationality([])).toBeUndefined()
    expect(nationality(undefined)).toBeUndefined()
  })
})
