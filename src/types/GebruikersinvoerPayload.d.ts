/**
 * Request body of POST /puntenteller/adressen/:bagId/ (GebruikersinvoerRequestSerializer in
 * zaken-backend). Built from GebruikersinvoerFormValues by mapFormValuesToPayload. Decimals
 * (ruimte_m2, aanrechtlengte_meters) are strings, as DRF's DecimalField expects.
 */

type PayloadEnergie = { type: "label"; label: string } | { type: "bouwjaar" }

type PayloadSanitair = {
  wastafel: number
  meerpersoons_wastafel: number
  douche: number
  bad: number
  baddouche: number
}

type PayloadRuimte = {
  ruimte_m2: string
  verwarmd: boolean
}

type PayloadVertrekBasis = PayloadRuimte &
  PayloadSanitair & {
    gekoeld: boolean
  }

type PayloadStandaardVertrek = PayloadVertrekBasis & {
  naam: "woonkamer" | "slaapkamer" | "wasruimte_bijkeuken"
}

type PayloadBadkamerVoorzieningen = {
  toilet_hangend: number
  toilet_normaal: number
  bubbelfunctie_bad: number
  volledige_afscheiding_douche: number
  handdoekenradiator: number
  kast_bij_wastafel: number
  kastruimte: number
  stopcontacten: number
  eenhandsmengkraan: number
  thermostatische_mengkraan: number
}

type PayloadBadkamer = PayloadVertrekBasis &
  PayloadBadkamerVoorzieningen & {
    naam: "badkamer"
  }

type PayloadKeukenVoorzieningen = {
  aanrechtlengte_meters: string | null
  inbouw_afzuiginstallatie: number
  inbouw_kookplaat_inductie: number
  inbouw_kookplaat_keramisch: number
  inbouw_kookplaat_gas: number
  inbouw_koelkast: number
  inbouw_vrieskast: number
  inbouw_oven_elektrisch: number
  inbouw_oven_gas: number
  inbouw_magnetron: number
  inbouw_vaatwasmachine: number
  extra_kastruimte: number
  eenhandsmengkraan: number
  thermostatische_mengkraan: number
  kokendwaterfunctie: number
}

type PayloadKeuken = PayloadVertrekBasis &
  PayloadKeukenVoorzieningen & {
    naam: "keuken"
  }

type PayloadVertrek = PayloadStandaardVertrek | PayloadBadkamer | PayloadKeuken

type PayloadOverigeRuimteBasis = PayloadRuimte & PayloadSanitair

type PayloadStandaardOverigeRuimte = PayloadOverigeRuimteBasis & {
  naam: "berging" | "kelder" | "prive_parkeerruimte"
}

type PayloadToiletruimte = PayloadOverigeRuimteBasis & {
  naam: "toiletruimte"
  toilet_staand: number
  toilet_hangend: number
}

type PayloadZolder = PayloadOverigeRuimteBasis & {
  naam: "zolder"
  heeft_vaste_trap: boolean
}

type PayloadOverigeRuimte =
  PayloadStandaardOverigeRuimte | PayloadToiletruimte | PayloadZolder

type PayloadVerkeersruimte = PayloadRuimte & {
  naam: "verkeersruimte"
}

type PayloadBuitenruimte =
  | { naam: "prive_buitenruimte"; ruimte_m2: string }
  | {
      naam: "gemeenschappelijke_buitenruimte"
      ruimte_m2: string
      aantal_adressen_met_toegang_en_gebruiksrecht: number
    }

type GebruikersinvoerPayload = {
  energie: PayloadEnergie
  is_eengezinswoning: boolean | null
  individuele_woonruimte: boolean
  vertrekken: PayloadVertrek[]
  overige_ruimten: PayloadOverigeRuimte[]
  verkeersruimten: PayloadVerkeersruimte[]
  buitenruimten: PayloadBuitenruimte[]
  completed: boolean
  parkeerruimte_gesloten_garage_bij_complex: number
  parkeerruimte_buiten_bij_complex_met_dak: number
  parkeerruimte_buiten_bij_complex_zonder_dak: number
  bouwjaar: number | null
  gebruiksoppervlakte: number
  woz_waarde: number
  woz_peildatum_jaar: number
  woz_kleine_nieuwbouwwoning: boolean
  woz_nieuwbouw_2015_2019: boolean
  woonvoorziening_handicap: boolean
  monument: boolean
  monument_soort: string | null
  bijzondere_voorziening_intercom_met_beeld: number
  bijzondere_voorziening_laadpaal: number
}
