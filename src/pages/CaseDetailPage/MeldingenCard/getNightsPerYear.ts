import dayjs from "dayjs"

export function getNightsPerYear(
  meldingen: Melding[],
  startDate = dayjs().subtract(1, "year").startOf("year").format(),
) {
  const queryStart = dayjs(startDate).startOf("day")
  if (!queryStart.isValid()) {
    throw new Error("Ongeldige begindatum voor de nachtentelling.")
  }
  const firstYear = queryStart.year()
  const lastYear = dayjs().year()
  const nightsPerYear = new Map<number, number>()

  for (let year = lastYear; year >= firstYear; year -= 1) {
    nightsPerYear.set(year, 0)
  }

  for (const melding of meldingen) {
    const start = dayjs(melding.startDatum).startOf("day")
    const end = dayjs(melding.eindDatum).startOf("day")
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      throw new Error("Ongeldige verblijfsperiode voor de nachtentelling.")
    }

    for (const year of nightsPerYear.keys()) {
      const yearStart = dayjs(`${year}-01-01`)
      const yearEnd = yearStart.add(1, "year")
      const rangeStart = queryStart.isAfter(yearStart) ? queryStart : yearStart
      const overlapStart = start.isAfter(rangeStart) ? start : rangeStart
      const overlapEnd = end.isBefore(yearEnd) ? end : yearEnd

      if (overlapEnd.isAfter(overlapStart)) {
        nightsPerYear.set(
          year,
          (nightsPerYear.get(year) ?? 0) +
          overlapEnd.diff(overlapStart, "day"),
        )
      }
    }
  }

  return [...nightsPerYear]
}
