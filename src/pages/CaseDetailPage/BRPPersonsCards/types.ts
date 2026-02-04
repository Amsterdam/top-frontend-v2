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
  nationaliteiten: {
    nationaliteit?: {
      omschrijving?: string
    }
  }[]
  overlijden?: {
    datum?: {
      langFormaat?: string
    }
  }
  verblijfplaats?: {
    datumVan?: {
      datum?: string
    }
  }
  kinderen?: { naam?: ResidentNaam; geboorte?: { datum?: ResidentDatum } }[]
  ouders?: { naam?: ResidentNaam }[]
  partners?: { naam?: ResidentNaam }[]
}

export type ResidentsResponse = {
  personen: Resident[]
}
