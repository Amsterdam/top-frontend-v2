import { useCallback, useMemo } from "react"
import { useItinerary, useUpdateItineraryItemPosition } from "@/api/hooks"
import {
  calculateNewPosition,
  itemsPositionSorter,
} from "@/pages/ListPage/components/SortableItineraryItemList/utils"

export const useMoveItineraryItemToBottom = (
  itineraryId?: string,
  itineraryItemId?: number,
) => {
  const { data: itinerary } = useItinerary(itineraryId, { enabled: false })
  const updateItineraryItemPosition = useUpdateItineraryItemPosition({
    itineraryId,
    itineraryItemId,
  })

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

    await updateItineraryItemPosition.mutateAsync({ position: newPosition })
  }, [sortedItems, itineraryItemId, updateItineraryItemPosition])

  return { moveItineraryItemToBottom }
}
