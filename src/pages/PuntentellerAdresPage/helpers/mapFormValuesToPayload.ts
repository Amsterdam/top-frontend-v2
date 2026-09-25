import { GEEN_MONUMENT } from "../fieldDefinitions"
import { BINNENRUIMTE_CONFIG } from "../StepBinnenruimtes/binnenruimteConfig"
import { toNumber } from "./oppervlakte"

const isJa = (value: unknown) => value === true || value === "true"

/** A count field ("0".."5") as a number. */
const count = (value: unknown) => Math.round(toNumber(value) ?? 0)

/** A decimal as the string DRF's DecimalField (2 decimal places) expects, e.g. "12.5". */
const decimal = (value: unknown) =>
  String(Math.round((toNumber(value) ?? 0) * 100) / 100)

// The backend wants the aanrechtlengte in meters, the form asks for a range. These values fall
// inside each range (backend thresholds: < 1 m, 1 to 2 m inclusive, > 2 m).
const AANRECHTLENGTE_METERS: Record<string, string> = {
  korter_dan_1_meter: "0.5",
  "1_tot_2_meter": "1.5",
  langer_dan_2_meter: "2.5",
}

/**
 * Douche/bad (a single choice in the form) and the wastafels. The backend accepts these on
 * every vertrek and overige ruimte; a room type without them simply sends zeros.
 */
const sanitair = (ruimte: Binnenruimte): PayloadSanitair => ({
  wastafel: count(ruimte.wastafel),
  meerpersoons_wastafel: count(ruimte.meerpersoons_wastafel),
  douche: ruimte.douche_bad === "douche" ? 1 : 0,
  bad: ruimte.douche_bad === "bad" ? 1 : 0,
  baddouche: ruimte.douche_bad === "baddouche" ? 1 : 0,
})

const badkamerVoorzieningen = (
  ruimte: Binnenruimte,
): PayloadBadkamerVoorzieningen => ({
  toilet_hangend: count(ruimte.toilet_hangend),
  toilet_normaal: count(ruimte.toilet_normaal),
  bubbelfunctie_bad: count(ruimte.bubbelfunctie_bad),
  volledige_afscheiding_douche: count(ruimte.volledige_afscheiding_douche),
  handdoekenradiator: count(ruimte.handdoekenradiator),
  kast_bij_wastafel: count(ruimte.kast_bij_wastafel),
  kastruimte: count(ruimte.kastruimte),
  stopcontacten: count(ruimte.stopcontacten),
  eenhandsmengkraan: count(ruimte.eenhandsmengkraan),
  thermostatische_mengkraan: count(ruimte.thermostatische_mengkraan),
})

/**
 * The form asks for a mengkraan "met kookfunctie" separately; the backend counts that as the
 * mengkraan plus a kokendwaterfunctie.
 */
const keukenVoorzieningen = (
  ruimte: Binnenruimte,
): PayloadKeukenVoorzieningen => {
  const eenhandsKookfunctie = count(ruimte.eenhandsmengkraan_kookfunctie)
  const thermostatischKookfunctie = count(
    ruimte.thermostatische_mengkraan_kookfunctie,
  )

  return {
    aanrechtlengte_meters:
      AANRECHTLENGTE_METERS[ruimte.aanrechtlengte ?? ""] ?? null,
    inbouw_afzuiginstallatie: count(ruimte.inbouw_afzuiginstallatie),
    inbouw_kookplaat_inductie: count(ruimte.inbouw_kookplaat_inductie),
    inbouw_kookplaat_keramisch: count(ruimte.inbouw_kookplaat_keramisch),
    inbouw_kookplaat_gas: count(ruimte.inbouw_kookplaat_gas),
    inbouw_koelkast: count(ruimte.inbouw_koelkast),
    inbouw_vrieskast: count(ruimte.inbouw_vrieskast),
    inbouw_oven_elektrisch: count(ruimte.inbouw_oven_elektrisch),
    inbouw_oven_gas: count(ruimte.inbouw_oven_gas),
    inbouw_magnetron: count(ruimte.inbouw_magnetron),
    inbouw_vaatwasmachine: count(ruimte.inbouw_vaatwasmachine),
    extra_kastruimte: count(ruimte.extra_kastruimte),
    eenhandsmengkraan: count(ruimte.eenhandsmengkraan) + eenhandsKookfunctie,
    thermostatische_mengkraan:
      count(ruimte.thermostatische_mengkraan) + thermostatischKookfunctie,
    kokendwaterfunctie:
      count(ruimte.kokendwaterfunctie) +
      eenhandsKookfunctie +
      thermostatischKookfunctie,
  }
}

