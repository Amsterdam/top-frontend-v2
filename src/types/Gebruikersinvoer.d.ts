type BinnenruimteType =
  | "Woonkamer"
  | "Keuken"
  | "Woonkamer met open keuken"
  | "Slaapkamer"
  | "Badkamer"
  | "Toiletruimte"

type Binnenruimte = {
  type: BinnenruimteType
  lengte: number | null
  breedte: number | null
  oppervlakte: number | null
  verwarmd: string | null
  verkoeld: string | null
}

type GebruikersinvoerFormValues = {
  // Sanitair
  badkamer_aantal_adressen: number
  badkamer_toilet_hangend: number
  badkamer_toilet_normaal: number
  badkamer_wastafel: number
  badkamer_meerpersoons_wastafel: number
  badkamer_douche: number
  badkamer_bad: number
  badkamer_baddouche: number
  badkamer_bubbelfunctie_bad: number
  badkamer_volledige_afscheiding_douche: number
  badkamer_handdoekenradiator: number
  badkamer_kast_bij_wastafel: number
  badkamer_kastruimte: number
  badkamer_stopcontacten: number
  badkamer_eenhandsmengkraan: number
  badkamer_thermostatische_mengkraan: number
  apart_toilet_staand: number
  apart_toilet_hangend: number

  // Keuken
  keuken_aantal_adressen: number
  keuken_aanrechtlengte_meters: number | null
  keuken_inbouw_afzuiginstallatie: number
  keuken_inbouw_kookplaat_inductie: number
  keuken_inbouw_kookplaat_keramisch: number
  keuken_inbouw_kookplaat_gas: number
  keuken_inbouw_koelkast: number
  keuken_inbouw_vrieskast: number
  keuken_inbouw_oven_elektrisch: number
  keuken_inbouw_oven_gas: number
  keuken_inbouw_magnetron: number
  keuken_inbouw_vaatwasmachine: number
  keuken_extra_kastruimte: number
  keuken_eenhandsmengkraan: number
  keuken_thermostatische_mengkraan: number
  keuken_kokendwaterfunctie: number

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
