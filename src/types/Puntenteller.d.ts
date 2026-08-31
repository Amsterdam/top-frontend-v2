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
