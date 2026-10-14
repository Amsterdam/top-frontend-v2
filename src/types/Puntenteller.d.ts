type WozWaarde = {
  peildatum: string
  vastgestelde_waarde: number
}

/** The most recent energielabel registration of the address, from the EP-Online data. */
type PuntentellerEnergie = {
  bouwjaar: number | null
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
  gebruiksoppervlakte: number | null
  woz_waarden: WozWaarde[] | null
  wozobjectnummer: number | null
  energie: PuntentellerEnergie | null
}

type PuntentellerRegel = {
  omschrijving: string
  punten: number
  /** Label of the ruimte, e.g. "Slaapkamer"; null for a regel over the whole rubriek. */
  ruimte: string | null
  aantal: number | null
  factor: number | null
}

type PuntentellerRubriek = {
  naam: string
  /** Sum of the punten of its regels. */
  punten: number
  regels: PuntentellerRegel[]
}

/** Response of POST /puntenteller/adressen/:bagId/ (PuntentellerResultaatSerializer). */
type PuntentellerResultaat = {
  /** Sum of the punten of all rubrieken and opslagen. */
  totaal_punten: number
  rubrieken: PuntentellerRubriek[]
  opslagen: PuntentellerRubriek[]
  /** Opslagen on the maximale huurprijs; they don't count in the punten. */
  huurprijsopslagen: { naam: string; procent: number }[]
  huurprijsopslag_procent: number
  /** Maximale kale huur per maand; null when no huurprijstabel applies. */
  maximale_huurprijs: {
    bedrag: number
    met_opslagen: number
    /** ISO date of the huurprijstabel used. */
    prijspeil: string
  } | null
}
