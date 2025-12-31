import { useSortable } from "@dnd-kit/sortable"

export function SortableItem({
  id,
  children,
  animationDelay = 0,
}: {
  id: number
  children: React.ReactNode

  animationDelay?: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const scale = isDragging ? 1.015 : 1
  const translateY = transform?.y ?? 0
  const translateX = transform?.x ?? 0

  const style: React.CSSProperties = {
    position: "relative",
    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
    transformOrigin: "center",
    transition,
    userSelect: "none",
    touchAction: "manipulation",
    outline: 0,
    backgroundColor: "#fff",
    borderRadius: isDragging ? "4px" : undefined,
    border: isDragging ? "1px solid var(--ams-color-separator)" : undefined,
    boxShadow: isDragging
      ? `rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
         rgba(0, 0, 0, 0.12) 0px 3px 14px 2px,
         rgba(0, 0, 0, 0.2) 0px 5px 5px -3px`
      : "none",
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 999 : "auto",
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="animate-fade-slide-in-bottom"
        style={{
          animationDelay: `${animationDelay}s`,
          borderBottom: "1px solid var(--ams-color-separator)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
