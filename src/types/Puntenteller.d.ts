type WozWaarde = {
  peildatum: string
  vastgestelde_waarde: number
}

type PuntentellerInvoerwaarden = {
  straat: string
  huisnummer: string
  bouwjaar: number
  gebruiksoppervlakte: number
  woz_waarden: WozWaarde[]
  wozobjectnummer: number
  energielabel: string
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