type Ruimten = Pick<
  GebruikersinvoerPayload,
  "vertrekken" | "overige_ruimten" | "verkeersruimten"
>

/**
 * Sorts the binnenruimtes into the backend's vertrekken, overige ruimten and verkeersruimten.
 * The backend picks the kind of room by `naam`: only a "badkamer" gets its badkamer fields
 * read and only a "keuken" its keuken fields, so each type maps onto the naam that fits.
 */
function mapBinnenruimtes(values: GebruikersinvoerFormValues): Ruimten {
  const ruimten: Ruimten = {
    vertrekken: [],
    overige_ruimten: [],
    verkeersruimten: [],
  }

  for (const ruimte of values.binnenruimtes ?? []) {
    const { hasVerwarmd = true, hasOppervlakte = true } =
      BINNENRUIMTE_CONFIG[ruimte.type]
    // The form forces verwarmd to "ja" for types that don't ask it (the "... in andere ruimte"
    // types). Those only carry voorzieningen, so they must not add a verwarmde ruimte.
    const overig = {
      ruimte_m2: hasOppervlakte ? decimal(ruimte.oppervlakte) : "0",
      verwarmd: hasVerwarmd && isJa(ruimte.verwarmd),
      ...sanitair(ruimte),
    }
    const vertrek = { ...overig, gekoeld: isJa(ruimte.verkoeld) }

    switch (ruimte.type) {
      case "Woonkamer":
      case "Woon- en slaapkamer":
        ruimten.vertrekken.push({ naam: "woonkamer", ...vertrek })
        break
      case "Slaapkamer":
      case "Slaapkamer met wastafel, douche of bad":
        ruimten.vertrekken.push({ naam: "slaapkamer", ...vertrek })
        break
      case "Wasruimte / bijkeuken":
        ruimten.vertrekken.push({ naam: "wasruimte_bijkeuken", ...vertrek })
        break
      case "Badkamer":
      case "Bad, douche of wastafel in andere ruimte":
        ruimten.vertrekken.push({
          naam: "badkamer",
          ...vertrek,
          ...badkamerVoorzieningen(ruimte),
        })
        break
      case "Keuken":
      case "Woonkamer met open keuken":
      case "Woon- en slaapkamer met keuken":
      case "Keuken in andere ruimte":
        ruimten.vertrekken.push({
          naam: "keuken",
          ...vertrek,
          ...keukenVoorzieningen(ruimte),
        })
        break
      case "Toiletruimte":
        ruimten.overige_ruimten.push({
          naam: "toiletruimte",
          ...overig,
          toilet_staand: 0,
          toilet_hangend: count(ruimte.toilet_hangend),
        })
        break
      case "Kleine kamer (kleiner dan 4 m²)":
      case "Berging":
        ruimten.overige_ruimten.push({ naam: "berging", ...overig })
        break
      case "Kelder":
        ruimten.overige_ruimten.push({ naam: "kelder", ...overig })
        break
      case "Garage":
        ruimten.overige_ruimten.push({ naam: "prive_parkeerruimte", ...overig })
        break
      case "Zolder":
      case "Zolderberging met vaste trap":
      case "Zolderberging zonder vaste trap":
        ruimten.overige_ruimten.push({
          naam: "zolder",
          ...overig,
          heeft_vaste_trap: ruimte.type !== "Zolderberging zonder vaste trap",
        })
        break
      case "Overloop":
        ruimten.verkeersruimten.push({
          naam: "verkeersruimte",
          ruimte_m2: overig.ruimte_m2,
          verwarmd: overig.verwarmd,
        })
        break
      default: {
        const onbekend: never = ruimte.type
        throw new Error(`Onbekend binnenruimte-type: ${onbekend}`)
      }
    }
  }

  return ruimten
}

// The form's parkeerplek fields per backend type.
const PARKEERPLEK_TYPES = [
  ["parkeerplekken_afgesloten_parkeergarage", "gesloten_garage_bij_complex"],
  ["parkeerplekken_buiten_met_dak", "buiten_bij_complex_met_dak"],
  ["parkeerplekken_buiten_zonder_dak", "buiten_bij_complex_zonder_dak"],
] as const

/**
 * The buitenruimtes, split into the backend's buitenruimten and parkeerruimten. The form asks
 * a Parkeerruimte for the number of plekken per type and its laadpalen; the backend wants one
 * object per plek, each with or without a laadpaal. So the laadpalen go to the plekken one by
 * one; any left over (more laadpalen than plekken) count as losse laadpalen.
 */
