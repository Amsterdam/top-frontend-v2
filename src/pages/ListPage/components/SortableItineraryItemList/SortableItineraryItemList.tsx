import { useMemo, useState } from "react"
import {
  type DragStartEvent,
  type UniqueIdentifier,
  DndContext,
  closestCenter,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { useItinerary, useItineraryItem } from "@/api/hooks"
import { calculateNewPosition, itemsPositionSorter } from "./utils"
import { SortableItem } from "./SortableItem"
import { ItineraryListItem } from "@/components"

type Props = {
  itineraryId: string
}

export function SortableItineraryItemList({ itineraryId }: Props) {
  const [draggableId, setIsDragging] = useState<UniqueIdentifier>()
  const [itinerary, { updateCache }] = useItinerary(itineraryId, { lazy: true })
  const [, { execPatch }] = useItineraryItem(draggableId, { lazy: true })

  const sortedItems = useMemo(() => {
    const items = itinerary?.items ?? []
    return [...items].sort(itemsPositionSorter)
  }, [itinerary?.items])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setIsDragging(active.id)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const oldIndex = sortedItems.findIndex((item) => item.id === active.id)
    const newIndex = sortedItems.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newPosition = calculateNewPosition(sortedItems, oldIndex, newIndex)

    updateCache((cache) => {
      const item = cache?.items.find((_) => _.id === active.id)
      if (item) {
        item.position = newPosition
      }
    })

    execPatch({ position: newPosition }, { skipCacheClear: true })
  }

  const itemIds = useMemo(
    () => sortedItems.map((item) => item.id),
    [sortedItems],
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {sortedItems.map((item, index) => (
          <SortableItem key={item.id} id={item.id} animationDelay={index * 0.2}>
            <ItineraryListItem item={item} />
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}

export default SortableItineraryItemList
