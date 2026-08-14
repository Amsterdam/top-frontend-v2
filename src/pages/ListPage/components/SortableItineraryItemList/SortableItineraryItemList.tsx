import { useMemo, useState } from "react"
import { flushSync } from "react-dom"
import {
  type DragStartEvent,
  type UniqueIdentifier,
  DndContext,
  DragOverlay,
  closestCenter,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { useItinerary, useUpdateItineraryItemPosition } from "@/api/hooks"
import {
  calculateNewPosition,
  itemsPositionSorter,
  liftedCardStyle,
} from "./utils"
import { SortableItem } from "./SortableItem"
import { ItineraryListItem } from "@/components"
import { Column } from "@amsterdam/design-system-react"

type Props = {
  itineraryId: string
}

export function SortableItineraryItemList({ itineraryId }: Props) {
  const [draggableId, setDraggableId] = useState<UniqueIdentifier>()
  const { data: itinerary } = useItinerary(itineraryId, { enabled: false })
  const updateItineraryItemPosition = useUpdateItineraryItemPosition({
    itineraryId,
    itineraryItemId: draggableId,
  })

  const sortedItems = useMemo(() => {
    const items = itinerary?.items ?? []
    return [...items].sort(itemsPositionSorter)
  }, [itinerary?.items])

  // The order actually rendered. Reordering via the query cache (through
  // the position mutation) goes through React Query's own subscription
  // notification, whose timing we don't fully control relative to dnd-kit's
  // own drop/DragOverlay lifecycle - that mismatch caused the dropped card
  // to render at its old spot for a frame before hopping to its new one.
  // Setting this synchronously (flushSync, in handleDragEnd) removes that
  // race entirely; it's cleared again once the cache catches up to it.
  const [displayOrder, setDisplayOrder] = useState<ItineraryItem[] | null>(null)
  const [previousSortedItems, setPreviousSortedItems] = useState(sortedItems)

  if (sortedItems !== previousSortedItems) {
    setPreviousSortedItems(sortedItems)

    if (
      displayOrder &&
      displayOrder.every((item, index) => item.id === sortedItems[index]?.id)
    ) {
      setDisplayOrder(null)
    }
  }

  const displayedItems = displayOrder ?? sortedItems

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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDraggableId(active.id)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    const oldIndex = sortedItems.findIndex((item) => item.id === active.id)
    const newIndex = sortedItems.findIndex((item) => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newPosition = calculateNewPosition(sortedItems, oldIndex, newIndex)

    // Reorder the rendered list ourselves, synchronously, so dnd-kit's
    // DragOverlay always measures/animates to the correct final position
    // (see the comment on displayOrder above).
    flushSync(() => {
      setDisplayOrder(arrayMove(sortedItems, oldIndex, newIndex))
    })

    updateItineraryItemPosition.mutate({ position: newPosition })
  }

  const itemIds = useMemo(
    () => displayedItems.map((item) => item.id),
    [displayedItems],
  )

  const activeItem = displayedItems.find((item) => item.id === draggableId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <Column>
          {displayedItems.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <ItineraryListItem item={item} />
            </SortableItem>
          ))}
        </Column>
      </SortableContext>
      <DragOverlay>
        {activeItem && (
          <div style={liftedCardStyle}>
            <ItineraryListItem item={activeItem} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default SortableItineraryItemList
