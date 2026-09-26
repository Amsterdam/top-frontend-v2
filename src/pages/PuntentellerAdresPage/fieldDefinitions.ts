/**
 * Field labels per Gebruikersinvoer group, shared between the wizard steps (input) and
 * StepOverzicht (summary), so labels only need to be maintained in one place.
 */

/** A voorziening of a binnenruimte, stored on the room itself (binnenruimtes.<index>.<name>). */
type FieldBase = {
  name: keyof BinnenruimteVoorzieningen
  label: string
  /** Most fields default to "0" and don't need an answer; pass a message to require one. */
  required?: string
}

/**
 * The default: a count field rendered as a QuantityCheckbox (checkbox with an aantal stepper,
 * 1 through `max`, which defaults to 5). The stored value is the "0".."max" string the
 * puntenberekening expects. The count fields of a section are shown together as a single-column
 * QuantityCheckboxList.
 */
export type CountField = FieldBase & {
  max?: number
}

/** A field with its own fixed, non-numeric options (e.g. a size bucket), rendered as a select. */
export type OptionsSelectField = FieldBase & {
  options: { label: string; value: string }[]
  /** Styles the label as nested under a fieldset legend; passed straight to SelectControl. */
  inFieldSet?: boolean
}

export type FieldDefinition = CountField | OptionsSelectField

/** A labeled group of fields shown together under their own heading/description. */
export type FieldSection = {
  heading: string
  description?: string
  fields: readonly FieldDefinition[]
}

export const WONINGGEGEVENS_FIELDS = [
  { name: "gebruiksoppervlakte", label: "Gebruiksoppervlakte (m²)" },
  { name: "woz_waarde", label: "WOZ-waarde (€)" },
  { name: "woz_peildatum_jaar", label: "WOZ-peildatum (jaar)" },
  { name: "energie_type", label: "Energieprestatie" },
  { name: "type_woning", label: "Woonvorm" },
  {
    name: "gemeenschappelijke_binnenruimtes",
    label: "Gemeenschappelijke binnenruimtes",
  },
] as const

// Shared between BADKAMER_SECTIONS and SLAAPKAMER_SANITAIR_SECTIONS.
const DOUCHE_BAD_SECTION = {
  heading: "Douche, bad of combinatie",
  fields: [
    {
      name: "douche_bad",
      label: "Is er een douche, een bad of een combinatie van beide?",
      options: [
        { label: "Maak een keuze", value: "" },
        { label: "Douche", value: "douche" },
        { label: "Bad (met handdouche)", value: "bad" },
        { label: "Bad en aparte douche", value: "baddouche" },
      ],
      inFieldSet: true,
      required: "Een douche of bad is verplicht",
    },
  ],
} as const satisfies FieldSection

const WASTAFEL_FIELD = {
  name: "wastafel",
  label: "Wastafel",
} as const satisfies FieldDefinition

const MEERPERSOONS_WASTAFEL_FIELD = {
  name: "meerpersoons_wastafel",
  label: "Meerpersoons wastafel (min. 70 cm en 2 kranen)",
} as const satisfies FieldDefinition

/** The sections shown for a Badkamer binnenruimte in the wizard. */
export const BADKAMER_SECTIONS = [
  DOUCHE_BAD_SECTION,
  {
    heading: "Toiletvoorzieningen in de badkamer",
    fields: [
      {
        name: "toilet_hangend",
        label: "Hangend toilet",
      },
      {
        name: "toilet_normaal",
        label: "Normaal toilet",
      },
    ],
  },
  {
    heading: "Bad- en douchevoorzieningen",
    fields: [
      {
        name: "volledige_afscheiding_douche",
        label: "Volledige afscheiding van de douche",
      },
      {
        name: "bubbelfunctie_bad",
        label: "Bubbelfunctie bad",
      },
    ],
  },
  {
    heading: "Wastafelvoorzieningen",
    fields: [
      WASTAFEL_FIELD,
      {
        name: "eenhandsmengkraan",
        label: "Eénhandsmengkraan",
      },
      {
        name: "stopcontacten",
        label: "Stopcontacten",
      },
      {
        name: "thermostatische_mengkraan",
        label: "Thermostatische mengkraan",
      },
      MEERPERSOONS_WASTAFEL_FIELD,
    ],
  },
  {
    heading: "Extra voorzieningen",
    fields: [
      {
        name: "kast_bij_wastafel",
        label: "Wastafelkast- of meubel voor een wastafel",
      },
      {
        name: "kastruimte",
        label: "Kastruimte (min. 40 x 40 cm)",
      },
      {
        name: "handdoekenradiator",
        label: "Handdoekenradiator",
      },
    ],
  },
] as const satisfies readonly FieldSection[]

