/**
 * Field labels per Gebruikersinvoer group, shared between the wizard steps (input) and
 * StepOverzicht (summary), so labels only need to be maintained in one place.
 */

type SelectFieldBase = {
  name: keyof GebruikersinvoerFormValues
  label: string
  /** Most select fields default to "0" and don't need an answer; pass a message to require one. */
  required?: string
  /** Styles the label as nested under a fieldset legend; passed straight to SelectControl. */
  inFieldSet?: boolean
}

/** A count field rendered as a select, "0" through `max` (defaults to 5). */
type CountSelectField = SelectFieldBase & {
  max?: number
}

/** A select field with its own fixed, non-numeric options (e.g. a size bucket). */
type OptionsSelectField = SelectFieldBase & {
  options: { label: string; value: string }[]
}

export type SelectField = CountSelectField | OptionsSelectField

/** A labeled group of select fields shown together under their own heading/description. */
export type FieldSection = {
  heading: string
  description?: string
  fields: readonly SelectField[]
}

/** "0".."max" as select options, e.g. for max=5: "0", "1", "2", "3", "4", "5". */
export function countOptions(max = 5) {
  return Array.from({ length: max + 1 }, (_, value) => ({
    label: String(value),
    value: String(value),
  }))
}

export const WONINGGEGEVENS_FIELDS = [
  { name: "gebruiksoppervlakte", label: "Gebruiksoppervlakte (m²)" },
  { name: "woz_waarde", label: "WOZ-waarde (€)" },
  { name: "woz_peildatum_jaar", label: "WOZ-peildatum (jaar)" },
  { name: "energielabel_klasse", label: "Energielabel" },
  { name: "type_woning", label: "Woonvorm" },
  {
    name: "gemeenschappelijke_binnenruimtes",
    label: "Gemeenschappelijke binnenruimtes",
  },
] as const

