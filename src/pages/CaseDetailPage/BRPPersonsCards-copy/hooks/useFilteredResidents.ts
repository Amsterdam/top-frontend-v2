import dayjs from "dayjs"
import type { Resident } from "../types"

const YEARS_VISIBLE_AFTER_DECEASE = 1

const isRecentDeceased = (resident: Resident) => {
  const raw = resident?.overlijden?.datum?.langFormaat
  if (!raw) return true

  const deceasedDate = dayjs(raw)
  if (!deceasedDate.isValid()) return true

  const cutoff = dayjs().subtract(YEARS_VISIBLE_AFTER_DECEASE, "year")
  return deceasedDate.isSame(cutoff) || deceasedDate.isAfter(cutoff)
}

export const useFilteredResidents = (residents?: Resident[]) => {
  return (residents ?? []).filter(isRecentDeceased)
}
