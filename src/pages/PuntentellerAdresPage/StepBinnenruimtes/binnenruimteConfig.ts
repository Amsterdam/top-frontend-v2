import {
  BADKAMER_SECTIONS,
  KEUKEN_SECTIONS,
  SLAAPKAMER_SANITAIR_SECTIONS,
  TOILETRUIMTE_SECTIONS,
  type FieldSection,
} from "../fieldDefinitions"

type BinnenruimteConfig = {
  /** Whether this type asks the verwarmd question at all; defaults to true. When false,
   * verwarmd is always forced to "ja" without asking. */
  hasVerwarmd?: boolean
  /** Whether this type can be verkoeld at all; defaults to true. Toiletruimte and overloop
   * can't, so the question is skipped there. */
  hasVerkoeld?: boolean
  /** Whether oppervlakte counts for this type; defaults to true. An overloop doesn't, so the
   * lengte/breedte/oppervlakte question is skipped entirely. */
  hasOppervlakte?: boolean
  /** Extra, type-specific field sections shown below the oppervlakte/verwarmd/verkoeld questions. */
  extra?: readonly FieldSection[]
}

/** Which questions apply to each binnenruimte type, so BinnenruimteFields stays type-agnostic. */
export const BINNENRUIMTE_CONFIG: Record<BinnenruimteType, BinnenruimteConfig> =
  {
    Woonkamer: {},
    Slaapkamer: {},
    "Woonkamer met open keuken": { extra: KEUKEN_SECTIONS },
    Keuken: { extra: KEUKEN_SECTIONS },
    Badkamer: { extra: BADKAMER_SECTIONS },
    Toiletruimte: { hasVerkoeld: false, extra: TOILETRUIMTE_SECTIONS },

    "Woon- en slaapkamer": {},
    "Slaapkamer met wastafel, douche of bad": {
      extra: SLAAPKAMER_SANITAIR_SECTIONS,
    },
    "Woon- en slaapkamer met keuken": { extra: KEUKEN_SECTIONS },
    Overloop: { hasVerkoeld: false, hasOppervlakte: false },
    "Kleine kamer (kleiner dan 4 m²)": { hasVerkoeld: false },
    "Wasruimte / bijkeuken": { hasVerkoeld: false },
    Berging: { hasVerkoeld: false },
    Garage: { hasVerkoeld: false },
    Kelder: { hasVerkoeld: false },
    Zolder: {},
    "Zolderberging met vaste trap": { hasVerkoeld: false },
    "Zolderberging zonder vaste trap": { hasVerkoeld: false },

    "Bad, douche of wastafel in andere ruimte": {
      hasOppervlakte: false,
      hasVerwarmd: false,
      hasVerkoeld: false,
      extra: BADKAMER_SECTIONS,
    },
    "Keuken in andere ruimte": {
      hasOppervlakte: false,
      hasVerwarmd: false,
      hasVerkoeld: false,
      extra: KEUKEN_SECTIONS,
    },
  }

/**
 * The starting values of a new room's voorzieningen: "0" for the counts and "" (unanswered)
 * for the fields with options. Those are required (douche/bad, aanrechtlengte), and "0"
 * isn't one of their options, so it would pass the required check without a choice.
 */
export function emptyVoorzieningen(
  type: BinnenruimteType,
): BinnenruimteVoorzieningen {
  const fields = (BINNENRUIMTE_CONFIG[type].extra ?? []).flatMap(
    (section) => section.fields,
  )
  return Object.fromEntries(
    fields.map((field) => [field.name, "options" in field ? "" : "0"]),
  )
}
