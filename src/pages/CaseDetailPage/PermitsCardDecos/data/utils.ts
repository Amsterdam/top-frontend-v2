import dayjs from "dayjs"

export function filterKnownPermits(
  permits?: PermitDecos[],
): PermitDecos[] | undefined {
  const result =
    permits?.filter(({ permit_granted }) => permit_granted !== "UNKNOWN") || []
  return result.length === 0 ? undefined : result
}

export function isDateValid(permit: PermitDecos) {
  const details = permit?.details

  const startDate = details?.DATE_VALID_FROM
  const endDate = details?.DATE_VALID_TO ?? details?.DATE_VALID_UNTIL

  const now = dayjs()

  // If there is a start date and it is in the future, it is not valid.
  if (startDate && dayjs(startDate).isAfter(now)) {
    return false
  }
  // If there is an end date, it cannot be in the past.
  if (endDate && dayjs(endDate).isBefore(now)) {
    return false
  }

  return true
}
