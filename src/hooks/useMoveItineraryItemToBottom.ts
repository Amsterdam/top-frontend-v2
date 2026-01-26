import { useCallback, useMemo } from "react"
import { useItinerary, useItineraryItem } from "@/api/hooks"
import {
  calculateNewPosition,
  itemsPositionSorter,
} from "@/pages/ListPage/components/SortableItineraryItemList/utils"

export const useMoveItineraryItemToBottom = (
  itineraryId?: string,
  itineraryItemId?: number,
) => {
  const [itinerary, { updateCache }] = useItinerary(itineraryId, { lazy: true })
  const [, { execPatch }] = useItineraryItem(itineraryItemId, { lazy: true })

  const sortedItems = useMemo(() => {
    return [...(itinerary?.items ?? [])].sort(itemsPositionSorter)
  }, [itinerary?.items])

  const moveItineraryItemToBottom = useCallback(async () => {
    const oldIndex = sortedItems.findIndex(
      (item) => item.id === itineraryItemId,
    )
    const newIndex = sortedItems.length - 1

    if (oldIndex === -1) return

    const newPosition = calculateNewPosition(sortedItems, oldIndex, newIndex)

    updateCache((cache) => {
      const item = cache?.items.find((i) => i.id === itineraryItemId)
      if (item) item.position = newPosition
    })

    await execPatch({ position: newPosition }, { skipCacheClear: true })
  }, [sortedItems, updateCache, itineraryItemId, execPatch])

  return { moveItineraryItemToBottom }
}
