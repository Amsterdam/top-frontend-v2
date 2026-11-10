import { describe, expect, it } from "vitest"
import { DUMMY_DATA } from "../../dummyData"
import { GEEN_MONUMENT } from "../../fieldDefinitions"
import { mapFormValuesToPayload } from "../mapFormValuesToPayload"
import { mapPuntentellingToFormValues } from "../mapPuntentellingToFormValues"

/**
 * A puntentelling as the backend returns it after saving this payload: the ruimtes as sent,
 * the energie as only its chosen grondslag, the integers as numbers.
 */
const savedPuntentelling = (
  payload: GebruikersinvoerPayload,
): PuntentellingDetail => ({
  ...payload,
  id: 1,
  author: null,
  completed: true,
  created: "2026-11-10T15:54:00+01:00",
  updated: "2026-11-10T15:54:00+01:00",
  punten: 0,
  punten_resultaat: {} as PuntentellerResultaat,
  energie: { ...payload.energie, heeft_energieprestatievergoeding: false },
  huidige_huurprijs:
    payload.huidige_huurprijs === null
      ? null
      : Number(payload.huidige_huurprijs),
  woonvoorziening_handicap_netto_investering:
    payload.woonvoorziening_handicap_netto_investering === null
      ? null
      : Number(payload.woonvoorziening_handicap_netto_investering),
})

/** The bare minimum of a saved puntentelling, for the cases that don't need a payload. */
const puntentelling = (
  overrides: Partial<PuntentellingDetail> = {},
): PuntentellingDetail =>
  ({
    ...savedPuntentelling(
      mapFormValuesToPayload({
        binnenruimtes: [],
        buitenruimtes: [],
      } as unknown as GebruikersinvoerFormValues),
    ),
    ...overrides,
  }) as PuntentellingDetail

const binnen = (ruimte: SavedRuimte) =>
  mapPuntentellingToFormValues(puntentelling({ vertrekken: [ruimte] }))
    .binnenruimtes?.[0]