function mapBuitenruimtes(values: GebruikersinvoerFormValues) {
  const buitenruimten: PayloadBuitenruimte[] = []
  const parkeerruimten: PayloadParkeerruimte[] = []
  let losseLaadpalen = 0

  for (const ruimte of values.buitenruimtes ?? []) {
    const aantalAdressen = count(ruimte.aantal_adressen) || 1

    if (ruimte.type === "Parkeerruimte") {
      let laadpalen = count(ruimte.laadpaal)
      for (const [veld, type] of PARKEERPLEK_TYPES) {
        for (let plek = 0; plek < count(ruimte[veld]); plek++) {
          parkeerruimten.push({
            naam: "buitenruimte_parkeerplaats",
            type,
            aantal_adressen_met_toegang_en_gebruiksrecht: aantalAdressen,
            laadpaal: laadpalen > 0,
          })
          laadpalen = Math.max(laadpalen - 1, 0)
        }
      }
      losseLaadpalen += laadpalen
      continue
    }

    buitenruimten.push(
      aantalAdressen > 1
        ? {
            naam: "gemeenschappelijke_buitenruimte",
            ruimte_m2: decimal(ruimte.oppervlakte),
            aantal_adressen_met_toegang_en_gebruiksrecht: aantalAdressen,
          }
        : {
            naam: "prive_buitenruimte",
            ruimte_m2: decimal(ruimte.oppervlakte),
          },
    )
  }

  return { buitenruimten, parkeerruimten, losseLaadpalen }
}

/**
 * The backend's monument_soort per form option. It tells a rijksmonument's contract before
 * and after 1 July 2024 apart by huurovereenkomst_afgesloten_op, see MONUMENT_CONTRACTDATUM.
 */
const MONUMENT_SOORT: Record<
  string,
  GebruikersinvoerPayload["monument_soort"]
> = {
  // Both get the same huurprijsopslag in the backend.
  gemeentelijk_of_provinciaal_monument: "gemeentelijk_monument",
  beschermd_stads_en_dorpsgezicht: "beschermd_stads_of_dorpsgezicht",
  rijksmonument_contract_voor_1_juli_2024: "rijksmonument",
  rijksmonument_contract_na_1_juli_2024: "rijksmonument",
}

/**
 * TODO(puntenteller): the form asks "contract vóór/na 1 juli 2024" rather than the date
 * itself, so a date before 1 July 2024 stands in for "vóór" (the backend only compares it).
 * Replace it with the real date once the wizard asks for it.
 */
const MONUMENT_CONTRACTDATUM: Record<string, string> = {
  rijksmonument_contract_voor_1_juli_2024: "2024-06-30",
}

/** Maps the wizard's form values onto the request body of POST /puntenteller/adressen/:bagId/. */
export function mapFormValuesToPayload(
  values: GebruikersinvoerFormValues,
): GebruikersinvoerPayload {
  const { buitenruimten, parkeerruimten, losseLaadpalen } =
    mapBuitenruimtes(values)
  const monumentSoort = values.monument_soort ?? ""

  return {
    energie: values.energielabel_klasse
      ? { type: "label", waarde: values.energielabel_klasse }
      : { type: "bouwjaar" },
    is_eengezinswoning: values.type_woning
      ? values.type_woning === "Eengezinswoning"
      : null,
    ...mapBinnenruimtes(values),
    buitenruimten,
    parkeerruimten,
    completed: true,
    bouwjaar: values.bouwjaar ?? null,
    gebruiksoppervlakte: count(values.gebruiksoppervlakte),
    woz_waarde: count(values.woz_waarde),
    woz_peildatum_jaar: count(values.woz_peildatum_jaar),
    woz_kleine_nieuwbouwwoning: isJa(
      values.kleiner_dan_40_m2_opgeleverd_2018_2022,
    ),
    woz_nieuwbouw_2015_2019: isJa(values.opgeleverd_2015_tot_en_met_2019),
    woonvoorziening_handicap: isJa(
      values.voorzieningen_voor_mensen_met_handicap,
    ),
    monument: isJa(values.monument) && monumentSoort !== GEEN_MONUMENT,
    monument_soort: MONUMENT_SOORT[monumentSoort] ?? null,
    huurovereenkomst_afgesloten_op:
      MONUMENT_CONTRACTDATUM[monumentSoort] ?? null,
    zorgwoning: isJa(values.zorgwoning),
    // TODO(puntenteller): assumed to be the question behind the backend's nieuwbouw
    // huurprijsopslag; the backend doesn't say what nieuwbouw means. Check with the backend.
    nieuwbouw: isJa(values.in_gebruik_genomen_na_1_juli_2024),
    bijzondere_voorziening_intercom_met_beeld: isJa(
      values.bijzondere_voorziening_intercom_met_beeld,
    ),
    bijzondere_voorziening_laadpalen: losseLaadpalen,
  }
}
