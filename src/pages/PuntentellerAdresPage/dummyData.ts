import { GEEN_MONUMENT } from "./fieldDefinitions"
import { emptyVoorzieningen } from "./StepBinnenruimtes/binnenruimteConfig"

/**
 * Example puntentellingen to fill the wizard with outside PROD, via ?dummydata=<naam> (see
 * useInitialValues), e.g. /puntenteller/0363010000758545?dummydata=sociale-huur.
 *
 * With a non-existent bagId, the address's invoerwaarden come from the fixtures instead, e.g.
 * /puntenteller/1234?dummydata=sociale-huur.
 *
 * Everything but the woz_peildatum_jaar: the peildata come from the address itself, so the
 * address's most recent one stays chosen. The woz_waarde is set here though, so each scenario
 * keeps its own WOZ-waarde whatever address it's loaded on.
 */
type DummyData = Omit<GebruikersinvoerFormValues, "woz_peildatum_jaar">

const binnenruimte = (
  type: BinnenruimteType,
  lengte: number | null,
  breedte: number | null,
  voorzieningen: BinnenruimteVoorzieningen = {},
  { verkoeld = "false" }: { verkoeld?: "true" | "false" } = {},
): Binnenruimte => ({
  ...emptyVoorzieningen(type),
  ...voorzieningen,
  type,
  lengte,
  breedte,
  oppervlakte:
    lengte != null && breedte != null
      ? Math.round(lengte * breedte * 100) / 100
      : null,
  verwarmd: "true",
  verkoeld,
  aantal_adressen: 1,
})

const buitenruimte = (
  type: BuitenruimteType,
  lengte: number,
  breedte: number,
): Buitenruimte => ({
  type,
  lengte,
  breedte,
  oppervlakte: Math.round(lengte * breedte * 100) / 100,
  aantal_adressen: 1,
})

const GEEN_BIJZONDERHEDEN = {
  monument: false,
  monument_soort: GEEN_MONUMENT,
  zorgwoning: "false",
  woonvoorziening_handicap: "false",
  woonvoorziening_handicap_netto_investering: "",
  opgeleverd_2015_tot_en_met_2019: "false",
  in_gebruik_genomen_na_1_juli_2024: "false",
  kleiner_dan_40_m2_opgeleverd_2018_2022: "false",
  bijzondere_voorziening_intercom_met_beeld: "false",
} satisfies Partial<DummyData>

