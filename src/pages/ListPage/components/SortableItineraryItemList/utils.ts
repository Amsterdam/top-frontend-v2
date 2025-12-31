type WithPosition = {
  position: number
}

export function calculateNewPosition(
  items: ItineraryItem[],
  index: number,
  newIndex: number,
): number {
  if (index === newIndex) {
    return items[index].position
  }

  const isMovingForward = index < newIndex
  const targetIndex = isMovingForward ? newIndex + 1 : newIndex

  const previousItem = items[targetIndex - 1]
  const nextItem = items[targetIndex]

  const previousPosition = previousItem ? previousItem.position : 0

  if (!nextItem) {
    return items[items.length - 1].position + 10
  }

  return previousPosition + (nextItem.position - previousPosition) / 2
}

export function itemsPositionSorter<T extends WithPosition>(a: T, b: T) {
  return a.position > b.position ? 1 : -1
}