describe("mapPuntentellingToFormValues", () => {
  it.each(Object.keys(DUMMY_DATA) as (keyof typeof DUMMY_DATA)[])(
    "gives back the same payload after saving the %s scenario",
    (naam) => {
      const values = {
        ...DUMMY_DATA[naam],
        woz_peildatum_jaar: 2025,
      } as GebruikersinvoerFormValues
      const payload = mapFormValuesToPayload(values)

      const reopened = {
        ...values,
        ...mapPuntentellingToFormValues(savedPuntentelling(payload)),
      }

      expect(mapFormValuesToPayload(reopened)).toEqual(payload)
    },
  )

  describe("binnenruimtes", () => {
    it("takes the type from the weergavenaam", () => {
      expect(
        binnen({
          naam: "keuken",
          weergavenaam: "Woonkamer met open keuken",
          ruimte_m2: "31.50",
        }),
      ).toEqual(expect.objectContaining({ type: "Woonkamer met open keuken" }))
    })

    it.each([
      ["woonkamer", "Woonkamer"],
      ["keuken", "Keuken"],
      ["prive_parkeerruimte", "Garage"],
      ["verkeersruimte", "Overloop"],
    ])(
      "takes the standaard type for %s without a known weergavenaam",
      (naam, type) => {
        expect(binnen({ naam, ruimte_m2: "10.00" })?.type).toBe(type)
        expect(
          binnen({ naam, weergavenaam: "Onbekend", ruimte_m2: "10.00" })?.type,
        ).toBe(type)
      },
    )

    it("takes a zolder without vaste trap for a zolderberging zonder vaste trap", () => {
      expect(
        binnen({ naam: "zolder", ruimte_m2: "6.00", heeft_vaste_trap: false })
          ?.type,
      ).toBe("Zolderberging zonder vaste trap")
    })

    it("gives back the oppervlakte as one vlak with the total", () => {
      expect(binnen({ naam: "slaapkamer", ruimte_m2: "12.50" })).toEqual(
        expect.objectContaining({
          vlakken: [{ lengte: null, breedte: null, oppervlakte: 12.5 }],
          oppervlakte: 12.5,
        }),
      )
    })

    it("gives back verwarmd, verkoeld and the aantal adressen", () => {
      expect(
        binnen({
          naam: "woonkamer",
          ruimte_m2: "20.00",
          verwarmd: true,
          gekoeld: true,
          aantal_adressen_met_toegang_en_gebruiksrecht: 3,
        }),
      ).toEqual(
        expect.objectContaining({
          verwarmd: "true",
          verkoeld: "true",
          aantal_adressen: 3,
        }),
      )
    })

    it("gives a type that doesn't ask them the values the form forces", () => {
      expect(
        binnen({
          naam: "keuken",
          weergavenaam: "Keuken in andere ruimte",
          ruimte_m2: "0",
          verwarmd: false,
        }),
      ).toEqual(
        expect.objectContaining({
          oppervlakte: null,
          verwarmd: "true",
          verkoeld: "false",
        }),
      )
    })

    it("gives back the voorzieningen the type asks, as count strings", () => {
      const keuken = binnen({
        naam: "keuken",
        ruimte_m2: "6.00",
        inbouw_koelkast: 1,
        eenhandsmengkraan_kookfunctie: 2,
        wastafel: 1,
      })

      expect(keuken).toEqual(
        expect.objectContaining({
          inbouw_koelkast: "1",
          eenhandsmengkraan_kookfunctie: "2",
          thermostatische_mengkraan_kookfunctie: "0",
        }),
      )
      // A keuken doesn't ask the wastafel.
      expect(keuken).not.toHaveProperty("wastafel")
    })

    it.each([
      [{ douche: 1 }, "douche"],
      [{ bad: 1 }, "bad"],
      [{ baddouche: 1 }, "baddouche"],
      [{}, ""],
    ])("gives back the douche/bad choice of %o", (counts, doucheBad) => {
      expect(
        binnen({ naam: "badkamer", ruimte_m2: "4.00", ...counts })?.douche_bad,
      ).toBe(doucheBad)
    })

    it.each([
      ["0.50", "korter_dan_1_meter"],
      ["1.00", "1_tot_2_meter"],
      ["2.00", "1_tot_2_meter"],
      ["2.50", "langer_dan_2_meter"],
      [null, ""],
    ])("gives back aanrechtlengte %s as %s", (meters, aanrechtlengte) => {
      expect(
        binnen({
          naam: "keuken",
          ruimte_m2: "6.00",
          aanrechtlengte_meters: meters,
        })?.aanrechtlengte,
      ).toBe(aanrechtlengte)
    })

    it("puts the binnenruimtes in the order of the backend's lists", () => {
      const { binnenruimtes } = mapPuntentellingToFormValues(
        puntentelling({
          vertrekken: [{ naam: "woonkamer", ruimte_m2: "20.00" }],
          overige_ruimten: [{ naam: "berging", ruimte_m2: "2.00" }],
          verkeersruimten: [{ naam: "verkeersruimte", ruimte_m2: "0" }],
        }),
      )

      expect(binnenruimtes?.map(({ type }) => type)).toEqual([
        "Woonkamer",
        "Berging",
        "Overloop",
      ])
    })
  })

  describe("buitenruimtes", () => {
    it("gives back the buitenruimtes and parkeerruimten", () => {
      const { buitenruimtes } = mapPuntentellingToFormValues(
        puntentelling({
          buitenruimten: [
            {
              naam: "prive_buitenruimte",
              weergavenaam: "Dakterras",
              ruimte_m2: "12.00",
            },
          ],
          parkeerruimten: [
            {
              naam: "buitenruimte_parkeerplaats",
              aantal_gesloten_garage_bij_complex: 20,
              aantal_buiten_bij_complex_met_dak: 0,
              aantal_buiten_bij_complex_zonder_dak: 5,
              aantal_adressen_met_toegang_en_gebruiksrecht: 30,
              aantal_laadpalen: 4,
            },
          ],
        }),
      )

      expect(buitenruimtes).toEqual([
        {
          type: "Dakterras",
          vlakken: [{ lengte: null, breedte: null, oppervlakte: 12 }],
          oppervlakte: 12,
          aantal_adressen: 1,
        },
        {
          type: "Parkeerruimte",
          vlakken: [{ lengte: null, breedte: null, oppervlakte: null }],
          oppervlakte: null,
          aantal_adressen: 30,
          parkeerplekken_afgesloten_parkeergarage: "20",
          parkeerplekken_buiten_met_dak: "0",
          parkeerplekken_buiten_zonder_dak: "5",
          laadpaal: "4",
        },
      ])
    })

    it.each([
      ["prive_buitenruimte", "Balkon"],
      ["gemeenschappelijke_buitenruimte", "Achtertuin"],
    ])("takes the standaard type for %s without weergavenaam", (naam, type) => {
      const { buitenruimtes } = mapPuntentellingToFormValues(
        puntentelling({ buitenruimten: [{ naam, ruimte_m2: "6.00" }] }),
      )

      expect(buitenruimtes?.[0].type).toBe(type)
    })
  })

  describe("woning en bijzonderheden", () => {
    it.each([
      [
        { type: "label", waarde: "B" },
        { energie_type: "label", energielabel_klasse: "B" },
      ],
      [
        { type: "index", waarde: "1.13" },
        { energie_type: "index", energie_index: 1.13 },
      ],
      [
        { type: "bouwjaar", waarde: 1928 },
        { energie_type: "bouwjaar", bouwjaar: 1928 },
      ],
    ] as const)(
      "only gives back the chosen energie: %o",
      (energie, expected) => {
        const values = mapPuntentellingToFormValues(
          puntentelling({
            energie: { ...energie, heeft_energieprestatievergoeding: false },
          }),
        )

        // The others stay as the address's invoerwaarden filled them in.
        const energieFields = [
          "energie_type",
          "energielabel_klasse",
          "energie_index",
          "bouwjaar",
        ] as const
        expect(
          Object.fromEntries(
            energieFields
              .filter((field) => field in values)
              .map((field) => [field, values[field]]),
          ),
        ).toEqual(expected)
      },
    )

    it.each([
      [null, null, GEEN_MONUMENT],
      ["gemeentelijk_monument", null, "gemeentelijk_of_provinciaal_monument"],
      ["provinciaal_monument", null, "gemeentelijk_of_provinciaal_monument"],
      [
        "beschermd_stads_of_dorpsgezicht",
        null,
        "beschermd_stads_en_dorpsgezicht",
      ],
      [
        "rijksmonument",
        "2024-06-30",
        "rijksmonument_contract_voor_1_juli_2024",
      ],
      ["rijksmonument", "2024-07-01", "rijksmonument_contract_na_1_juli_2024"],
      ["rijksmonument", null, "rijksmonument_contract_na_1_juli_2024"],
    ] as const)(
      "gives back monument_soort %s (contract %s) as %s",
      (monumentSoort, contractdatum, expected) => {
        const values = mapPuntentellingToFormValues(
          puntentelling({
            monument: monumentSoort !== null,
            monument_soort: monumentSoort,
            huurovereenkomst_afgesloten_op: contractdatum,
          }),
        )

        expect(values.monument_soort).toBe(expected)
      },
    )

    it("gives back the woninggegevens and ja/nee-vragen", () => {
      const values = mapPuntentellingToFormValues(
        puntentelling({
          is_eengezinswoning: false,
          gebruiksoppervlakte: 80,
          woz_waarde: 345000,
          woz_peildatum_jaar: 2025,
          huidige_huurprijs: 950,
          zorgwoning: true,
          woonvoorziening_handicap: true,
          woonvoorziening_handicap_netto_investering: 12500,
          woz_nieuwbouw_2015_2019: true,
          nieuwbouw: false,
          woz_kleine_nieuwbouwwoning: true,
          bijzondere_voorziening_intercom_met_beeld: true,
        }),
      )

      expect(values).toEqual(
        expect.objectContaining({
          type_woning: "Meergezinswoning",
          gebruiksoppervlakte: 80,
          woz_waarde: 345000,
          woz_peildatum_jaar: 2025,
          huidige_huurprijs: 950,
          zorgwoning: "true",
          woonvoorziening_handicap: "true",
          woonvoorziening_handicap_netto_investering: "12500",
          opgeleverd_2015_tot_en_met_2019: "true",
          in_gebruik_genomen_na_1_juli_2024: "false",
          kleiner_dan_40_m2_opgeleverd_2018_2022: "true",
          bijzondere_voorziening_intercom_met_beeld: "true",
        }),
      )
    })

    it("gives back an unknown type woning and no netto investering as empty", () => {
      const values = mapPuntentellingToFormValues(
        puntentelling({
          is_eengezinswoning: null,
          woonvoorziening_handicap_netto_investering: null,
        }),
      )

      expect(values.type_woning).toBeNull()
      expect(values.woonvoorziening_handicap_netto_investering).toBe("")
    })
  })
})