export const DUMMY_DATA = {
  /**
   * Sociale huurwoning met een lage puntenscore.
   *
   * - Meergezinswoning (appartement), 45 m², bouwjaar 1928, energielabel F, WOZ € 415.000
   * - Woonkamer (20 m²) en aparte keuken (5 m²) met eenvoudig aanrecht en gaskookplaat
   * - 1 slaapkamer (10,5 m²)
   * - Badkamer (3 m²) met douche, wastafel en toilet; geen apart toilet
   * - Berging (1,5 m²)
   * - Geen buitenruimte
   * - Gemeentelijk monument en zorgwoning
   */
  "sociale-huur": {
    bouwjaar: 1928,
    energie_type: "label",
    energielabel_klasse: "F",
    energie_index: null,
    gebruiksoppervlakte: 45,
    woz_waarde: 415000,
    type_woning: "Meergezinswoning",

    binnenruimtes: [
      binnenruimte("Woonkamer", 5, 4),
      binnenruimte("Slaapkamer", 3.5, 3),
      binnenruimte("Keuken", 2.5, 2, {
        aanrechtlengte: "1_tot_2_meter",
        inbouw_kookplaat_gas: "1",
        eenhandsmengkraan: "1",
      }),
      binnenruimte("Badkamer", 2, 1.5, {
        douche_bad: "douche",
        wastafel: "1",
        toilet_normaal: "1",
      }),
      binnenruimte("Berging", 1.5, 1),
    ],
    buitenruimtes: [],

    ...GEEN_BIJZONDERHEDEN,
    monument: true,
    monument_soort: "gemeentelijk_of_provinciaal_monument",
    zorgwoning: "true",
  },

  /**
   * Middenhuurwoning.
   *
   * - Meergezinswoning (appartement), 80 m², bouwjaar 1986, energielabel B, WOZ € 345.000
   * - Woonkamer met open keuken (31,5 m²): inductie, afzuigkap, koelkast en oven
   * - 3 slaapkamers (20 m², 14 m² en 8,4 m²)
   * - Badkamer (5 m²) met douche, wastafel, hangend toilet en handdoekenradiator
   * - Apart toilet met fonteintje
   * - Balkon (6 m²)
   * - Gedeelde parkeergarage in het complex: 20 plekken voor 30 adressen, met 4 laadpalen
   * - Geen bijzonderheden
   */
  middenhuur: {
    bouwjaar: 1986,
    energie_type: "label",
    energielabel_klasse: "B",
    energie_index: null,
    gebruiksoppervlakte: 80,
    woz_waarde: 345000,
    type_woning: "Meergezinswoning",

    binnenruimtes: [
      binnenruimte("Woonkamer met open keuken", 7, 4.5, {
        aanrechtlengte: "1_tot_2_meter",
        inbouw_afzuiginstallatie: "1",
        inbouw_kookplaat_inductie: "1",
        inbouw_koelkast: "1",
        inbouw_oven_elektrisch: "1",
        eenhandsmengkraan: "1",
      }),
      binnenruimte("Slaapkamer", 4, 3.5),
      binnenruimte("Slaapkamer", 3, 2.8),
      binnenruimte("Slaapkamer", 5, 4),
      binnenruimte("Badkamer", 2.5, 2, {
        douche_bad: "douche",
        wastafel: "1",
        toilet_hangend: "1",
        eenhandsmengkraan: "1",
        handdoekenradiator: "1",
      }),
      binnenruimte("Toiletruimte", 1.2, 0.9, {
        toilet_hangend: "1",
        wastafel: "1",
      }),
    ],
    buitenruimtes: [
      buitenruimte("Balkon", 4, 1.5),
      {
        type: "Parkeerruimte",
        lengte: null,
        breedte: null,
        oppervlakte: null,
        aantal_adressen: 30,
        parkeerplekken_afgesloten_parkeergarage: "20",
        parkeerplekken_buiten_met_dak: "0",
        parkeerplekken_buiten_zonder_dak: "0",
        laadpaal: "4",
      },
    ],

    ...GEEN_BIJZONDERHEDEN,
  },

  /**
   * Woning boven de gereguleerde grens.
   *
   * - Eengezinswoning (rijtjeshuis), 130 m², bouwjaar 2016, energielabel A+, WOZ € 725.000
   * - Woonkamer met open keuken (45 m², met airco): aanrecht langer dan 2 meter, inductie,
   *   afzuigkap, koelkast, vriezer, oven, magnetron, vaatwasser, kokendwaterkraan en extra
   *   kastruimte
   * - Overloop
   * - 4 slaapkamers (18 m² met airco, 2× 10,5 m² en 9 m²)
   * - Badkamer (7,5 m²) met bad en aparte douche, meerpersoons wastafel, hangend toilet en
   *   handdoekenradiator
   * - Apart toilet met fonteintje
   * - Berging (3 m²)
   * - Voortuin (10 m²) en achtertuin (40 m²)
   * - Opgeleverd in 2015 tot en met 2019
   */
  "vrije-sector": {
    bouwjaar: 2016,
    energie_type: "label",
    energielabel_klasse: "A+",
    energie_index: null,
    gebruiksoppervlakte: 130,
    woz_waarde: 725000,
    type_woning: "Eengezinswoning",

    binnenruimtes: [
      binnenruimte(
        "Woonkamer met open keuken",
        9,
        5,
        {
          aanrechtlengte: "langer_dan_2_meter",
          inbouw_afzuiginstallatie: "1",
          inbouw_kookplaat_inductie: "1",
          inbouw_koelkast: "1",
          inbouw_vrieskast: "1",
          inbouw_oven_elektrisch: "1",
          inbouw_magnetron: "1",
          inbouw_vaatwasmachine: "1",
          extra_kastruimte: "3",
          thermostatische_mengkraan_kookfunctie: "1",
        },
        { verkoeld: "true" },
      ),
      binnenruimte("Overloop", null, null),
      binnenruimte("Slaapkamer", 4.5, 4, {}, { verkoeld: "true" }),
      binnenruimte("Slaapkamer", 3.5, 3),
      binnenruimte("Slaapkamer", 3.5, 3),
      binnenruimte("Slaapkamer", 3, 3),
      binnenruimte("Badkamer", 3, 2.5, {
        douche_bad: "baddouche",
        meerpersoons_wastafel: "1",
        toilet_hangend: "1",
        thermostatische_mengkraan: "1",
        volledige_afscheiding_douche: "1",
        handdoekenradiator: "1",
        kast_bij_wastafel: "1",
        stopcontacten: "2",
      }),
      binnenruimte("Toiletruimte", 1.5, 1, {
        toilet_hangend: "1",
        wastafel: "1",
      }),
      binnenruimte("Berging", 2, 1.5),
    ],
    buitenruimtes: [
      buitenruimte("Voortuin / zijtuin", 5, 2),
      buitenruimte("Achtertuin", 5, 8),
    ],

    ...GEEN_BIJZONDERHEDEN,
    opgeleverd_2015_tot_en_met_2019: "true",
  },
} satisfies Record<string, DummyData>

type DummyDataNaam = keyof typeof DUMMY_DATA

export const isDummyDataNaam = (naam: string | null): naam is DummyDataNaam =>
  naam != null && Object.hasOwn(DUMMY_DATA, naam)
