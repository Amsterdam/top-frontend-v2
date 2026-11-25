import type { Resident } from "../types"
import { filterDeceasedResidents } from "./filterDeceasedResidents"
import { getAge } from "./getAge"

export const getVisibleResidentsSortedByAge = (
  residents?: Resident[],
): Resident[] =>
  filterDeceasedResidents(residents).sort((a, b) => {
    const ageA = getAge(a)
    const ageB = getAge(b)

    if (ageA == null && ageB == null) return 0
    if (ageA == null) return 1
    if (ageB == null) return -1

    return ageB - ageA // Oldest first, so sort descending by age
  })
