import { BUITENRUIMTE_TYPES, GEEN_MONUMENT } from "../fieldDefinitions"
import {
  BINNENRUIMTE_CONFIG,
  emptyVoorzieningen,
} from "../StepBinnenruimtes/binnenruimteConfig"
import { emptyVlak, toNumber } from "./oppervlakte"

/**
 * The type of a binnenruimte saved without (a known) weergavenaam, by its backend naam: the
 * type mapFormValuesToPayload sends that naam for first.
 */
const STANDAARD_BINNENRUIMTE_TYPE: Record<string, BinnenruimteType> = {
  woonkamer: "Woonkamer",
  slaapkamer: "Slaapkamer",
  wasruimte_bijkeuken: "Wasruimte / bijkeuken",
  badkamer: "Badkamer",
  keuken: "Keuken",
  toiletruimte: "Toiletruimte",
  berging: "Berging",
  kelder: "Kelder",
  prive_parkeerruimte: "Garage",
  zolder: "Zolder",
  verkeersruimte: "Overloop",
}

const isBinnenruimteType = (type: unknown): type is BinnenruimteType =>
  typeof type === "string" && Object.hasOwn(BINNENRUIMTE_CONFIG, type)

const isBuitenruimteType = (type: unknown): type is BuitenruimteType =>
  BUITENRUIMTE_TYPES.includes(type as BuitenruimteType)

function binnenruimteType(ruimte: SavedRuimte): BinnenruimteType {
  if (isBinnenruimteType(ruimte.weergavenaam)) return ruimte.weergavenaam
  if (ruimte.naam === "zolder" && ruimte.heeft_vaste_trap === false) {
    return "Zolderberging zonder vaste trap"
  }
  return STANDAARD_BINNENRUIMTE_TYPE[ruimte.naam] ?? "Berging"
}

/** The form's douche/bad choice back from the counts; "" (unanswered) without any. */
function doucheBad(ruimte: SavedRuimte) {
  if (Number(ruimte.baddouche) > 0) return "baddouche"
  if (Number(ruimte.bad) > 0) return "bad"
  if (Number(ruimte.douche) > 0) return "douche"
  return ""
}

/**
 * The form's aanrechtlengte back from the meters mapFormValuesToPayload sent for it, by the
 * backend's thresholds (< 1 m, 1 to 2 m inclusive, > 2 m); "" (unanswered) without any.
 */
function aanrechtlengte(meters: string | null | undefined) {
  const value = toNumber(meters)
  if (value === null) return ""
  if (value < 1) return "korter_dan_1_meter"
  if (value <= 2) return "1_tot_2_meter"
  return "langer_dan_2_meter"
}

/** The voorzieningen the type asks, as the form holds them: counts as "0".."max" strings. */
function voorzieningen(
  type: BinnenruimteType,
  ruimte: SavedRuimte,
): BinnenruimteVoorzieningen {
  return Object.fromEntries(
    Object.keys(emptyVoorzieningen(type)).map((name) => {
      if (name === "douche_bad") return [name, doucheBad(ruimte)]
      if (name === "aanrechtlengte") {
        return [name, aanrechtlengte(ruimte.aanrechtlengte_meters)]
      }
      return [name, String(Math.round(Number(ruimte[name]) || 0))]
    }),
  )
}

/**
 * One vlak holding the total: the lengte and breedte aren't saved. Without an oppervlakte (a
 * type that doesn't ask it) an empty vlak, as for a new ruimte.
 */
const vlakken = (oppervlakte: number | null): Vlak[] => [
  { ...emptyVlak(), oppervlakte },
]

function toBinnenruimte(ruimte: SavedRuimte): Binnenruimte {
  const type = binnenruimteType(ruimte)
  const {
    hasOppervlakte = true,
    hasVerwarmd = true,
    hasVerkoeld = true,
  } = BINNENRUIMTE_CONFIG[type]
  const oppervlakte = hasOppervlakte ? toNumber(ruimte.ruimte_m2) : null
  // Where they aren't asked, the values VerwarmdVerkoeldFields forces them to.
  const verwarmd = hasVerwarmd ? String(Boolean(ruimte.verwarmd)) : "true"
  const verkoeld =
    hasVerkoeld && verwarmd === "true"
      ? String(Boolean(ruimte.gekoeld))
      : "false"

  return {
    ...voorzieningen(type, ruimte),
    type,
    vlakken: vlakken(oppervlakte),
    oppervlakte,
    verwarmd,
    verkoeld,
    aantal_adressen: ruimte.aantal_adressen_met_toegang_en_gebruiksrecht ?? 1,
  }
}

function toBuitenruimte(ruimte: SavedRuimte): Buitenruimte {
  const fallback =
    ruimte.naam === "gemeenschappelijke_buitenruimte" ? "Achtertuin" : "Balkon"
  const type = isBuitenruimteType(ruimte.weergavenaam)
    ? ruimte.weergavenaam
    : fallback
  const oppervlakte = toNumber(ruimte.ruimte_m2)

  return {
    type,
    vlakken: vlakken(oppervlakte),
    oppervlakte,
    aantal_adressen: ruimte.aantal_adressen_met_toegang_en_gebruiksrecht ?? 1,
  }
}

