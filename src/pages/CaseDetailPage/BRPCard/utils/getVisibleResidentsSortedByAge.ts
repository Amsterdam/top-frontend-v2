import type { Resident } from "../types"
import { filterDeceasedResidents } from "./filterDeceasedResidents"

export const getVisibleResidentsSortedByAge = (
  residents?: Resident[],
): Resident[] => {
  return filterDeceasedResidents(residents).sort((a, b) => {
    const ageA = a?.leeftijd
    const ageB = b?.leeftijd

    if (ageA == null && ageB == null) return 0
    if (ageA == null) return 1
    if (ageB == null) return -1

    return ageB - ageA // Oldest first, so sort descending by age
  })
}
