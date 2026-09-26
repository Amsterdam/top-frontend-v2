import dayjs from "dayjs"

/** Energielabels opgenomen from this date on (until LABELS_VALID_AGAIN_FROM) don't count. */
export const LABELS_INVALID_FROM = "2015-01-01"
/** From this date on energielabels count again (opnamemethode NTA 8800). */
export const LABELS_VALID_AGAIN_FROM = "2021-01-01"

/** The energieindex from EP-Online ("1,13") as a number; null when missing or not a number. */
export function parseEnergieIndex(
  energieindex: string | null | undefined,
): number | null {
  if (energieindex == null || energieindex.trim() === "") return null
  const number = Number(energieindex.replace(",", "."))
  return Number.isFinite(number) ? number : null
}

/** Why the energieprestatie falls back to the bouwjaar. */
export type BouwjaarReason =
  /** EP-Online has neither an energielabel nor an energie-index for the address. */
  | "no_data"
  /** meting_geldig_tot has passed, so neither the label nor the index counts. */
  | "expired"
  /** The energielabel was opgenomen from 1 January 2015 until 1 January 2021. */
  | "label_2015_2021"
  /** There's an energielabel, but it's unknown when it was opgenomen. */
  | "unknown_opnamedatum"

/** What the energieprestatie is based on, following the WWS beleid. */
export type EnergieGrondslag =
  | { type: "label"; energielabel: string }
  | { type: "index"; energieindex: number }
  | { type: "bouwjaar"; reason: BouwjaarReason }

/**
 * Decides which of the EP-Online data counts for the energieprestatie:
 * - nothing counts once meting_geldig_tot has passed;
 * - an energie-index always counts when there is one;
 * - an energielabel counts when opgenomen before 1 January 2015 or on or after 1 January 2021;
 * - otherwise the bouwjaar is used.
 */
export function selectEnergieGrondslag(
  energie: PuntentellerEnergie | null | undefined,
  today: string = dayjs().format("YYYY-MM-DD"),
): EnergieGrondslag {
  const energieindex = parseEnergieIndex(energie?.energieindex)
  if (!energie || (!energie.energielabel && energieindex === null)) {
    return { type: "bouwjaar", reason: "no_data" }
  }
  if (
    energie.meting_geldig_tot &&
    dayjs(energie.meting_geldig_tot).isBefore(today, "day")
  ) {
    return { type: "bouwjaar", reason: "expired" }
  }
  if (energieindex !== null) {
    return { type: "index", energieindex }
  }

  // Only an energielabel is left at this point.
  const energielabel = energie.energielabel as string
  if (!energie.opnamedatum) {
    return { type: "bouwjaar", reason: "unknown_opnamedatum" }
  }
  const opnamedatum = dayjs(energie.opnamedatum)
  if (
    !opnamedatum.isBefore(LABELS_INVALID_FROM, "day") &&
    opnamedatum.isBefore(LABELS_VALID_AGAIN_FROM, "day")
  ) {
    return { type: "bouwjaar", reason: "label_2015_2021" }
  }
  return { type: "label", energielabel }
}
