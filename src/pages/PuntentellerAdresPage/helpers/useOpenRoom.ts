import { useState } from "react"

type Options<T> = {
  /** The number of rooms currently in the list (useFieldArray's fields.length). */
  count: number
  append: (room: T) => void
  remove: (index: number) => void
}

/**
 * Which room in a useFieldArray list is open as an editable form, as opposed to a row in the
 * list. Adding a room while the open one is still an unsaved draft replaces that draft, so
 * repeatedly clicking a type button can't pile up unsaved rooms; only rooms that were actually
 * saved end up in the list.
 */
export function useOpenRoom<T>({ count, append, remove }: Options<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isDraftOpen, setIsDraftOpen] = useState(false)

  const add = (room: T) => {
    const replacesDraft = openIndex !== null && isDraftOpen
    if (replacesDraft) {
      remove(openIndex)
    }
    append(room)
    setOpenIndex(replacesDraft ? count - 1 : count)
    setIsDraftOpen(true)
  }

  const edit = (index: number) => {
    setOpenIndex(index)
    setIsDraftOpen(false)
  }

  const save = () => {
    setOpenIndex(null)
    setIsDraftOpen(false)
  }

  const removeRoom = (index: number) => {
    remove(index)
    setOpenIndex((current) => {
      if (current === null || index === current) return null
      return index < current ? current - 1 : current
    })
  }

  return { openIndex, add, edit, save, remove: removeRoom }
}
