import { JA_NEE_VRAGEN, REQUIRED_MESSAGES } from "../fieldDefinitions"
import { BINNENRUIMTE_CONFIG } from "../StepBinnenruimtes/binnenruimteConfig"
import { getRoomLabels } from "./getRoomLabels"

/** The wizard steps (see the steps in PuntentellerAdresPage) that hold required fields. */
export const STEP = {
  woninggegevens: 0,
  binnenruimtes: 1,
  buitenruimtes: 2,
  bijzonderheden: 3,
} as const

/** A required field that hasn't been filled in, and the step it's asked in. */
export type MissingField = {
  step: (typeof STEP)[keyof typeof STEP]
  /** The field's name in GebruikersinvoerFormValues, e.g. "binnenruimtes.2.verwarmd". */
  name: string
  message: string
}

/** Empty the way react-hook-form's `required` sees it; an unparsable number counts too. */
const isEmpty = (value: unknown) =>
  value == null ||
  value === "" ||
  (typeof value === "number" && Number.isNaN(value))

/**
 * The required fields of the whole wizard that are still empty. The steps only validate the
 * fields they render, and only the current step is rendered, so this checks the values
 * themselves. It follows the registerOptions of the fields, including the ones that are only
 * asked in some cases (the field of the chosen energie_type, the WOZ-peildatum when there are
 * peildata, the questions that depend on the ruimte's type).
 */
export function findMissingFields(
  values: GebruikersinvoerFormValues,
  invoerwaarden?: PuntentellerInvoerwaarden,
): MissingField[] {
  const missing: MissingField[] = []
  const check = (
    step: MissingField["step"],
    name: string,
    value: unknown,
    message: string,
  ) => {
    if (isEmpty(value)) missing.push({ step, name, message })
  }

  // Woninggegevens
  const woning = (
    name: keyof typeof REQUIRED_MESSAGES & keyof GebruikersinvoerFormValues,
  ) => check(STEP.woninggegevens, name, values[name], REQUIRED_MESSAGES[name])
  if (invoerwaarden?.woz_waarden?.length) woning("woz_peildatum_jaar")
  woning("woz_waarde")
  woning("energie_type")
  if (values.energie_type === "label") woning("energielabel_klasse")
  if (values.energie_type === "index") woning("energie_index")
  if (values.energie_type === "bouwjaar") woning("bouwjaar")
  woning("type_woning")
  woning("gemeenschappelijke_binnenruimtes")

  // Binnenruimtes; verwarmd and verkoeld are forced to a value where they aren't asked (see
  // VerwarmdVerkoeldFields), so they're only required where they are.
  const binnenruimtes = values.binnenruimtes ?? []
  const binnenLabels = getRoomLabels(binnenruimtes)
  binnenruimtes.forEach((ruimte, index) => {
    const {
      hasOppervlakte = true,
      hasVerwarmd = true,
      hasVerkoeld = true,
      extra = [],
    } = BINNENRUIMTE_CONFIG[ruimte.type]
    const room = (field: string, value: unknown, message: string) =>
      check(
        STEP.binnenruimtes,
        `binnenruimtes.${index}.${field}`,
        value,
        `${binnenLabels[index]}: ${message}`,
      )

    if (hasOppervlakte) {
      room("oppervlakte", ruimte.oppervlakte, REQUIRED_MESSAGES.oppervlakte)
    }
    if (hasVerwarmd) {
      room("verwarmd", ruimte.verwarmd, REQUIRED_MESSAGES.verwarmd)
    }
    if (hasVerkoeld && ruimte.verwarmd === "true") {
      room("verkoeld", ruimte.verkoeld, REQUIRED_MESSAGES.verkoeld)
    }
    for (const field of extra.flatMap((section) => section.fields)) {
      if (field.required) room(field.name, ruimte[field.name], field.required)
    }
  })

  // Buitenruimtes; a parkeerruimte doesn't ask the oppervlakte.
  const buitenruimtes = values.buitenruimtes ?? []
  const buitenLabels = getRoomLabels(buitenruimtes)
  buitenruimtes.forEach((ruimte, index) => {
    const room = (field: string, value: unknown, message: string) =>
      check(
        STEP.buitenruimtes,
        `buitenruimtes.${index}.${field}`,
        value,
        `${buitenLabels[index]}: ${message}`,
      )

    if (ruimte.type !== "Parkeerruimte") {
      room("oppervlakte", ruimte.oppervlakte, REQUIRED_MESSAGES.oppervlakte)
    }
    room(
      "aantal_adressen",
      ruimte.aantal_adressen,
      REQUIRED_MESSAGES.aantal_adressen,
    )
  })

  // Bijzonderheden
  check(
    STEP.bijzonderheden,
    "monument_soort",
    values.monument_soort,
    REQUIRED_MESSAGES.monument_soort,
  )
  for (const { name, required } of JA_NEE_VRAGEN) {
    check(STEP.bijzonderheden, name, values[name], required)
  }

  return missing
}
