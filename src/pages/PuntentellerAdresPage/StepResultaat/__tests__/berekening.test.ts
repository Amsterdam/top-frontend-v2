import { describe, expect, it } from "vitest"
import { correcties, huursegment, rubrieken } from "../berekening"

const resultaat = (
  totaalBruto: number,
  totaalNaCaps: number,
  extra: PuntentellerResultaat["correcties"] = {},
): PuntentellerResultaat => ({
  rubrieken: {},
  energieprestatie_berekening: {
    categorie: "label",
    punten: 0,
    punten_voor_monumentcorrectie: 0,
    monumentcorrectie_toegepast: false,
  },
  totaal_punten_bruto: totaalBruto,
  correcties: {
    woz_cap_toegepast: false,
    totaal_zonder_woz: totaalBruto,
    woz_na_cap: 0,
    zorgwoning_toegepast: false,
    monument_toegepast: false,
    nieuwbouw_toegepast: false,
    ...extra,
  },
  totaal_punten_na_caps: totaalNaCaps,
})

describe("huursegment", () => {
  it.each([
    [17, "Sociale huur"],
    [143, "Sociale huur"],
    [143.4, "Sociale huur"],
    [143.5, "Middenhuur"],
    [186, "Middenhuur"],
    [187, "Vrije sector"],
    [412, "Vrije sector"],
  ])("puts %s punten in %s", (punten, name) => {
    expect(huursegment(punten).name).toBe(name)
  })
})

describe("correcties", () => {
  it("is empty when the backend applied none", () => {
    expect(correcties(resultaat(17, 17))).toEqual([])
  })

  it("shows how much the WOZ-cap took off", () => {
    expect(
      correcties(
        resultaat(160, 140, {
          woz_cap_toegepast: true,
          totaal_zonder_woz: 100,
          woz_voor_cap: 60,
          woz_na_cap: 40,
        }),
      ),
    ).toEqual([
      {
        label: "WOZ-punten boven 33%",
        note: "WOZ telt voor maximaal 33% van het totaal mee",
        punten: -20,
      },
    ])
  })

  it("adds the minimum of 186 punten when the 33%-regel drops the woning below 187", () => {
    // 200 bruto (130 + 70 WOZ) → the cap leaves 50 WOZ = 180 → the minimum lifts it to 186.
    const list = correcties(
      resultaat(200, 186, {
        woz_cap_toegepast: true,
        totaal_zonder_woz: 130,
        woz_voor_cap: 70,
        woz_na_cap: 50,
        woz_minimale_waardering_186_toegepast: true,
      }),
    )

    expect(list).toEqual([
      expect.objectContaining({ label: "WOZ-punten boven 33%", punten: -20 }),
      expect.objectContaining({ label: "Minimaal 186 punten", punten: 6 }),
    ])
  })

  it("keeps a later opslag separate from the minimum of 186 punten", () => {
    // 180 after the cap → 186 minimum → zorgwoning × 1,35 = 251,1
    const list = correcties(
      resultaat(200, 251.1, {
        woz_cap_toegepast: true,
        totaal_zonder_woz: 130,
        woz_na_cap: 50,
        woz_minimale_waardering_186_toegepast: true,
        zorgwoning_toegepast: true,
      }),
    )

    expect(list.map(({ label }) => label)).toEqual([
      "WOZ-punten boven 33%",
      "Minimaal 186 punten",
      "Zorgwoning",
    ])
    expect(list[2].punten).toBeCloseTo(65.1)
  })

  it("works each opslag back from the total, in the backend's order", () => {
    // 100 bruto → zorgwoning × 1,35 = 135 → monument × 1,15 = 155,25 → nieuwbouw × 1,1 = 170,775
    const list = correcties(
      resultaat(100, 170.775, {
        zorgwoning_toegepast: true,
        monument_toegepast: true,
        monument_soort: "gemeentelijk_monument",
        monument_correctie_type: "huurprijsopslag",
        monument_huurprijsopslag_factor: 1.15,
        nieuwbouw_toegepast: true,
        nieuwbouw_huurprijsopslag_factor: 1.1,
      }),
    )

    expect(list.map(({ label }) => label)).toEqual([
      "Zorgwoning",
      "Gemeentelijk monument",
      "Nieuwbouw",
    ])
    expect(list[0].punten).toBeCloseTo(35)
    expect(list[1]).toEqual(expect.objectContaining({ note: "× 1,15" }))
    expect(list[1].punten).toBeCloseTo(20.25)
    expect(list[2].punten).toBeCloseTo(15.525)
  })

  it("shows a rijksmonument's extra punten as they are", () => {
    expect(
      correcties(
        resultaat(100, 150, {
          monument_toegepast: true,
          monument_soort: "rijksmonument",
          monument_correctie_type: "extra_punten",
          monument_extra_punten: 50,
        }),
      ),
    ).toEqual([{ label: "Rijksmonument", note: "Extra punten", punten: 50 }])
  })
})

describe("rubrieken", () => {
  const withRubrieken = (rubrieken: Record<string, number>) => ({
    ...resultaat(0, 0),
    rubrieken,
  })

  it("labels each rubriek, in alphabetical order of the label", () => {
    expect(
      rubrieken(
        withRubrieken({
          vertrekken: 56,
          woz: 47,
          sanitair_extra_voorzieningen: 1,
        }),
      ),
    ).toEqual([
      {
        name: "sanitair_extra_voorzieningen",
        label: "Extra sanitaire voorzieningen",
        punten: 1,
      },
      { name: "vertrekken", label: "Vertrekken", punten: 56 },
      { name: "woz", label: "WOZ-waarde", punten: 47 },
    ])
  })

  it("sorts regardless of capitals, with untranslated field names in between", () => {
    expect(
      rubrieken(
        withRubrieken({ woz: 1, badkamer: 2, overige_ruimten: 3, keuken: 4 }),
      ).map(({ label }) => label),
    ).toEqual(["Badkamer", "Keuken", "Overige ruimten", "WOZ-waarde"])
    expect(
      rubrieken(withRubrieken({ woz: 1, nieuwe_rubriek: 2, badkamer: 3 })).map(
        ({ label }) => label,
      ),
    ).toEqual(["Badkamer", "nieuwe_rubriek", "WOZ-waarde"])
  })

  it("leaves out the rubrieken that round to 0 punten", () => {
    expect(
      rubrieken(
        withRubrieken({
          badkamer: 0,
          keuken: 0.001,
          buitenruimte: -5,
          woz: 47,
        }),
      ).map(({ name }) => name),
    ).toEqual(["buitenruimte", "woz"])
  })

  it("keeps the field name as label when there's no translation", () => {
    expect(rubrieken(withRubrieken({ nieuwe_rubriek: 3 }))).toEqual([
      { name: "nieuwe_rubriek", label: "nieuwe_rubriek", punten: 3 },
    ])
  })
})
