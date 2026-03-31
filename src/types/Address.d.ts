type District = {
  id: number
  name: string
}

type Address = {
  id: number
  full_address: string
  bag_id: string
  district: District
  housing_corporation: number | null
  lat: number
  lng: number
  number: number
  nummeraanduiding_id: string
  postal_code: string
  street_name: string
  suffix: string
  suffix_letter: string
}

type Melding = {
  gasten: number
  nachten: number
  gemaaktOp: string
  isAangepast: boolean
  isVerwijderd: boolean
  startDatum: string
  eindDatum: string
}

type Registration = Omit<
  components["schemas"]["RegistrationDetails"],
  "requester"
> & {
  requester: {
    personalDetails: {
      firstName: string
      lastNamePrefix: string | null
      lastName: string
    }
    email: string
  }
}

type HousingCorporation = components["schemas"]["HousingCorporation"]

type Permit = Omit<components["schemas"]["Powerbrowser"], "datuM_TOT"> & {
  omschrijvinG_KORT?: string | null // PowerBrowser's omschrijvinG_KORT field is missing in the schema.
  datuM_TOT?: string | null // PowerBrowser's datuM_TOT field is optional.
}

type PermitGrantedStatus = "GRANTED" | "NOT_GRANTED" | "UNKNOWN"

type PermitDecos = {
  permit_granted: PermitGrantedStatus
  permit_type: string
  raw_data?: {
    text45?: string
    mark?: string
    subject1?: string
    document_date?: string
    processed?: boolean
    date5?: string
    sequence?: number
    company?: string
    firstname?: string
    text16?: string
    num22?: number
    text6?: string
    dfunction?: string
    date6?: string
    date7?: string
    itemtype_key?: string
    parentKey?: string
    itemrel_key?: string
  }
  details?: {
    PERMIT_NAME?: string
    SUBJECT?: string
    ADDRESS?: string
    RESULT?: string
    DATE_VALID_FROM?: string
    DATE_VALID_UNTIL?: string
    DATE_VALID_TO?: string
    APPLICANT?: string
    REQUEST_DATE?: string
    HOLDER?: string
  }
}
