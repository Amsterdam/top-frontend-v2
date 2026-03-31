import dayjs from "dayjs"

// Specific for B&B
const GRANTED_STATUS = "verleend"

/**
 * Checks whether the permit is within a valid date range.
 *
 * einddatum = start date of the permit validity
 * datuM_TOT = end date of the permit validity
 */
const hasValidDateRange = ({ einddatum, datuM_TOT }: Permit): boolean => {
  const now = dayjs()

  // If the permit has a start date in the future, it is not yet valid
  if (einddatum && dayjs(einddatum).isAfter(now)) {
    return false
  }

  // If the permit has an end date in the past, it is no longer valid
  if (datuM_TOT && dayjs(datuM_TOT).isBefore(now)) {
    return false
  }

  return true
}

/**
 * Checks whether the permit has granted status
 */
const hasGrantedStatus = ({ resultaat }: Permit): boolean => {
  if (!resultaat) return false
  return resultaat.toLowerCase().includes(GRANTED_STATUS)
}

/**
 * Checks whether a permit is valid
 */
export const isValidPermit = (permit: Permit): boolean => {
  return hasGrantedStatus(permit) && hasValidDateRange(permit)
}

/**
 * Filters only valid permits from a list
 */
export const getValidPermits = (permits: Permit[]): Permit[] => {
  return permits.filter(isValidPermit)
}

/**
 * Sorts permits by:
 * 1. Valid permits first
 * 2. Start date descending (newest first)
 */
export const sortPermits = (a: Permit, b: Permit): number => {
  const aValid = isValidPermit(a)
  const bValid = isValidPermit(b)

  if (aValid !== bValid) {
    return Number(bValid) - Number(aValid)
  }

  const aStart = dayjs(a.startdatum ?? 0)
  const bStart = dayjs(b.startdatum ?? 0)

  if (!aStart.isValid() && !bStart.isValid()) return 0
  if (!aStart.isValid()) return 1
  if (!bStart.isValid()) return -1

  return bStart.diff(aStart)
}
