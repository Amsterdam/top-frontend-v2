export type ResidentNaam = {
  geslachtsnaam?: string
  volledigeNaam?: string
  voorletters?: string
  voornamen?: string
  voorvoegsel?: string
}

export type ResidentDatum = {
  datum?: string
  langFormaat?: string
  jaar?: number
  type?: string
}

export type Resident = {
  aNummer?: string
  burgerservicenummer?: string
  leeftijd?: number
  naam?: ResidentNaam
  geslacht?: {
    code?: string
    omschrijving?: string
  }
  geboorte?: {
    datum?: ResidentDatum
    plaats?: {
      omschrijving?: string
    }
    land?: {
      omschrijving?: string
    }
  }
  adressering?: {
    aanhef?: string
    aanschrijfwijze?: {
      naam?: string
    }
    gebruikInLopendeTekst?: string
    adresregel1?: string
    adresregel2?: string
  }
  nationaliteiten?: {
    nationaliteit?: {
      omschrijving?: string
    }
  }[]
  overlijden?: {
    datum?: ResidentDatum
  }
  verblijfplaats?: {
    type?: string
    datumVan?: {
      type?: string
      datum?: string
      langFormaat?: string
    }
    functieAdres?: {
      code?: string
      omschrijving?: string
    }
  }
  kinderen?: {
    naam?: ResidentNaam
    geboorte?: { datum?: ResidentDatum }
  }[]
  ouders?: {
    naam?: ResidentNaam
    geboorte?: { datum?: ResidentDatum }
    ouderAanduiding?: string
  }[]
  partners?: {
    naam?: ResidentNaam
    geboorte?: { datum?: ResidentDatum }
    aangaanHuwelijkPartnerschap?: { datum?: ResidentDatum }
    ontbindingHuwelijkPartnerschap?: { datum?: ResidentDatum }
    soortVerbintenis?: {
      code?: string
      omschrijving?: string
    }
  }[]
}

export type ResidentsResponse = {
  personen: Resident[]
}