const toParkeerruimte = (ruimte: SavedRuimte): Buitenruimte => ({
  type: "Parkeerruimte",
  vlakken: [emptyVlak()],
  oppervlakte: null,
  aantal_adressen: ruimte.aantal_adressen_met_toegang_en_gebruiksrecht ?? 1,
  parkeerplekken_afgesloten_parkeergarage: String(
    ruimte.aantal_gesloten_garage_bij_complex ?? 0,
  ),
  parkeerplekken_buiten_met_dak: String(
    ruimte.aantal_buiten_bij_complex_met_dak ?? 0,
  ),
  parkeerplekken_buiten_zonder_dak: String(
    ruimte.aantal_buiten_bij_complex_zonder_dak ?? 0,
  ),
  laadpaal: String(ruimte.aantal_laadpalen ?? 0),
})

/**
 * Only the chosen grondslag is saved, so only that field is set: the others keep what the
 * address's invoerwaarden filled in.
 */
function energie(
  energie: PuntentellingDetail["energie"],
): Partial<GebruikersinvoerFormValues> {
  switch (energie?.type) {
    case "label":
      return {
        energie_type: "label",
        energielabel_klasse: String(energie.waarde ?? ""),
      }
    case "index":
      return { energie_type: "index", energie_index: toNumber(energie.waarde) }
    case "bouwjaar":
      return { energie_type: "bouwjaar", bouwjaar: toNumber(energie.waarde) }
    default:
      return {}
  }
}

/** The form's monument option back from monument_soort and huurovereenkomst_afgesloten_op. */
function monumentSoort(puntentelling: PuntentellingDetail): string {
  switch (puntentelling.monument_soort) {
    case "gemeentelijk_monument":
    case "provinciaal_monument":
      return "gemeentelijk_of_provinciaal_monument"
    case "beschermd_stads_of_dorpsgezicht":
      return "beschermd_stads_en_dorpsgezicht"
    case "rijksmonument": {
      const contractdatum = puntentelling.huurovereenkomst_afgesloten_op
      return contractdatum !== null && contractdatum < "2024-07-01"
        ? "rijksmonument_contract_voor_1_juli_2024"
        : "rijksmonument_contract_na_1_juli_2024"
    }
    default:
      return GEEN_MONUMENT
  }
}

const jaNee = (value: boolean) => String(Boolean(value))

/**
 * A saved puntentelling back as form values, to reopen it in the wizard: the reverse of
 * mapFormValuesToPayload. What the backend doesn't keep comes back as follows:
 * - the type of a ruimte from its weergavenaam, or the standaard type for its naam when it
 *   has none (saved before weergavenaam existed);
 * - the vlakken as one vlak with the total oppervlakte;
 * - the ruimtes grouped per backend list (vertrekken, overige ruimten, verkeersruimten; then
 *   buitenruimten, parkeerruimten), not in the order they were added;
 * - of the energie only the chosen grondslag (see energie above).
 */
export function mapPuntentellingToFormValues(
  puntentelling: PuntentellingDetail,
): Partial<GebruikersinvoerFormValues> {
  return {
    binnenruimtes: [
      ...puntentelling.vertrekken,
      ...puntentelling.overige_ruimten,
      ...puntentelling.verkeersruimten,
    ].map(toBinnenruimte),
    buitenruimtes: [
      ...puntentelling.buitenruimten.map(toBuitenruimte),
      ...puntentelling.parkeerruimten.map(toParkeerruimte),
    ],

    ...energie(puntentelling.energie),
    gebruiksoppervlakte: puntentelling.gebruiksoppervlakte,
    woz_waarde: puntentelling.woz_waarde,
    woz_peildatum_jaar: puntentelling.woz_peildatum_jaar,
    type_woning:
      puntentelling.is_eengezinswoning === null
        ? null
        : puntentelling.is_eengezinswoning
          ? "Eengezinswoning"
          : "Meergezinswoning",
    huidige_huurprijs: puntentelling.huidige_huurprijs,

    monument: puntentelling.monument,
    monument_soort: monumentSoort(puntentelling),
    zorgwoning: jaNee(puntentelling.zorgwoning),
    woonvoorziening_handicap: jaNee(puntentelling.woonvoorziening_handicap),
    woonvoorziening_handicap_netto_investering:
      puntentelling.woonvoorziening_handicap_netto_investering === null
        ? ""
        : String(puntentelling.woonvoorziening_handicap_netto_investering),
    opgeleverd_2015_tot_en_met_2019: jaNee(
      puntentelling.woz_nieuwbouw_2015_2019,
    ),
    in_gebruik_genomen_na_1_juli_2024: jaNee(puntentelling.nieuwbouw),
    kleiner_dan_40_m2_opgeleverd_2018_2022: jaNee(
      puntentelling.woz_kleine_nieuwbouwwoning,
    ),
    bijzondere_voorziening_intercom_met_beeld: jaNee(
      puntentelling.bijzondere_voorziening_intercom_met_beeld,
    ),
  }
}
