export function getTopPosition(items?: { position: number }[]): number {
  if (!items || items.length === 0) {
    return 1
  }
  const lowest = Math.min(...items.map((item) => item.position))
  return lowest / 2
}
