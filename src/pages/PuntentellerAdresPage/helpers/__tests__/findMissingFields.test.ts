import { describe, expect, it } from "vitest"
import { findMissingFields } from "../findMissingFields"

/** Values with every required field filled in. */
const complete = (
  overrides: Partial<GebruikersinvoerFormValues> = {},
): GebruikersinvoerFormValues =>
  ({
    binnenruimtes: [],
    buitenruimtes: [],
    woz_waarde: 374000,
    woz_peildatum_jaar: 2025,
    energie_type: "label",
    energielabel_klasse: "C",
    energie_index: null,
    bouwjaar: null,
    type_woning: "Eengezinswoning",
    gemeenschappelijke_binnenruimtes: "false",
    monument: false,
    monument_soort: "geen_monument",
    zorgwoning: "false",
    voorzieningen_voor_mensen_met_handicap: "false",
    opgeleverd_2015_tot_en_met_2019: "false",
    in_gebruik_genomen_na_1_juli_2024: "false",
    kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
    bijzondere_voorziening_intercom_met_beeld: "false",
    ...overrides,
  }) as GebruikersinvoerFormValues

const binnenruimte = (
  type: BinnenruimteType,
  overrides: Partial<Binnenruimte> = {},
): Binnenruimte => ({
  type,
  lengte: null,
  breedte: null,
  oppervlakte: 12,
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

const names = (values: GebruikersinvoerFormValues) =>
  findMissingFields(values).map(({ name }) => name)

describe("findMissingFields", () => {
  it("finds nothing when everything required is filled in", () => {
    expect(findMissingFields(complete())).toEqual([])
  })

  it("lists the missing woninggegevens with their step and message", () => {
    expect(
      findMissingFields(
        complete({
          woz_waarde: Number.NaN,
          type_woning: null,
          gemeenschappelijke_binnenruimtes: null,
        }),
      ),
    ).toEqual([
      { step: 0, name: "woz_waarde", message: "WOZ-waarde is verplicht" },
      { step: 0, name: "type_woning", message: "Type woning is verplicht" },
      {
        step: 0,
        name: "gemeenschappelijke_binnenruimtes",
        message: "Gemeenschappelijke binnenruimtes is verplicht",
      },
    ])
  })

  it("only requires the WOZ-peildatum when there are peildata to choose from", () => {
    const values = complete({ woz_peildatum_jaar: null as unknown as number })
    const invoerwaarden = {
      woz_waarden: [{ peildatum: "2025-01-01", vastgestelde_waarde: 374000 }],
    } as PuntentellerInvoerwaarden

    expect(findMissingFields(values)).toEqual([])
    expect(
      findMissingFields(values, invoerwaarden).map(({ name }) => name),
    ).toEqual(["woz_peildatum_jaar"])
  })

  it.each([
    ["label", "energielabel_klasse"],
    ["index", "energie_index"],
    ["bouwjaar", "bouwjaar"],
  ] as const)(
    "only requires the field of the chosen energie_type %s",
    (energieType, name) => {
      expect(
        names(
          complete({
            energie_type: energieType,
            energielabel_klasse: "",
            energie_index: null,
            bouwjaar: null,
          }),
        ),
      ).toEqual([name])
    },
  )

  it("lists the missing fields of each binnenruimte under its step, with its label", () => {
    expect(
      findMissingFields(
        complete({
          binnenruimtes: [
            binnenruimte("Slaapkamer"),
            binnenruimte("Slaapkamer", { oppervlakte: null, verwarmd: null }),
          ],
        }),
      ),
    ).toEqual([
      {
        step: 1,
        name: "binnenruimtes.1.oppervlakte",
        message: "Slaapkamer 2: Vul de oppervlakte in.",
      },
      {
        step: 1,
        name: "binnenruimtes.1.verwarmd",
        message: "Slaapkamer 2: Geef aan of de ruimte verwarmd is",
      },
    ])
  })

  it("follows the questions a binnenruimte type asks", () => {
    // An overloop asks neither oppervlakte nor verkoeld.
    expect(
      names(
        complete({
          binnenruimtes: [
            binnenruimte("Overloop", { oppervlakte: null, verkoeld: null }),
          ],
        }),
      ),
    ).toEqual([])
    // Verkoeld is only asked when the ruimte is verwarmd.
    expect(
      names(
        complete({
          binnenruimtes: [
            binnenruimte("Woonkamer", { verwarmd: "false", verkoeld: null }),
            binnenruimte("Slaapkamer", { verwarmd: "true", verkoeld: null }),
          ],
        }),
      ),
    ).toEqual(["binnenruimtes.1.verkoeld"])
  })

  it("requires the voorzieningen marked required for the binnenruimte type", () => {
    expect(
      names(
        complete({
          binnenruimtes: [binnenruimte("Badkamer", { douche_bad: "" })],
        }),
      ),
    ).toEqual(["binnenruimtes.0.douche_bad"])
  })

  it("lists the missing fields of each buitenruimte; a parkeerruimte has no oppervlakte", () => {
    expect(
      findMissingFields(
        complete({
          buitenruimtes: [
            buitenruimte("Parkeerruimte", {
              oppervlakte: null,
              aantal_adressen: null,
            }),
          ],
        }),
      ),
    ).toEqual([
      {
        step: 2,
        name: "buitenruimtes.0.aantal_adressen",
        message: "Parkeerruimte: Vul het aantal adressen in.",
      },
    ])
  })

  it("lists the missing bijzonderheden", () => {
    expect(
      findMissingFields(complete({ monument_soort: null, zorgwoning: "" })),
    ).toEqual([
      {
        step: 3,
        name: "monument_soort",
        message: "Geef aan of de woning een monument is",
      },
      {
        step: 3,
        name: "zorgwoning",
        message: "Geef aan of de woning een zorgwoning is",
      },
    ])
  })
})
