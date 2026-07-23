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

import {
  useItinerary,
  useUpdateItineraryCache,
  useUpdateItineraryItemPosition,
} from "@/api/hooks"
import { calculateNewPosition, itemsPositionSorter } from "./utils"
import { SortableItem } from "./SortableItem"
import { ItineraryListItem } from "@/components"
import { Column } from "@amsterdam/design-system-react"

type Props = {
  itineraryId: string
}

export function SortableItineraryItemList({ itineraryId }: Props) {
  const [draggableId, setIsDragging] = useState<UniqueIdentifier>()
  const { data: itinerary } = useItinerary(itineraryId, { enabled: false })
  const updateItineraryCache = useUpdateItineraryCache(itineraryId)
  const updateItineraryItemPosition = useUpdateItineraryItemPosition(draggableId)

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

    updateItineraryCache((cache) => {
      const item = cache?.items.find((_) => _.id === active.id)
      if (item) {
        item.position = newPosition
      }
    })

    updateItineraryItemPosition.mutate({ position: newPosition })
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
        <Column>
          {sortedItems.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <ItineraryListItem item={item} />
            </SortableItem>
          ))}
        </Column>
      </SortableContext>
    </DndContext>
  )
}

export default SortableItineraryItemList
