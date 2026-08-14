import { useSortable } from "@dnd-kit/sortable"

export function SortableItem({
  id,
  children,
  animationDelay = 0,
}: {
  id: number
  children: React.ReactNode
  animationDelay?: number // in seconds
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const translateY = transform?.y ?? 0
  const translateX = transform?.x ?? 0

  // While dragging, this element stays in place as a dimmed placeholder -
  // the DragOverlay renders the actual "lifted" clone that follows the
  // pointer and animates smoothly to its final spot on drop.
  const style: React.CSSProperties = {
    position: "relative",
    transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
    transition,
    userSelect: "none",
    touchAction: "manipulation",
    outline: 0,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        style={{
          animationDelay: `${animationDelay}s`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
