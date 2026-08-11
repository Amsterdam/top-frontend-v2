type BAGPdokAddress = {
  weergavenaam: string
  adrestype: string
  gemeentenaam: string
  nummeraanduiding_id: string
  adresseerbaarobject_id: string
  straatnaam: string
  huisnummer: number
  huisletter?: string
  huisnummertoevoeging?: string
  postcode: string
  woonplaatsnaam: string
  centroide_ll: string
  score: number
}

type BAGPdokResponse = {
  response: {
    numFound: number
    start: number
    maxScore: number
    docs: BAGPdokAddress[]
  }
}
