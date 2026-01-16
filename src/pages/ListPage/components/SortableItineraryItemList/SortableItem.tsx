import { useSortable } from "@dnd-kit/sortable"
import { useEffect, useEffectEvent, useState } from "react"

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

  const [animate, setAnimate] = useState(true)

  const updateAnimate = useEffectEvent((bool: boolean) => {
    setAnimate(bool)
  })

  useEffect(() => {
    const duration = 1000 // duration of the animation in ms
    const timer = setTimeout(
      () => {
        updateAnimate(false)
      },
      duration + animationDelay * 1000,
    )
    return () => clearTimeout(timer)
  }, [animationDelay])

  const scale = isDragging ? 1.025 : 1
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
    borderRadius: isDragging ? 4 : 0,
    padding: isDragging ? "0px 16px" : 0,
    marginBottom: 2, // small gap to prevent bottom border from disappearing
    borderBottom: "1px solid var(--ams-color-separator)",
    borderTop: isDragging ? "1px solid var(--ams-color-separator)" : undefined,
    borderLeft: isDragging ? "1px solid var(--ams-color-separator)" : undefined,
    borderRight: isDragging
      ? "1px solid var(--ams-color-separator)"
      : undefined,
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
        className={animate ? "animate-slide-in-left" : ""}
        style={{
          animationDelay: `${animationDelay}s`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
