/** "Slaapkamer" becomes "Slaapkamer 1", "Slaapkamer 2", ... only when a type occurs more than once. */
export function getRoomLabels<T extends string>(rooms: { type: T }[]) {
  const seen: Partial<Record<T, number>> = {}
  const totals: Partial<Record<T, number>> = {}
  for (const room of rooms) {
    totals[room.type] = (totals[room.type] ?? 0) + 1
  }
  return rooms.map((room) => {
    seen[room.type] = (seen[room.type] ?? 0) + 1
    return (totals[room.type] ?? 0) > 1
      ? `${room.type} ${seen[room.type]}`
      : room.type
  })
}
