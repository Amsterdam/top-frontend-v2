import { describe, expect, it } from "vitest"
import {
  mapInvoerwaardenToFormValues,
  selectDefaultWozWaarde,
  sortWozWaardenByPeildatum,
} from "../mapInvoerwaardenToFormValues"

const invoerwaarden: PuntentellerInvoerwaarden = {
  straat: "Tjasker",
  huisnummer: "59",
  huisnummertoevoeging: null,
  huisletter: null,
  bouwjaar: 1970,
  gebruiksoppervlakte: 90,
  woz_waarden: [
    { peildatum: "2023-01-01", vastgestelde_waarde: 350000 },
    { peildatum: "2025-01-01", vastgestelde_waarde: 374000 },
    { peildatum: "2024-01-01", vastgestelde_waarde: 331000 },
  ],
  wozobjectnummer: 36300297723,
  energie: {
    energielabel: "C",
    energieindex: null,
    registratiedatum: null,
    opnamedatum: "2021-03-01",
    meting_geldig_tot: "2031-03-01",
  },
}

const TODAY = "2025-06-15"

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
    expect(mapInvoerwaardenToFormValues(invoerwaarden, TODAY)).toEqual({
      bouwjaar: 1970,
      gebruiksoppervlakte: 90,
      woz_waarde: 374000,
      woz_peildatum_jaar: 2025,
      energie_type: "label",
      energielabel_klasse: "C",
      energie_index: null,
    })
  })

  it("picks the energie_type from selectEnergieGrondslag, but still fills in the EP-Online label and index", () => {
    const withIndex = mapInvoerwaardenToFormValues(
      {
        ...invoerwaarden,
        energie: { ...invoerwaarden.energie!, energieindex: "1,45" },
      },
      TODAY,
    )
    expect(withIndex).toEqual(
      expect.objectContaining({
        energie_type: "index",
        energielabel_klasse: "C",
        energie_index: 1.45,
      }),
    )

    const expired = mapInvoerwaardenToFormValues(invoerwaarden, "2031-03-02")
    expect(expired).toEqual(
      expect.objectContaining({
        energie_type: "bouwjaar",
        energielabel_klasse: "C",
      }),
    )
  })

  it("uses the bouwjaar without any energie data", () => {
    expect(
      mapInvoerwaardenToFormValues({ ...invoerwaarden, energie: null }, TODAY),
    ).toEqual(
      expect.objectContaining({
        energie_type: "bouwjaar",
        energielabel_klasse: "",
        energie_index: null,
      }),
    )
  })
})