/** BADKAMER_FIELDS as the single section shown for a Badkamer binnenruimte in the wizard. */
export const BADKAMER_SECTIONS = [
  {
    heading: "Douche, bad of combinatie",

    fields: [
      {
        name: "badkamer_douche",
        label: "Is er een douche, een bad of een combinatie van beide?",
        options: [
          { label: "Maak een keuze", value: "" },
          { label: "Douche", value: "badkamer_douche" },
          { label: "Bad (met handdouche)", value: "badkamer_bad" },
          { label: "Bad en aparte douche", value: "badkamer_baddouche" },
        ],
        inFieldSet: true,
        required: "Een douche of bad is verplicht",
      },
    ],
  },
  {
    heading: "Toiletvoorzieningen in de badkamer",
    fields: [
      {
        name: "badkamer_toilet_hangend",
        label: "Hangend toilet",
        inFieldSet: true,
      },
      {
        name: "badkamer_toilet_normaal",
        label: "Normaal toilet",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Bad- en douchevoorzieningen",

    fields: [
      {
        name: "badkamer_volledige_afscheiding_douche",
        label: "Volledige afscheiding van de douche",
        inFieldSet: true,
      },
      {
        name: "badkamer_bubbelfunctie_bad",
        label: "Bubbelfunctie bad",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Wastafelvoorzieningen",
    fields: [
      { name: "badkamer_wastafel", label: "Wastafel", inFieldSet: true },
      {
        name: "badkamer_eenhandsmengkraan",
        label: "Eenhandsmengkraan",
        inFieldSet: true,
      },
      {
        name: "badkamer_stopcontacten",
        label: "Stopcontacten",
        inFieldSet: true,
      },
      {
        name: "badkamer_thermostatische_mengkraan",
        label: "Thermostatische mengkraan",
        inFieldSet: true,
      },

      {
        name: "badkamer_meerpersoons_wastafel",
        label: "Meerpersoons wastafel (min. 70 cm en 2 kranen)",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Extra voorzieningen",

    fields: [
      {
        name: "badkamer_kast_bij_wastafel",
        label: "Wastafelkast- of meubel voor een wastafel",
        inFieldSet: true,
      },
      {
        name: "badkamer_kastruimte",
        label: "Kastruimte (min. 40 x 40 cm)",
        inFieldSet: true,
      },
      {
        name: "badkamer_handdoekenradiator",
        label: "Handdoekenradiator",
        inFieldSet: true,
      },
    ],
  },
] as const satisfies readonly FieldSection[]

/** Flat view of BADKAMER_SECTIONS for StepOverzicht's summary, which doesn't care about grouping. */
export const BADKAMER_FIELDS = (
  BADKAMER_SECTIONS as readonly FieldSection[]
).flatMap((section) => section.fields)

export const TOILETRUIMTE_SECTIONS = [
  {
    heading: "Voorzieningen",
    description: "Geef aan wat er aanwezig is in de toiletruimte.",
    fields: [
      {
        name: "apart_toilet_hangend",
        label: "Hangend toilet",
        inFieldSet: true,
      },
      {
        name: "apart_toilet_wastafel",
        label: "Wastafel (fonteintje)",
        max: 1,
        inFieldSet: true,
      },
    ],
  },
] as const satisfies readonly FieldSection[]

/** Flat view of TOILETRUIMTE_SECTIONS for StepOverzicht's summary, which doesn't care about grouping. */
export const APART_TOILET_FIELDS = (
  TOILETRUIMTE_SECTIONS as readonly FieldSection[]
).flatMap((section) => section.fields)

export const KEUKEN_SECTIONS = [
  {
    heading: "Lengte aanrecht",
    description:
      "Meet over het midden van het bovenblad. Tel ook ingebouwde spoelbakken en inbouwkookplaten mee.",
    fields: [
      {
        name: "keuken_aanrechtlengte_meters",
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
        name: "keuken_inbouw_afzuiginstallatie",
        label: "Inbouw afzuiginstallatie",
        inFieldSet: true,
      },
      {
        name: "keuken_inbouw_kookplaat_inductie",
        label: "Inbouw kookplaat inductie",
        inFieldSet: true,
      },
      {
        name: "keuken_inbouw_kookplaat_keramisch",
        label: "Inbouw kookplaat keramisch",
        inFieldSet: true,
      },
      {
        name: "keuken_inbouw_kookplaat_gas",
        label: "Inbouw kookplaat, gas",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Kranen",
    description:
      "Luxere kranen hebben soms een functie voor kokend water. Kies de juiste kraan als dit van toepassing is.",
    fields: [
      {
        name: "keuken_eenhandsmengkraan",
        label: "Eénhandsmengkraan",
        inFieldSet: true,
      },
      {
        name: "keuken_thermostatische_mengkraan",
        label: "Thermostatische mengkraan",
        inFieldSet: true,
      },
      {
        name: "keuken_eenhandsmengkraan_kookfunctie",
        label: "Eénhandsmengkraan met kookfunctie",
        inFieldSet: true,
      },
      {
        name: "keuken_thermostatische_mengkraan_kookfunctie",
        label: "Thermostatische mengkraan met kookfunctie",
        inFieldSet: true,
      },
      {
        name: "keuken_kokendwaterfunctie",
        label: "Kraan met kookfunctie",
        inFieldSet: true,
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
        name: "keuken_inbouw_koelkast",
        label: "Inbouw koelkast",
        inFieldSet: true,
      },
      {
        name: "keuken_inbouw_vrieskast",
        label: "Inbouw vrieskast",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Verwarmen",
    description:
      "Is de inbouwoven ook een magnetron? Geef dan beide voorzieningen apart op.",
    fields: [
      {
        name: "keuken_inbouw_magnetron",
        label: "Inbouw magnetron",
        inFieldSet: true,
      },
      {
        name: "keuken_inbouw_oven_gas",
        label: "Inbouw oven gas",
        inFieldSet: true,
      },
      {
        name: "keuken_inbouw_oven_elektrisch",
        label: "Inbouw oven elektrisch",
        inFieldSet: true,
      },
    ],
  },
  {
    heading: "Extra voorzieningen",
    description:
      "De keuken moet standaard 100 cm brede inbouwkastruimte hebben. Extra kastruimte telt mee als deze minimaal 60 cm hoog is. Bereken de extra kastruimte door de totale extra breedte in cm door 60 te delen en naar beneden af te ronden. Bijvoorbeeld: 210 cm extra kastruimte ÷ 60 = 3 extra kasten.",
    fields: [
      {
        name: "keuken_inbouw_vaatwasmachine",
        label: "Inbouw vaatwasmachine",
        inFieldSet: true,
      },
      {
        name: "keuken_extra_kastruimte",
        label: "Extra kastruimte (per strekkende 60 cm)",
        inFieldSet: true,
        max: 10,
      },
    ],
  },
] as const satisfies readonly FieldSection[]

/** Flat view of KEUKEN_SECTIONS for StepOverzicht's summary, which doesn't care about grouping. */
export const KEUKEN_FIELDS = (
  KEUKEN_SECTIONS as readonly FieldSection[]
).flatMap((section) => section.fields)

export const BUITEN_PARKEREN_FIELDS = [
  {
    name: "buitenruimte_prive_buitenruimte",
    label: "Privé buitenruimte",
  },
  {
    name: "buitenruimte_gemeenschappelijke_buitenruimte",
    label: "Gemeenschappelijke buitenruimte",
  },
  {
    name: "parkeerruimte_gesloten_garage_bij_complex",
    label: "Gesloten garage bij complex",
  },
  {
    name: "parkeerruimte_buiten_bij_complex_met_dak",
    label: "Parkeerruimte buiten bij complex, met dak",
  },
  {
    name: "parkeerruimte_buiten_bij_complex_zonder_dak",
    label: "Parkeerruimte buiten bij complex, zonder dak",
  },
] as const

export const BIJZONDERE_VOORZIENING_FIELDS = [
  {
    name: "bijzondere_voorziening_intercom_met_beeld",
    label: "Intercom met beeld",
  },
  { name: "bijzondere_voorziening_laadpaal", label: "Laadpaal" },
] as const
