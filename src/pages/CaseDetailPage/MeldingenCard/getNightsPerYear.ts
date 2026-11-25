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
    if (melding.isVerwijderd) {
      continue
    }

    const start = dayjs(melding.startDatum).startOf("day")
    if (!start.isValid()) {
      throw new Error("Ongeldige begindatum voor de nachtentelling.")
    }

    for (let night = 0; night < melding.nachten; night += 1) {
      const nightDate = start.add(night, "day")
      if (nightDate.isBefore(queryStart)) {
        continue
      }

      const year = nightDate.year()
      nightsPerYear.set(year, (nightsPerYear.get(year) ?? 0) + 1)
    }
  }

  return [...nightsPerYear].sort(([yearA], [yearB]) => yearB - yearA)
}
