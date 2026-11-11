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
  /** From the monumentenregister; also false when it couldn't be fetched. */
  monument: boolean
  monument_soort: "rijksmonument" | "gemeentelijk_monument" | null
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

/** The berekening of a puntentelling (PuntentellerResultaatSerializer): its punten_resultaat. */
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

/** The toezichthouder who made a puntentelling (UserSerializer). */
type PuntentellingAuthor = {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  /** E.g. "T. Toezicht". */
  full_name: string
}

/**
 * A puntentelling in the list of an address (GET /puntenteller/adressen/:bagId/,
 * PuntentellingLijstSerializer): only what the overview shows.
 */
type Puntentelling = {
  id: number
  /** Null once that user no longer exists. */
  author: PuntentellingAuthor | null
  /** Whether the author is done with it; it can still be changed either way. */
  completed: boolean
  /** ISO datetime it was made. */
  created: string
  /** ISO datetime it was last saved. */
  updated: string
  punten: number
}

/**
 * A ruimte as the backend saved it: its naam, ruimte_m2 and whichever voorzieningen (counts)
 * and flags its kind of ruimte has. Ruimtes saved before weergavenaam and the kookfunctie
 * fields existed lack those.
 */
type SavedRuimte = {
  naam: string
  /** The form's BinnenruimteType or BuitenruimteType; missing or null on older ones. */
  weergavenaam?: string | null
  /** A decimal string, e.g. "12.50"; missing on a parkeerruimte. */
  ruimte_m2?: string
  verwarmd?: boolean
  gekoeld?: boolean
  aantal_adressen_met_toegang_en_gebruiksrecht?: number
  /** Zolder only. */
  heeft_vaste_trap?: boolean
  /** Keuken only; a decimal string. */
  aanrechtlengte_meters?: string | null
  // Parkeerruimte only.
  aantal_gesloten_garage_bij_complex?: number
  aantal_buiten_bij_complex_met_dak?: number
  aantal_buiten_bij_complex_zonder_dak?: number
  aantal_laadpalen?: number
  /** The voorzieningen, e.g. wastafel or inbouw_koelkast: counts. */
  [voorziening: string]: unknown
}

/**
 * A whole puntentelling with its saved invoer and berekening (GebruikersinvoerResponseSerializer):
 * GET and PATCH /puntenteller/puntentellingen/:id/ and POST /puntenteller/adressen/:bagId/.
 */
type PuntentellingDetail = Puntentelling & {
  /** The same as punten. */
  punten_resultaat: PuntentellerResultaat
  /** Only the chosen grondslag; null when is_eengezinswoning isn't known. */
  energie: {
    type: EnergieType
    /** The energielabel, the energie-index or the bouwjaar. */
    waarde: string | number | null
    heeft_energieprestatievergoeding: boolean
  } | null
  is_eengezinswoning: boolean | null
  vertrekken: SavedRuimte[]
  overige_ruimten: SavedRuimte[]
  verkeersruimten: SavedRuimte[]
  buitenruimten: SavedRuimte[]
  parkeerruimten: SavedRuimte[]
  huidige_huurprijs: number | null
  gebruiksoppervlakte: number
  woz_waarde: number
  woz_peildatum_jaar: number
  woz_kleine_nieuwbouwwoning: boolean
  woz_nieuwbouw_2015_2019: boolean
  woonvoorziening_handicap: boolean
  woonvoorziening_handicap_netto_investering: number | null
  monument: boolean
  monument_soort: GebruikersinvoerPayload["monument_soort"]
  /** ISO date. */
  huurovereenkomst_afgesloten_op: string | null
  zorgwoning: boolean
  nieuwbouw: boolean
  bijzondere_voorziening_intercom_met_beeld: boolean
  bijzondere_voorziening_laadpalen: number
}