/** Subset of BADKAMER_SECTIONS shown for a "Slaapkamer met wastafel, douche of bad" binnenruimte. */
export const SLAAPKAMER_SANITAIR_SECTIONS = [
  DOUCHE_BAD_SECTION,
  {
    heading: "Wastafelvoorzieningen",
    fields: [WASTAFEL_FIELD, MEERPERSOONS_WASTAFEL_FIELD],
  },
] as const satisfies readonly FieldSection[]

export const TOILETRUIMTE_SECTIONS = [
  {
    heading: "Voorzieningen",
    description: "Geef aan wat er aanwezig is in de toiletruimte.",
    fields: [
      {
        name: "toilet_hangend",
        label: "Hangend toilet",
      },
      {
        name: "wastafel",
        label: "Wastafel (fonteintje)",
        max: 1,
      },
    ],
  },
] as const satisfies readonly FieldSection[]

export const KEUKEN_SECTIONS = [
  {
    heading: "Lengte aanrecht",
    description:
      "Meet over het midden van het bovenblad. Tel ook ingebouwde spoelbakken en inbouwkookplaten mee.",
    fields: [
      {
        name: "aanrechtlengte",
        label: "Hoe lang is het aanrecht?",
        options: [
          { label: "Maak een keuze", value: "" },
          { label: "Korter dan 1 meter", value: "korter_dan_1_meter" },
          { label: "1 tot 2 meter", value: "1_tot_2_meter" },
          { label: "Langer dan 2 meter", value: "langer_dan_2_meter" },
        ],
        required: "Geef aan wat de lengte van het aanrecht is",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Voorzieningen in de keuken",
    description:
      "Geef hier aan welke voorzieningen in de keuken aanwezig zijn.",
    fields: [
      {
        name: "inbouw_afzuiginstallatie",
        label: "Inbouw afzuiginstallatie",
      },
      {
        name: "inbouw_kookplaat_inductie",
        label: "Inbouw kookplaat inductie",
      },
      {
        name: "inbouw_kookplaat_keramisch",
        label: "Inbouw kookplaat keramisch",
      },
      {
        name: "inbouw_kookplaat_gas",
        label: "Inbouw kookplaat gas",
      },
    ],
  },
  {
    heading: "Kranen",
    description:
      "Luxere kranen hebben soms een functie voor kokend water. Kies de juiste kraan als dit van toepassing is.",
    fields: [
      {
        name: "eenhandsmengkraan",
        label: "Eénhandsmengkraan",
      },
      {
        name: "thermostatische_mengkraan",
        label: "Thermostatische mengkraan",
      },
      {
        name: "eenhandsmengkraan_kookfunctie",
        label: "Eénhandsmengkraan met kookfunctie",
      },
      {
        name: "thermostatische_mengkraan_kookfunctie",
        label: "Thermostatische mengkraan met kookfunctie",
      },
      {
        name: "kokendwaterfunctie",
        label: "Kraan met kookfunctie",
        max: 2,
      },
    ],
  },
  {
    heading: "Koelen",
    description:
      "Is de koelkast met de vriezer als inbouw gecombineerd? Geef deze dan op als twee aparte voorzieningen: een inbouwkoelkast en een inbouwvriezer.",
    fields: [
      {
        name: "inbouw_koelkast",
        label: "Inbouw koelkast",
      },
      {
        name: "inbouw_vrieskast",
        label: "Inbouw vrieskast",
      },
    ],
  },
  {
    heading: "Verwarmen",
    description:
      "Is de inbouwoven ook een magnetron? Geef dan beide voorzieningen apart op.",
    fields: [
      {
        name: "inbouw_magnetron",
        label: "Inbouw magnetron",
      },
      {
        name: "inbouw_oven_gas",
        label: "Inbouw oven gas",
      },
      {
        name: "inbouw_oven_elektrisch",
        label: "Inbouw oven elektrisch",
      },
    ],
  },
  {
    heading: "Extra voorzieningen",
    description:
      "De keuken moet standaard 100 cm brede inbouwkastruimte hebben. Extra kastruimte telt mee als deze minimaal 60 cm hoog is. Bereken de extra kastruimte door de totale extra breedte in cm door 60 te delen en naar beneden af te ronden. Bijvoorbeeld: 210 cm extra kastruimte ÷ 60 = 3 extra kasten.",
    fields: [
      {
        name: "inbouw_vaatwasmachine",
        label: "Inbouw vaatwasmachine",
      },
      {
        name: "extra_kastruimte",
        label: "Extra kastruimte (per strekkende 60 cm)",
        max: 10,
      },
    ],
  },
] as const satisfies readonly FieldSection[]

/** The parkeerplekken per soort asked for a Parkeerruimte buitenruimte. */
export const PARKEERPLEK_FIELDS = [
  {
    name: "parkeerplekken_afgesloten_parkeergarage",
    label: "In afgesloten parkeergarage behorende tot het complex",
  },
  {
    name: "parkeerplekken_buiten_met_dak",
    label: "Buiten met dak behorend bij het complex",
  },
  {
    name: "parkeerplekken_buiten_zonder_dak",
    label: "Buiten zonder dak behorend tot het complex",
  },
] as const

export const GEEN_MONUMENT = "geen_monument"

export const MONUMENT_SOORT_OPTIONS = [
  {
    label: "Gemeentelijk of provinciaal monument",
    value: "gemeentelijk_of_provinciaal_monument",
  },
  {
    label: "Beschermd stads- en dorpsgezicht",
    value: "beschermd_stads_en_dorpsgezicht",
  },
  {
    label: "Rijksmonument (contract vóór 1 juli 2024)",
    value: "rijksmonument_contract_voor_1_juli_2024",
  },
  {
    label: "Rijksmonument (contract na 1 juli 2024)",
    value: "rijksmonument_contract_na_1_juli_2024",
  },
  { label: "Geen monument", value: GEEN_MONUMENT },
]

export const JA_NEE_OPTIONS = [
  { label: "Ja", value: "true" },
  { label: "Nee", value: "false" },
]

/** Ja/nee questions asked in StepBijzonderheden, all required and defaulting to nee (see
 * useGebruikersinvoerForm). */
export const JA_NEE_VRAGEN: {
  name: keyof GebruikersinvoerFormValues
  label: string
  required: string
}[] = [
  {
    name: "zorgwoning",
    label: "Is de woning een zorgwoning?",
    required: "Geef aan of de woning een zorgwoning is",
  },
  {
    name: "voorzieningen_voor_mensen_met_handicap",
    label: "Heeft de woning voorzieningen voor mensen met een handicap?",
    required:
      "Geef aan of de woning voorzieningen heeft voor mensen met een handicap",
  },
  {
    name: "opgeleverd_2015_tot_en_met_2019",
    label: "Is de woning opgeleverd in de periode 2015 tot en met 2019?",
    required: "Geef aan of de woning is opgeleverd in 2015 tot en met 2019",
  },
  {
    name: "in_gebruik_genomen_na_1_juli_2024",
    label: "Is de woning voor het eerst in gebruik genomen na 1 juli 2024?",
    required:
      "Geef aan of de woning na 1 juli 2024 voor het eerst in gebruik is genomen",
  },
  {
    name: "bijzondere_voorziening_intercom_met_beeld",
    label:
      "Heeft de woning een intercom met beeld, waarmee je kunt zien wie er voor de deur staat?",
    required: "Geef aan of de woning een intercom met beeld heeft",
  },
  {
    name: "kleiner_dan_40_m2_opgeleverd_2018_2022",
    label:
      "Is de totale oppervlakte van alle ruimtes samen kleiner dan 40 m² en is de woning opgeleverd in de periode 2018-2022?",
    required:
      "Geef aan of de woning kleiner is dan 40 m² en is opgeleverd in 2018-2022",
  },
]
