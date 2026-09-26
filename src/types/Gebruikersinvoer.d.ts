/** What the energieprestatie is based on, see selectEnergieGrondslag. */
type EnergieType = "label" | "index" | "bouwjaar"

type BinnenruimteType =
  | "Woonkamer"
  | "Keuken"
  | "Woonkamer met open keuken"
  | "Slaapkamer"
  | "Badkamer"
  | "Toiletruimte"
  | "Woon- en slaapkamer"
  | "Slaapkamer met wastafel, douche of bad"
  | "Woon- en slaapkamer met keuken"
  | "Overloop"
  | "Kleine kamer (kleiner dan 4 m²)"
  | "Wasruimte / bijkeuken"
  | "Berging"
  | "Garage"
  | "Kelder"
  | "Zolder"
  | "Zolderberging met vaste trap"
  | "Zolderberging zonder vaste trap"
  | "Bad, douche of wastafel in andere ruimte"
  | "Keuken in andere ruimte"

type BuitenruimteType =
  | "Balkon"
  | "Dakterras"
  | "Voortuin / zijtuin"
  | "Achtertuin"
  | "Loggia"
  | "Parkeerruimte"

type Buitenruimte = {
  type: BuitenruimteType
  lengte: number | null
  breedte: number | null
  oppervlakte: number | null
  /** How many addresses use this buitenruimte; 1 means it's privé. */
  aantal_adressen: number | null
  // Parkeerruimte only (instead of lengte/breedte/oppervlakte): parkeerplekken "0".."50",
  // laadpaal "0".."5"
  parkeerplekken_afgesloten_parkeergarage?: string
  parkeerplekken_buiten_met_dak?: string
  parkeerplekken_buiten_zonder_dak?: string
  laadpaal?: string
}

/**
 * The voorzieningen of one binnenruimte. Which ones a room has depends on its type (the extra
 * sections in BINNENRUIMTE_CONFIG); the rest stay undefined. The names follow the backend's
 * vertrek fields. Counts are "0".."max" strings, see fieldDefinitions.ts.
 */
type BinnenruimteVoorzieningen = {
  // Sanitair
  /** "douche", "bad" or "baddouche"; "" while unanswered. */
  douche_bad?: string
  wastafel?: string
  meerpersoons_wastafel?: string
  toilet_hangend?: string
  toilet_normaal?: string
  bubbelfunctie_bad?: string
  volledige_afscheiding_douche?: string
  handdoekenradiator?: string
  kast_bij_wastafel?: string
  kastruimte?: string
  stopcontacten?: string
  eenhandsmengkraan?: string
  thermostatische_mengkraan?: string

  // Keuken
  /** "korter_dan_1_meter", "1_tot_2_meter" or "langer_dan_2_meter"; "" while unanswered. */
  aanrechtlengte?: string
  inbouw_afzuiginstallatie?: string
  inbouw_kookplaat_inductie?: string
  inbouw_kookplaat_keramisch?: string
  inbouw_kookplaat_gas?: string
  inbouw_koelkast?: string
  inbouw_vrieskast?: string
  inbouw_oven_elektrisch?: string
  inbouw_oven_gas?: string
  inbouw_magnetron?: string
  inbouw_vaatwasmachine?: string
  extra_kastruimte?: string
  eenhandsmengkraan_kookfunctie?: string
  thermostatische_mengkraan_kookfunctie?: string
  kokendwaterfunctie?: string
}

type Binnenruimte = BinnenruimteVoorzieningen & {
  type: BinnenruimteType
  lengte: number | null
  breedte: number | null
  oppervlakte: number | null
  verwarmd: string | null
  verkoeld: string | null
}

type GebruikersinvoerFormValues = {
  // Binnenruimtes
  binnenruimtes: Binnenruimte[]

  // Buitenruimtes (a Parkeerruimte holds the parkeerplekken and laadpalen)
  buitenruimtes: Buitenruimte[]

  // Woninggegevens (overlap with PuntentellerInvoerwaarden, part of the same record)
  bouwjaar: number | null
  /** What the energieprestatie is based on; decides which of the three fields below is sent. */
  energie_type: EnergieType
  energielabel_klasse: string
  energie_index: number | null
  gebruiksoppervlakte: number
  woz_waarde: number
  woz_peildatum_jaar: number
  type_woning: string | null
  gemeenschappelijke_binnenruimtes: string | null

  // Bijzonderheden
  monument: boolean
  monument_soort: string | null
  // Ja/nee-vragen ("true"/"false"), see JA_NEE_VRAGEN in fieldDefinitions.ts
  zorgwoning: string
  voorzieningen_voor_mensen_met_handicap: string
  opgeleverd_2015_tot_en_met_2019: string
  in_gebruik_genomen_na_1_juli_2024: string
  kleiner_dan_40_m2_opgeleverd_2018_2022: string
  bijzondere_voorziening_intercom_met_beeld: string
}

type Gebruikersinvoer = GebruikersinvoerFormValues & {
  id: number
  completed: boolean
}
