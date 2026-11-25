import dayjs from "dayjs"
import type { Resident } from "../types"
import { toLatestDate } from "./residentDatum"

const YEARS_VISIBLE_AFTER_DECEASE = 1

const isRecentDeceased = (resident: Resident) => {
  // Een onbekende datum telt als recent; bij alleen een jaar telt 31-12.
  const deceasedDate = toLatestDate(resident?.overlijden?.datum)
  if (!deceasedDate?.isValid()) return true

  const cutoff = dayjs().subtract(YEARS_VISIBLE_AFTER_DECEASE, "year")
  return deceasedDate.isSame(cutoff) || deceasedDate.isAfter(cutoff)
}

export const filterDeceasedResidents = (residents?: Resident[]) =>
  (residents ?? []).filter(isRecentDeceased)
