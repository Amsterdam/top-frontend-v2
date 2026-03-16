type DayOfWeek = {
  id: number
  name: string
}

export const DAY_OF_WEEKS: DayOfWeek[] = [
  { id: 0, name: "Maandag" },
  { id: 1, name: "Dinsdag" },
  { id: 2, name: "Woensdag" },
  { id: 3, name: "Donderdag" },
  { id: 4, name: "Vrijdag" },
  { id: 5, name: "Zaterdag" },
  { id: 6, name: "Zondag" },
]

export const DAY_OF_WEEK_MAP: Record<number, string> = Object.fromEntries(
  DAY_OF_WEEKS.map((day) => [day.id, day.name]),
)
