import {
  BADKAMER_SECTIONS,
  KEUKEN_SECTIONS,
  TOILETRUIMTE_SECTIONS,
  type FieldSection,
} from "../fieldDefinitions"

type BinnenruimteConfig = {
  /** Whether this type can be verkoeld at all; toiletruimte can't, so the question is skipped. */
  hasVerkoeld: boolean
  /** Extra, type-specific field sections shown below the oppervlakte/verwarmd/verkoeld questions. */
  extra?: readonly FieldSection[]
}

/** Which questions apply to each binnenruimte type, so BinnenruimteFields stays type-agnostic. */
export const BINNENRUIMTE_CONFIG: Record<BinnenruimteType, BinnenruimteConfig> =
  {
    Woonkamer: { hasVerkoeld: true },
    Slaapkamer: { hasVerkoeld: true },
    "Woonkamer met open keuken": { hasVerkoeld: true, extra: KEUKEN_SECTIONS },
    Keuken: { hasVerkoeld: true, extra: KEUKEN_SECTIONS },
    Badkamer: { hasVerkoeld: true, extra: BADKAMER_SECTIONS },
    Toiletruimte: { hasVerkoeld: false, extra: TOILETRUIMTE_SECTIONS },
  }
