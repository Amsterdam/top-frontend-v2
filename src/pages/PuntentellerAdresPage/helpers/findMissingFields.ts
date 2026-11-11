import {
  BIJZONDERHEDEN_FIELDS,
  hasParkeerplek,
  hasTeVeelLaadpalen,
  PARKEERPLEK_FIELDS,
  REQUIRED_MESSAGES,
  TE_VEEL_LAADPALEN_MESSAGE,
} from "../fieldDefinitions"
import { BINNENRUIMTE_CONFIG } from "../StepBinnenruimtes/binnenruimteConfig"
import { getRoomLabels } from "./getRoomLabels"

/** The wizard steps (see the steps in PuntentellerAdresPage) that hold required fields. */
const STEP = {
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
 * A ruimte's oppervlakte: required on each row (see OppervlakteFields), linked to that row's
 * input. A ruimte without rows falls back to its own oppervlakte.
 */
function oppervlakte(
  ruimte: { vlakken?: Vlak[]; oppervlakte: number | null },
  room: (field: string, value: unknown, message: string) => void,
) {
  const vlakken = ruimte.vlakken ?? []
  if (vlakken.length === 0) {
    room("oppervlakte", ruimte.oppervlakte, REQUIRED_MESSAGES.oppervlakte)
    return
  }
  vlakken.forEach((vlak, vlakIndex) =>
    room(
      `vlakken.${vlakIndex}.oppervlakte`,
      vlak.oppervlakte,
      REQUIRED_MESSAGES.oppervlakte,
    ),
  )
}

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

    if (hasOppervlakte) oppervlakte(ruimte, room)
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

  // Buitenruimtes; a parkeerruimte doesn't ask the oppervlakte, but needs a parkeerplek.
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

    if (ruimte.type !== "Parkeerruimte") oppervlakte(ruimte, room)
    // At least one parkeerplek; linked to the first type's checkbox (see BuitenruimteFields).
    if (ruimte.type === "Parkeerruimte" && !hasParkeerplek(ruimte)) {
      room(PARKEERPLEK_FIELDS[0].name, "", REQUIRED_MESSAGES.parkeerplekken)
    }
    // Not empty but invalid, which the backend refuses all the same, so it's listed too.
    if (ruimte.type === "Parkeerruimte" && hasTeVeelLaadpalen(ruimte)) {
      room("laadpaal", "", TE_VEEL_LAADPALEN_MESSAGE)
    }
  })

  // Bijzonderheden
  for (const { name, required, followUp } of BIJZONDERHEDEN_FIELDS) {
    check(STEP.bijzonderheden, name, values[name], required)
    if (followUp && values[name] === "true") {
      check(
        STEP.bijzonderheden,
        followUp.name,
        values[followUp.name],
        followUp.required,
      )
    }
  }

  return missing
}
