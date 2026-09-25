import { describe, expect, it } from "vitest"
import { mapFormValuesToPayload } from "../mapFormValuesToPayload"

// Fields the mapper doesn't find count as "0"/"nee", so a partial set of values is enough.
const formValues = (overrides: Partial<GebruikersinvoerFormValues> = {}) =>
  ({
    binnenruimtes: [],
    buitenruimtes: [],
    ...overrides,
  }) as GebruikersinvoerFormValues

const binnenruimte = (
  type: BinnenruimteType,
  overrides: Partial<Binnenruimte> = {},
): Binnenruimte => ({
  type,
  lengte: null,
  breedte: null,
  oppervlakte: 10,
  verwarmd: "true",
  verkoeld: "false",
  ...overrides,
})

const buitenruimte = (
  type: BuitenruimteType,
  overrides: Partial<Buitenruimte> = {},
): Buitenruimte => ({
  type,
  lengte: null,
  breedte: null,
  oppervlakte: 8,
  aantal_adressen: 1,
  ...overrides,
})

describe("mapFormValuesToPayload", () => {
  describe("binnenruimtes", () => {
    it("sorts the rooms into vertrekken, overige ruimten and verkeersruimten", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Woonkamer", { verkoeld: "true" }),
            binnenruimte("Berging", { verwarmd: "false" }),
            binnenruimte("Overloop", { oppervlakte: null }),
          ],
        }),
      )

      expect(payload.vertrekken).toEqual([
        expect.objectContaining({
          naam: "woonkamer",
          ruimte_m2: "10",
          verwarmd: true,
          gekoeld: true,
        }),
      ])
      expect(payload.overige_ruimten).toEqual([
        expect.objectContaining({
          naam: "berging",
          ruimte_m2: "10",
          verwarmd: false,
        }),
      ])
      expect(payload.overige_ruimten[0]).not.toHaveProperty("gekoeld")
      expect(payload.verkeersruimten).toEqual([
        { naam: "verkeersruimte", ruimte_m2: "0", verwarmd: true },
      ])
    })

    it("sends an oppervlakte typed into the input (a string) as a decimal string", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Slaapkamer", {
              oppervlakte: "12.345" as unknown as number,
            }),
          ],
        }),
      )

      expect(payload.vertrekken[0].ruimte_m2).toBe("12.35")
    })

    it("maps the zolder types onto zolder, with or without vaste trap", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Zolderberging met vaste trap"),
            binnenruimte("Zolderberging zonder vaste trap"),
          ],
        }),
      )

      expect(payload.overige_ruimten).toEqual([
        expect.objectContaining({ naam: "zolder", heeft_vaste_trap: true }),
        expect.objectContaining({ naam: "zolder", heeft_vaste_trap: false }),
      ])
    })

    it("sends each badkamer with its own voorzieningen", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Badkamer", {
              douche_bad: "baddouche",
              wastafel: "2",
              toilet_hangend: "1",
            }),
            binnenruimte("Badkamer", { douche_bad: "douche", wastafel: "1" }),
          ],
        }),
      )

      expect(payload.vertrekken).toEqual([
        expect.objectContaining({
          naam: "badkamer",
          douche: 0,
          bad: 0,
          baddouche: 1,
          wastafel: 2,
          toilet_hangend: 1,
        }),
        expect.objectContaining({
          naam: "badkamer",
          douche: 1,
          baddouche: 0,
          wastafel: 1,
          toilet_hangend: 0,
        }),
      ])
    })

    it("sends the sanitair of a slaapkamer met wastafel on the slaapkamer", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Slaapkamer met wastafel, douche of bad", {
              douche_bad: "douche",
              wastafel: "1",
            }),
          ],
        }),
      )

      expect(payload.vertrekken).toEqual([
        expect.objectContaining({ naam: "slaapkamer", douche: 1, wastafel: 1 }),
      ])
    })

    it("sends a voorziening in andere ruimte as a room without m² and not verwarmd", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Keuken in andere ruimte", {
              oppervlakte: null,
              inbouw_koelkast: "1",
            }),
          ],
        }),
      )

      expect(payload.vertrekken).toEqual([
        expect.objectContaining({
          naam: "keuken",
          ruimte_m2: "0",
          verwarmd: false,
          inbouw_koelkast: 1,
        }),
      ])
    })

    it("maps the keuken's aanrechtlengte and kranen met kookfunctie", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Woonkamer met open keuken", {
              aanrechtlengte: "1_tot_2_meter",
              eenhandsmengkraan: "1",
              thermostatische_mengkraan_kookfunctie: "1",
            }),
          ],
        }),
      )

      expect(payload.vertrekken[0]).toEqual(
        expect.objectContaining({
          naam: "keuken",
          aanrechtlengte_meters: "1.5",
          eenhandsmengkraan: 1,
          thermostatische_mengkraan: 1,
          kokendwaterfunctie: 1,
        }),
      )
    })

    it("maps a toiletruimte with its own toilet and wastafel", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          binnenruimtes: [
            binnenruimte("Toiletruimte", {
              toilet_hangend: "1",
              wastafel: "1",
            }),
          ],
        }),
      )

      expect(payload.overige_ruimten).toEqual([
        expect.objectContaining({
          naam: "toiletruimte",
          toilet_hangend: 1,
          toilet_staand: 0,
          wastafel: 1,
        }),
      ])
    })
  })

  describe("buitenruimtes", () => {
    it("sends a buitenruimte for 1 adres as privé and for more as gemeenschappelijk", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          buitenruimtes: [
            buitenruimte("Balkon"),
            buitenruimte("Achtertuin", { oppervlakte: 40, aantal_adressen: 4 }),
          ],
        }),
      )

      expect(payload.buitenruimten).toEqual([
        { naam: "prive_buitenruimte", ruimte_m2: "8" },
        {
          naam: "gemeenschappelijke_buitenruimte",
          ruimte_m2: "40",
          aantal_adressen_met_toegang_en_gebruiksrecht: 4,
        },
      ])
    })

    it("sends one parkeerruimte per plek, handing out the laadpalen one by one", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          buitenruimtes: [
            buitenruimte("Parkeerruimte", {
              aantal_adressen: 3,
              parkeerplekken_afgesloten_parkeergarage: "1",
              parkeerplekken_buiten_met_dak: "0",
              parkeerplekken_buiten_zonder_dak: "2",
              laadpaal: "2",
            }),
          ],
        }),
      )

      const plek = (
        type: PayloadParkeerruimte["type"],
        laadpaal: boolean,
      ): PayloadParkeerruimte => ({
        naam: "buitenruimte_parkeerplaats",
        type,
        aantal_adressen_met_toegang_en_gebruiksrecht: 3,
        laadpaal,
      })
      expect(payload.buitenruimten).toEqual([])
      expect(payload.parkeerruimten).toEqual([
        plek("gesloten_garage_bij_complex", true),
        plek("buiten_bij_complex_zonder_dak", true),
        plek("buiten_bij_complex_zonder_dak", false),
      ])
      expect(payload.bijzondere_voorziening_laadpalen).toBe(0)
    })

    it("counts laadpalen beyond the number of plekken as losse laadpalen", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          buitenruimtes: [
            buitenruimte("Parkeerruimte", {
              parkeerplekken_afgesloten_parkeergarage: "0",
              parkeerplekken_buiten_met_dak: "1",
              parkeerplekken_buiten_zonder_dak: "0",
              laadpaal: "3",
            }),
          ],
        }),
      )

      expect(payload.parkeerruimten).toEqual([
        expect.objectContaining({ laadpaal: true }),
      ])
      expect(payload.bijzondere_voorziening_laadpalen).toBe(2)
    })
  })

  describe("woning en bijzonderheden", () => {
    it("maps the woninggegevens and ja/nee-vragen", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          bouwjaar: 1970,
          gebruiksoppervlakte: 90,
          woz_waarde: 374000,
          woz_peildatum_jaar: "2025" as unknown as number,
          energielabel_klasse: "C",
          type_woning: "Eengezinswoning",
          monument: true,
          monument_soort: "rijksmonument_contract_na_1_juli_2024",
          zorgwoning: "true",
          in_gebruik_genomen_na_1_juli_2024: "true",
          opgeleverd_2015_tot_en_met_2019: "true",
          kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
          voorzieningen_voor_mensen_met_handicap: "true",
          bijzondere_voorziening_intercom_met_beeld: "true",
        }),
      )

      expect(payload).toEqual(
        expect.objectContaining({
          energie: { type: "label", waarde: "C" },
          is_eengezinswoning: true,
          completed: true,
          bouwjaar: 1970,
          gebruiksoppervlakte: 90,
          woz_waarde: 374000,
          woz_peildatum_jaar: 2025,
          monument: true,
          monument_soort: "rijksmonument",
          huurovereenkomst_afgesloten_op: null,
          zorgwoning: true,
          nieuwbouw: true,
          woz_nieuwbouw_2015_2019: true,
          woz_kleine_nieuwbouwwoning: false,
          woonvoorziening_handicap: true,
          bijzondere_voorziening_intercom_met_beeld: true,
        }),
      )
    })

    it("falls back to the bouwjaar without energielabel and sends geen monument as null", () => {
      const payload = mapFormValuesToPayload(
        formValues({
          energielabel_klasse: "",
          type_woning: null,
          monument: false,
          monument_soort: "geen_monument",
        }),
      )

      expect(payload.energie).toEqual({ type: "bouwjaar" })
      expect(payload.is_eengezinswoning).toBeNull()
      expect(payload.monument_soort).toBeNull()
    })

    it.each([
      ["gemeentelijk_of_provinciaal_monument", "gemeentelijk_monument", null],
      [
        "beschermd_stads_en_dorpsgezicht",
        "beschermd_stads_of_dorpsgezicht",
        null,
      ],
      [
        "rijksmonument_contract_voor_1_juli_2024",
        "rijksmonument",
        "2024-06-30",
      ],
      ["rijksmonument_contract_na_1_juli_2024", "rijksmonument", null],
    ])(
      "maps monument_soort %s onto the backend's %s",
      (formSoort, monumentSoort, contractdatum) => {
        const payload = mapFormValuesToPayload(
          formValues({ monument: true, monument_soort: formSoort }),
        )

        expect(payload.monument).toBe(true)
        expect(payload.monument_soort).toBe(monumentSoort)
        expect(payload.huurovereenkomst_afgesloten_op).toBe(contractdatum)
      },
    )
  })
})
