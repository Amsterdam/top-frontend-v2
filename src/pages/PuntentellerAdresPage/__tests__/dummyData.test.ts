import { describe, expect, it } from "vitest"
import { DUMMY_DATA } from "../dummyData"
import { findMissingFields } from "../helpers/findMissingFields"
import { mapFormValuesToPayload } from "../helpers/mapFormValuesToPayload"

describe("DUMMY_DATA", () => {
  it.each(Object.entries(DUMMY_DATA))(
    "%s fills in every required field",
    (_naam, dummyData) => {
      const values = { ...dummyData, woz_peildatum_jaar: 2025 }

      expect(findMissingFields(values)).toEqual([])
      expect(() => mapFormValuesToPayload(values)).not.toThrow()
    },
  )
})
