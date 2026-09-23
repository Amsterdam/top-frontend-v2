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
  "Balkon" | "Dakterras" | "Voortuin / zijtuin" | "Achtertuin" | "Loggia"

type Binnenruimte = {
  type: BinnenruimteType
  lengte: number | null
  breedte: number | null
  oppervlakte: number | null
  verwarmd: string | null
  verkoeld: string | null
}

type GebruikersinvoerFormValues = {
  // Sanitair (select "0".."5", zie BADKAMER_FIELDS in fieldDefinitions.ts)
  badkamer_toilet_hangend: string
  badkamer_toilet_normaal: string
  badkamer_wastafel: string
  badkamer_meerpersoons_wastafel: string
  badkamer_douche: string
  badkamer_bad: string
  badkamer_baddouche: string
  badkamer_bubbelfunctie_bad: string
  badkamer_volledige_afscheiding_douche: string
  badkamer_handdoekenradiator: string
  badkamer_kast_bij_wastafel: string
  badkamer_kastruimte: string
  badkamer_stopcontacten: string
  badkamer_eenhandsmengkraan: string
  badkamer_thermostatische_mengkraan: string

  // Toiletruimte (select "0".."5", zie APART_TOILET_FIELDS in fieldDefinitions.ts)
  apart_toilet_hangend: string
  apart_toilet_wastafel: string

  // Keuken (select "0".."5", zie KEUKEN_FIELDS in fieldDefinitions.ts)
  keuken_aanrechtlengte_meters: string | null
  keuken_inbouw_afzuiginstallatie: string
  keuken_inbouw_kookplaat_inductie: string
  keuken_inbouw_kookplaat_keramisch: string
  keuken_inbouw_kookplaat_gas: string
  keuken_inbouw_koelkast: string
  keuken_inbouw_vrieskast: string
  keuken_inbouw_oven_elektrisch: string
  keuken_inbouw_oven_gas: string
  keuken_inbouw_magnetron: string
  keuken_inbouw_vaatwasmachine: string
  keuken_extra_kastruimte: string
  keuken_eenhandsmengkraan: string
  keuken_thermostatische_mengkraan: string
  keuken_eenhandsmengkraan_kookfunctie: string
  keuken_thermostatische_mengkraan_kookfunctie: string
  keuken_kokendwaterfunctie: string

  // Binnenruimtes
  binnenruimtes: Binnenruimte[]
  bad_douche_wastafel_andere_ruimte: string | null
  keuken_andere_ruimte: string | null

  // Buitenruimte & parkeren
  buitenruimte_prive_buitenruimte: number
  buitenruimte_gemeenschappelijke_buitenruimte: number
  parkeerruimte_gesloten_garage_bij_complex: number
  parkeerruimte_buiten_bij_complex_met_dak: number
  parkeerruimte_buiten_bij_complex_zonder_dak: number

  // Woninggegevens (overlap met PuntentellerInvoerwaarden, onderdeel van hetzelfde record)
  energielabel_klasse: string
  gebruiksoppervlakte: number
  woz_waarde: number
  woz_peildatum_jaar: number
  type_woning: string | null
  gemeenschappelijke_binnenruimtes: string | null

  // Bijzonderheden
  monument: boolean
  monument_soort: string | null
  bijzondere_voorziening_intercom_met_beeld: number
  bijzondere_voorziening_laadpaal: number
}

type Gebruikersinvoer = GebruikersinvoerFormValues & {
  id: number
  completed: boolean
}
