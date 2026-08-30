import { describe, expect, it } from "vitest"
import {
  mapInvoerwaardenToFormValues,
  selectDefaultWozWaarde,
  sortWozWaardenByPeildatum,
} from "../mapInvoerwaardenToFormValues"

const invoerwaarden: PuntentellerInvoerwaarden = {
  straat: "Tjasker",
  huisnummer: "59",
  bouwjaar: 1970,
  gebruiksoppervlakte: 90,
  woz_waarden: [
    { peildatum: "2023-01-01", vastgestelde_waarde: 350000 },
    { peildatum: "2025-01-01", vastgestelde_waarde: 374000 },
    { peildatum: "2024-01-01", vastgestelde_waarde: 331000 },
  ],
  wozobjectnummer: 36300297723,
  energielabel: "C",
}

describe("sortWozWaardenByPeildatum", () => {
  it("sorts woz_waarden descending by peildatum regardless of input order", () => {
    expect(sortWozWaardenByPeildatum(invoerwaarden.woz_waarden)).toEqual([
      { peildatum: "2025-01-01", vastgestelde_waarde: 374000 },
      { peildatum: "2024-01-01", vastgestelde_waarde: 331000 },
      { peildatum: "2023-01-01", vastgestelde_waarde: 350000 },
    ])
  })
})

describe("selectDefaultWozWaarde", () => {
  it("picks the most recent peildatum", () => {
    expect(selectDefaultWozWaarde(invoerwaarden.woz_waarden)).toEqual({
      peildatum: "2025-01-01",
      vastgestelde_waarde: 374000,
    })
  })
})

describe("mapInvoerwaardenToFormValues", () => {
  it("maps the overlapping invoerwaarden fields, using the most recent wozWaarde as default", () => {
    expect(mapInvoerwaardenToFormValues(invoerwaarden)).toEqual({
      gebruiksoppervlakte: 90,
      woz_waarde: 374000,
      woz_peildatum_jaar: 2025,
      energielabel_klasse: "C",
    })
  })
})
