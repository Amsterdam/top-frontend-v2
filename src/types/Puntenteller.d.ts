type WozWaarde = {
  peildatum: string
  vastgestelde_waarde: number
}

/** The most recent energielabel registration of the address, from the EP-Online data. */
type PuntentellerEnergie = {
  energielabel: string | null
  /** As EP-Online formats it, with a decimal comma, e.g. "1,13"; see parseEnergieIndex. */
  energieindex: string | null
  registratiedatum: string | null
  opnamedatum: string | null
  /** ISO date until which the measurement behind the energielabel is valid. */
  meting_geldig_tot: string | null
}

/**
 * Response of GET /puntenteller/adressen/:bagId/invoerwaarden/ (GebouwDataSerializer). Every
 * field can be null when the external source has no data for the address.
 */
type PuntentellerInvoerwaarden = {
  straat: string | null
  huisnummer: string | null
  bouwjaar: number | null
  gebruiksoppervlakte: number | null
  woz_waarden: WozWaarde[] | null
  wozobjectnummer: number | null
  energie: PuntentellerEnergie | null
}

/** Response of POST /puntenteller/adressen/:bagId/ (PuntentellerResultaatSerializer). */
type PuntentellerResultaat = {
  /** Punten per rubriek, e.g. { vertrekken: 32, keuken: 7, woz: 40.5 }. */
  rubrieken: Record<string, number>
  energieprestatie_berekening: {
    categorie: string
    punten: number
    punten_voor_monumentcorrectie: number
    monumentcorrectie_toegepast: boolean
  }
  totaal_punten_bruto: number
  correcties: Record<string, number | boolean | string | null>
  totaal_punten_na_caps: number
}
