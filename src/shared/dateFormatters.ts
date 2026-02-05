import dayjs from "dayjs"

export function formatDate(
  date?: Date | string | number,
  format = "DD-MM-YYYY",
  placeholder?: string,
): string | null {
  const fallbackPlaceholder = placeholder || null

  if (!date) {
    return fallbackPlaceholder
  }

  const parsedDate = dayjs(date)

  if (!parsedDate.isValid()) {
    return fallbackPlaceholder
  }

  return parsedDate.format(format)
}
