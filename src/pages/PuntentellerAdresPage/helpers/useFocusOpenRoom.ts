import { useEffect, useRef } from "react"

/**
 * Scrolls to a room's form once it opens (added or picked for editing) and focuses its
 * oppervlakte, or its first field when the type has none (e.g. overloop), so the user continues
 * there instead of scrolling down from the type buttons or the table. The scroll is smooth,
 * unless the user asked for reduced motion.
 *
 * @param openRoomId useFieldArray's id of the open room; it also changes when a draft is
 *   replaced by another type, which opens a new form at the same index.
 * @returns the ref for the element around the room's form.
 */
export function useFocusOpenRoom(openRoomId?: string) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!openRoomId || !container) return

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches
    // jsdom doesn't implement scrollIntoView.
    container.scrollIntoView?.({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
    const field =
      container.querySelector<HTMLElement>('[name$=".oppervlakte"]') ??
      container.querySelector<HTMLElement>("input, select, textarea")
    field?.focus({ preventScroll: true })
  }, [openRoomId])

  return ref
}
