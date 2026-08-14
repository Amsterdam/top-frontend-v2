type WithPosition = {
  position: number
}

// The "lifted card" look (shadow + scale), shared by SortableItem's dragged
// placeholder and the DragOverlay clone in SortableItineraryItemList.
export const liftedCardStyle: React.CSSProperties = {
  transform: "scale(1.025)",
  backgroundColor: "#fff",
  borderRadius: 0,
  boxShadow: `rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
    rgba(0, 0, 0, 0.12) 0px 3px 14px 2px,
    rgba(0, 0, 0, 0.2) 0px 5px 5px -3px`,
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
